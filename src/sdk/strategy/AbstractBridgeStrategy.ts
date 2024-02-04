import {ChainId} from '@layerzerolabs/lz-sdk';
import {BridgeApi, TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {
  AdapterParams,
  Currency,
  CurrencyAmount,
  isEvmChainId,
  isNativeCurrency,
  TransactionResult,
} from '@layerzerolabs/ui-core';
import {approveMax, isApproved, walletStore} from '@layerzerolabs/ui-mobx';
import assert from 'assert';

import {bridgeStore} from '../../stores/bridgeStore';
import {BridgeStrategy} from './BridgeStrategy';
import {Signer as EthersSigner} from 'ethers';
import {assertWallet} from './assertWallet';

/**
 * Most methods in BridgeStrategy are just facade for BridgeApi
 * this abstract class provides default implementation
 */
export abstract class AbstractBridgeStrategy<
  Api extends BridgeApi<Signer, unknown>,
  Signer = unknown,
> implements
    Pick<
      BridgeStrategy,
      | 'transfer'
      | 'getMessageFee'
      | 'getLimit'
      | 'getUnclaimed'
      | 'claim'
      | 'estimateNative'
      | 'approve'
      | 'isApproved'
      | 'register'
      | 'isRegistered'
      | 'supports'
      | 'isApplicable'
    >
{
  constructor(protected readonly api: Api) {}

  abstract spender(): string | undefined;

  abstract signer(): Signer;

  approve(): Promise<unknown> {
    const {srcCurrency} = bridgeStore.form;
    assert(srcCurrency, 'srcCurrency');
    const spender = this.spender();
    assert(spender);
    return approveMax(srcCurrency, spender);
  }

  async transfer(input: TransferInput) {
    const tx = await this.api.transfer(input);
    const signer = this.signer();

    if (isEvmChainId(input.srcChainId)) {
      // ensure wallet didn't switch
      await assertWallet(signer as EthersSigner, {
        address: input.srcAddress,
        chainId: input.srcChainId,
      });
    }
    const result = await tx.signAndSubmitTransaction(signer);

    return result;
  }

  isApproved(): boolean | undefined {
    const {amount} = bridgeStore;
    if (!amount) return undefined;
    const spender = this.spender();
    if (!spender) return true;
    if (isEvmChainId(amount.currency.chainId)) {
      // ETH
      if (isNativeCurrency(amount.currency)) return true;
    }
    return isApproved(amount, spender);
  }

  getMessageFee(adapterParams = AdapterParams.forV1()) {
    const {srcChainId, dstChainId} = bridgeStore.form;
    assert(srcChainId, 'srcChainId');
    assert(dstChainId, 'dstChainId');
    return this.api.getMessageFee(srcChainId, dstChainId, adapterParams);
  }

  getLimit(srcCurrency: Currency, dstCurrency: Currency): Promise<CurrencyAmount<Currency>> {
    return this.api.getLimit(srcCurrency, dstCurrency);
  }

  getExtraGas(srcChainId: ChainId, dstChainId: ChainId): Promise<number> {
    return this.api.getExtraGas(srcChainId, dstChainId);
  }

  getUnclaimed(currency: Currency, address: string): Promise<CurrencyAmount<Currency>> {
    return this.api.getUnclaimed(currency, address);
  }

  isRegistered(currency: Currency, address: string): Promise<boolean> {
    return this.api.isRegistered(currency, address);
  }

  isApplicable() {
    const {srcCurrency, dstCurrency} = bridgeStore.form;
    if (!srcCurrency) return false;
    if (!dstCurrency) return false;
    return this.api.supports(srcCurrency, dstCurrency);
  }

  supports(srcCurrency: Currency, dstCurrency?: Currency): boolean {
    if (!dstCurrency) {
      return this.api.supports(srcCurrency);
    }
    return this.api.supports(srcCurrency, dstCurrency);
  }

  async register(currency: Currency): Promise<TransactionResult> {
    const tx = await this.api.register(currency);
    const result = await tx.signAndSubmitTransaction(this.signer());
    return result;
  }

  async claim(currency: Currency): Promise<TransactionResult> {
    const tx = await this.api.claim(currency);
    const result = await tx.signAndSubmitTransaction(this.signer());
    return result;
  }

  get estimateNative() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const strategy = this;
    return {
      async register(currency: Currency): Promise<CurrencyAmount<Currency>> {
        const tx = await strategy.api.register(currency);
        return tx.estimateNative(strategy.signer());
      },
    };
  }
}

export function getEvmSigner() {
  const {evm} = walletStore;
  assert(evm?.signer);
  return evm.signer;
}

export function getAptosSigner() {
  const {aptos} = walletStore;
  assert(aptos?.signer);
  return aptos.signer;
}
