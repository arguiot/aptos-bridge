import {isErrorOfTableItemNotFound} from '@layerzerolabs/ui-aptos';
import {OftBridgeConfig} from '@layerzerolabs/ui-bridge-oft';
import {
  castCurrencyAmountUnsafe,
  Currency,
  CurrencyAmount,
  isAptosChainId,
  isToken,
  MaxUint256,
  toCurrencyAmount,
} from '@layerzerolabs/ui-core';
import {ProviderFactory} from '@layerzerolabs/ui-ethers';
import {AptosClient} from 'aptos';
import assert from 'assert';
import {BigNumber, Contract, utils} from 'ethers';
import useSWR from 'swr';

import {bridgeStore} from '../stores/bridgeStore';

let cakeLimitApi: CakeLimitApi;

export function setCakeLimitApi(_cakeLimitApi: CakeLimitApi) {
  cakeLimitApi = _cakeLimitApi;
}

export function useCakeLimitAmount(): {isCake: boolean; limit?: CurrencyAmount; error?: string} {
  const {srcAddress, dstAddress, form, amount} = bridgeStore;
  const {srcCurrency, dstCurrency} = form;
  const isCake = srcCurrency?.symbol.toUpperCase() === 'CAKE';
  const {data: limit} = useSWR(
    isCake
      ? [
          srcCurrency.chainId,
          srcCurrency?.symbol,
          srcAddress,
          dstCurrency?.chainId,
          dstCurrency?.symbol,
          dstAddress,
        ].join(':')
      : null,
    async () => {
      assert(isCake);
      assert(srcCurrency);
      assert(dstCurrency);
      assert(srcAddress);
      assert(dstAddress);
      return cakeLimitApi.getLimit(srcCurrency, dstCurrency, srcAddress, dstAddress);
    },
  );

  let error: string | undefined = undefined;
  if (isCake && amount) {
    if (limit) {
      if (limit.lessThan(amount)) {
        error = `Limit ${limit.toSignificant()} ${amount.currency.symbol} exceeded`;
      }
    } else {
      error = 'Checking ...';
    }
  }

  return {
    isCake,
    limit,
    error,
  };
}

// EVM proxy interface
const iface = new utils.Interface([
  'function whitelist(address) view returns (bool)',
  'function paused() view returns (bool)',
  'function chainIdToOutboundCap(uint16) view returns (uint256)',
  'function chainIdToSentTokenAmount(uint16) view returns (uint256)',
  'function chainIdToInboundCap(uint16) view returns (uint256)',
  'function chainIdToReceivedTokenAmount(uint16) view returns (uint256)',
]);

export class CakeLimitApi {
  constructor(private readonly api: CakeExtras[]) {}
  async getLimit(
    srcCurrency: Currency,
    dstCurrency: Currency,
    srcAddress: string,
    dstAddress: string,
  ) {
    const srcApi = this.api.find((api) => api.srcCurrency.equals(srcCurrency));
    const dstApi = this.api.find((api) => api.srcCurrency.equals(dstCurrency));
    assert(srcApi);
    assert(dstApi);

    const [srcPaused, dstPaused] = await Promise.all([srcApi.isPaused(), dstApi.isPaused()]);
    if (srcPaused || dstPaused) return CurrencyAmount.fromRawAmount(srcCurrency, 0);

    const [srcWhitelisted, dstWhitelisted] = await Promise.all([
      srcApi.isWhitelisted(srcAddress),
      dstApi.isWhitelisted(dstAddress),
    ]);

    if (
      (srcWhitelisted && dstWhitelisted) || // both whitelisted
      (isAptosChainId(dstCurrency.chainId) && dstWhitelisted) // dst whitelisted and sending from aptos
    ) {
      return CurrencyAmount.fromRawAmount(srcCurrency, MaxUint256);
    }

    const srcLimit = await srcApi.getLimit(dstCurrency);
    return srcLimit;
  }
}

interface CakeExtras {
  readonly srcCurrency: Currency;
  isWhitelisted(address: string): Promise<boolean>;
  isPaused(): Promise<boolean>;
  getLimit(dstCurrency: Currency): Promise<CurrencyAmount>;
}

export class CakeExtras__evm implements CakeExtras {
  constructor(
    readonly srcCurrency: Currency,
    private oftConfig: OftBridgeConfig,
    private providerFactory: ProviderFactory,
  ) {}

  async isWhitelisted(address: string): Promise<boolean> {
    const contract = this.getProxyContract();
    const whitelisted: boolean = await contract.whitelist(address);
    return whitelisted;
  }

  async isPaused(): Promise<boolean> {
    const contract = this.getProxyContract();
    const paused: boolean = await contract.paused();
    return paused;
  }

  async getLimit(dstCurrency: Currency): Promise<CurrencyAmount<Currency>> {
    // BSC -> Aptos
    // const limitAmount = chainIdToOutboundCap(10108) - chainIdToSentTokenAmount(10108)
    const contract = this.getProxyContract();
    const [chainIdToOutboundCap, chainIdToSentTokenAmount]: [BigNumber, BigNumber] =
      await Promise.all([
        contract.chainIdToOutboundCap(dstCurrency.chainId),
        contract.chainIdToSentTokenAmount(dstCurrency.chainId),
      ]);
    const limit = chainIdToOutboundCap.sub(chainIdToSentTokenAmount);
    return toCurrencyAmount(this.srcCurrency, limit);
  }

  getProxyContract() {
    const proxy = this.oftConfig.proxy.at(0);
    assert(proxy);
    const contract = new Contract(proxy.address, iface, this.providerFactory(proxy.chainId));
    return contract;
  }
}

export class CakeExtras__aptos implements CakeExtras {
  constructor(
    readonly srcCurrency: Currency,
    private aptosClient: AptosClient,
    private oftConfig: OftBridgeConfig,
    private providerFactory: ProviderFactory,
  ) {}

  async getConfig() {
    const srcCurrency = this.srcCurrency;
    assert(srcCurrency);

    const deployedAddress = getOftDeployedAddress(srcCurrency);
    const resourceType = `${deployedAddress}::oft::OFT`;

    const {data} = await this.aptosClient.getAccountResource(deployedAddress, resourceType);
    return data as {white_list: {handle: string}; paused: boolean};
  }

  async isWhitelisted(address: string): Promise<boolean> {
    const config = await this.getConfig();

    try {
      const item = await this.aptosClient.getTableItem(config.white_list.handle, {
        key: address, // user address
        key_type: 'address',
        value_type: 'bool',
      });
      return Boolean(item);
    } catch (e) {
      if (isErrorOfTableItemNotFound(e)) return false;
      throw e;
    }
  }

  async isPaused(): Promise<boolean> {
    const config = await this.getConfig();
    return config.paused;
  }

  async getLimit(dstCurrency: Currency): Promise<CurrencyAmount<Currency>> {
    // Aptos ->BSC
    // const limitAmount = chainIdToInboundCap(10108) - chainIdToReceivedTokenAmount(10108)
    const srcCurrency = this.srcCurrency;
    const contract = this.getProxyContract();
    const [chainIdToInboundCap, chainIdToReceivedTokenAmount]: [BigNumber, BigNumber] =
      await Promise.all([
        contract.chainIdToInboundCap(srcCurrency.chainId),
        contract.chainIdToReceivedTokenAmount(srcCurrency.chainId),
      ]);
    const limit = chainIdToInboundCap.sub(chainIdToReceivedTokenAmount);
    // limit expressed in dst currency
    const limitDstCurrency = toCurrencyAmount(dstCurrency, limit);
    return castCurrencyAmountUnsafe(limitDstCurrency, srcCurrency);
  }

  getProxyContract() {
    const proxy = this.oftConfig.proxy.at(0);
    assert(proxy);
    const contract = new Contract(proxy.address, iface, this.providerFactory(proxy.chainId));
    return contract;
  }
}

function getOftDeployedAddress(token: Currency) {
  assert(isToken(token));
  assert(isAptosChainId(token.chainId));
  // todo: test address in form "address::module::type"
  const [address] = token.address.split('::');
  return address;
}
