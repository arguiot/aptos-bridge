import {ChainId} from '@layerzerolabs/lz-sdk';
import type {TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {
  AdapterParams,
  Currency,
  CurrencyAmount,
  FeeQuote,
  getNativeCurrency,
  getScanLink,
  getTransactionLink,
  isAptosChainId,
  isEvmChainId,
  isNativeCurrency,
  isToken,
  TransactionResult,
  tryGetNetwork,
  tryParseCurrencyAmount,
  tryParseNumber,
} from '@layerzerolabs/ui-core';
import {ONE_ADDRESS} from '@layerzerolabs/ui-ethers';
import {Toast} from '@layerzerolabs/ui-kit';
import {
  airdropStore,
  approveStore,
  balanceStore,
  displayError,
  getWalletBalance,
  parseWalletError,
  relayerStore,
  resourceStore,
  switchChain,
  transactionStore,
  waitForMessageReceived,
  Wallet,
  walletStore,
} from '@layerzerolabs/ui-mobx';
import assert from 'assert';
import {uniq} from 'lodash';
import {autorun} from 'mobx';
import {flow, getEnv, types, unprotect} from 'mobx-state-tree';
import {toast} from 'react-toastify';

import {reportTransfer} from '../analytics/reportTransfer';
import {APTOS_CHAIN_ID} from '../config/env';
import {BridgeOutput, BridgeStrategy} from '../sdk/strategy/BridgeStrategy';
import {getExpectedTransferDate} from '../utils/getExpectedTransferDate';
import {configStore} from './configStore';
import {uiStore} from './uiStore';
import {unclaimedStore} from './unclaimedStore';

export enum DstNativeAmount {
  DEFAULT = 'DEFAULT',
  MAX = 'MAX',
}
export type ValidationError = string;

const FormModel = types.model({
  srcCurrency: types.frozen<Currency | undefined>(),
  dstCurrency: types.frozen<Currency | undefined>(),
  srcChainId: types.frozen<ChainId | undefined>(),
  dstChainId: types.frozen<ChainId | undefined>(),
  amount: '',
  dstNativeAmount: DstNativeAmount.DEFAULT,
});

const BridgeStoreModel = types
  .model({
    isLoading: false,
    isSigning: false,
    isMining: false,
    isExecuting: false,
    isApproving: false,
    isRegistering: false,
    form: types.optional(FormModel, () => FormModel.create()),
    messageFee: types.maybe(types.frozen<FeeQuote>()),
    output: types.maybe(types.frozen<BridgeOutput | undefined>()),
    extraGas: types.maybe(types.number),
    //
    outputError: types.maybe(types.string),
    limitAmount: types.frozen<CurrencyAmount | undefined>(),
    strategies: types.array(types.frozen<BridgeStrategy>()),
  })
  .views((store) => {
    const views = {
      get strategy(): BridgeStrategy | undefined {
        return store.strategies.find((i) => i.isApplicable());
      },
      get currencies(): Currency[] {
        const env = getEnv<BridgeStoreEnv>(store);
        return env.currencies.filter((token) => {
          if (!configStore.chains.includes(token.chainId)) return false;
          if (!configStore.tokens.includes(token.symbol)) return false;
          return true;
        });
      },
      get chains(): ChainId[] {
        return uniq(this.currencies.map((c) => c.chainId));
      },
      get srcCurrencyOptions(): CurrencyOption[] {
        return this.currencies.map((currency) => {
          const disabled = isSrcCurrencyDisabled(currency);
          const balance = getWalletBalance(currency);
          const isZero = !balance || balance?.equalTo(0);
          return {
            currency,
            disabled,
            overlay: disabled && !isZero ? 'Not available' : undefined,
          };
        });
      },
      get dstCurrencyOptions(): CurrencyOption[] {
        return this.currencies
          .map((currency) => ({
            currency,
            disabled: isDstCurrencyDisabled(currency),
          }))
          .filter((i) => !i.disabled);
      },
      get srcNetworkOptions(): ChainOption[] {
        const chains = uniq(this.srcCurrencyOptions.map((c) => c.currency.chainId));
        return chains.map((chainId) => ({
          chainId,
          disabled: isSrcChainDisabled(chainId),
        }));
      },

      get dstNetworkOptions(): ChainOption[] {
        const {srcCurrency} = store.form;

        return this.chains.map((dstChainId) => {
          const error: string | undefined = srcCurrency
            ? srcCurrency.chainId === dstChainId
              ? 'Transfers between same chain not available'
              : isAptosChainId(srcCurrency.chainId) && isAptosChainId(dstChainId)
              ? 'Transfers between APTOS not available'
              : isEvmChainId(srcCurrency.chainId) && isEvmChainId(dstChainId)
              ? 'Transfers between EVM not available'
              : findMatchingCurrencyOnChain(srcCurrency, dstChainId) === undefined
              ? `${srcCurrency.symbol} is not available on ${tryGetNetwork(dstChainId)?.name}`
              : undefined
            : undefined;

          return {
            chainId: dstChainId,
            disabled: !!error,
            overlay: error,
          };
        });
      },

      get dstWallet(): Wallet | undefined {
        const {dstChainId, srcChainId} = store.form;
        if (dstChainId) {
          if (isAptosChainId(dstChainId)) return walletStore.aptos;
          if (isEvmChainId(dstChainId)) return walletStore.evm;
        }
        if (srcChainId) {
          if (isAptosChainId(srcChainId)) return walletStore.evm;
          if (isEvmChainId(srcChainId)) return walletStore.aptos;
        }
        return undefined;
      },

      get srcWallet(): Wallet | undefined {
        const {srcChainId, dstChainId} = store.form;
        if (srcChainId) {
          if (isAptosChainId(srcChainId)) return walletStore.aptos;
          if (isEvmChainId(srcChainId)) return walletStore.evm;
        }
        if (dstChainId) {
          if (isAptosChainId(dstChainId)) return walletStore.evm;
          if (isEvmChainId(dstChainId)) return walletStore.aptos;
        }
        return undefined;
      },

      get srcAddress(): string | undefined {
        return this.srcWallet?.account;
      },

      get dstAddress(): string | undefined {
        return this.dstWallet?.account;
      },
      get srcNativeBalance(): CurrencyAmount | undefined {
        if (!store.form.srcChainId) return undefined;
        const native = getNativeCurrency(store.form.srcChainId);
        return getWalletBalance(native);
      },
      get dstNativeBalance(): CurrencyAmount | undefined {
        if (!store.form.dstChainId) return undefined;
        const native = getNativeCurrency(store.form.dstChainId);
        return getWalletBalance(native);
      },
      get srcNativeCost(): CurrencyAmount | undefined {
        return store.messageFee?.nativeFee;
      },
      get maxDstNativeAmount(): CurrencyAmount | undefined {
        const {dstChainId, srcChainId} = store.form;
        if (!srcChainId) return undefined;
        if (!dstChainId) return undefined;
        const config = relayerStore.pickDstConfig(srcChainId, dstChainId);
        return config?.dstNativeAmtCap;
      },
      get maxAmount(): CurrencyAmount | undefined {
        const {srcChainId} = store.form;
        const {srcBalance, srcNativeCost} = this;
        if (!srcChainId) return undefined;
        if (!srcBalance) return undefined;
        if (isAptosChainId(srcChainId)) {
          const {limitAmount} = store;
          if (!limitAmount) return undefined;
          if (limitAmount.lessThan(srcBalance)) return limitAmount;
          return srcBalance;
        }
        if (isEvmChainId(srcChainId)) {
          if (srcBalance.currency.symbol !== 'ETH') return srcBalance;
          if (!srcNativeCost) return undefined;
          const maxAmount = srcBalance.subtract(srcNativeCost);
          if (maxAmount.greaterThan(0)) return maxAmount;
        }
        return undefined;
      },
      get srcBalance(): CurrencyAmount | undefined {
        return getWalletBalance(store.form.srcCurrency);
      },
      get dstBalance(): CurrencyAmount | undefined {
        return getWalletBalance(store.form.dstCurrency);
      },
      get amount(): CurrencyAmount | undefined {
        return tryParseCurrencyAmount(store.form.srcCurrency, store.form.amount);
      },
      get outputAmount(): CurrencyAmount | undefined {
        return store.output?.amount;
      },
      get dstNativeAmount(): CurrencyAmount | undefined {
        const {dstNativeAmount, dstChainId} = store.form;
        if (!dstChainId) return undefined;
        const native = getNativeCurrency(dstChainId);
        const zero = CurrencyAmount.fromRawAmount(native, 0);

        if (!dstNativeAmount) return zero;

        if (DstNativeAmount.DEFAULT === dstNativeAmount) {
          const {dstNativeBalance} = this;
          const minAmount = airdropStore.getDefault(dstChainId);
          if (!dstNativeBalance) return undefined;
          if (!minAmount) return undefined;
          if (dstNativeBalance.lessThan(minAmount)) {
            return minAmount;
          }
          return zero;
        }

        if (dstNativeAmount === DstNativeAmount.MAX) {
          return this.maxDstNativeAmount;
        }

        return tryParseCurrencyAmount(native, dstNativeAmount);
      },
      get errors() {
        const errors: ValidationError[] = [];
        function addError(error: string) {
          errors.push(error);
        }
        const {srcNativeBalance, srcNativeCost, amount} = this;
        const {srcChainId, dstChainId, srcCurrency, dstCurrency} = store.form;
        const {limitAmount} = store;
        if (srcChainId && srcChainId === dstChainId) {
          addError('Select different chain');
        }

        if (srcChainId === ChainId.APTOS && dstChainId === ChainId.OPTIMISM) {
          addError('Pathway under maintenance');
        }

        if (srcNativeCost && srcNativeBalance) {
          if (srcNativeCost.greaterThan(srcNativeBalance)) {
            addError('Not enough native for gas');
          }
        }
        if (!dstChainId) addError('Select network');
        if (!srcChainId) {
          addError('Select network');
        }
        if (!amount || !amount.greaterThan(0)) {
          addError('Enter amount');
        } else if (limitAmount?.lessThan(amount)) {
          addError('Limit exceeded');
        } else if (this.maxAmount?.lessThan(amount)) {
          addError('Insufficient balance');
        } else if (this.outputAmount?.equalTo(0)) {
          addError('Enter amount');
        }
        if (srcChainId && srcChainId === dstChainId) {
          addError('Change network');
        }
        if (!this.dstNativeAmount) {
          addError('Set gas on destination');
        } else if (
          this.maxDstNativeAmount &&
          this.dstNativeAmount.greaterThan(this.maxDstNativeAmount)
        ) {
          addError('Gas too large');
        }
        // sanity checks
        if (srcChainId && srcCurrency && srcChainId !== srcCurrency.chainId) {
          addError('Select other pair');
        }
        if (dstChainId && dstCurrency && dstChainId !== dstCurrency.chainId) {
          addError('Select other pair');
        }
        if (srcCurrency && dstCurrency && !isValidPair(srcCurrency, dstCurrency)) {
          addError('Select other pair');
        }
        if (!store.messageFee) addError('Checking fee ...');
        if (!store.output) addError('Checking fee ...');
        if (!limitAmount) addError('Checking limit...');
        return errors;
      },
      get unclaimed(): CurrencyAmount[] {
        const {unclaimed} = unclaimedStore;
        return unclaimed.map((balance) => balance.amount);
      },
      get hasUnclaimed(): boolean {
        return this.unclaimed.length > 0;
      },
      get isApproved(): boolean | undefined {
        return this.strategy?.isApproved();
      },
      get isRegistered(): boolean | undefined {
        const {dstCurrency} = store.form;
        if (!dstCurrency) return undefined;
        if (isEvmChainId(dstCurrency.chainId)) return true;
        if (isAptosChainId(dstCurrency.chainId)) {
          return resourceStore.isRegistered(dstCurrency);
        }
        // not implemented
        return false;
      },
      get adapterParams(): AdapterParams | undefined {
        const {extraGas} = store;
        const {dstNativeAmount, dstAddress} = this;
        // extraGas should not be be 0
        if (!extraGas) return undefined;
        if (!dstNativeAmount) return undefined;
        return AdapterParams.forV2({
          extraGas,
          dstNativeAmount: dstNativeAmount,
          dstNativeAddress: dstAddress ?? ONE_ADDRESS,
        });
      },
    };
    return views;
  })
  .actions((store) => {
    const register: () => Promise<unknown> = flow(function* () {
      store.isRegistering = true;
      try {
        const {dstCurrency} = store.form;
        assert(dstCurrency, 'dstCurrency');
        const result: Awaited<ReturnType<typeof resourceStore['register']>> =
          yield resourceStore.register(dstCurrency);
        toast.success(
          <Toast>
            <h1>Transaction Submitted</h1>
            <p>
              <a
                href={getTransactionLink(dstCurrency.chainId, result.txHash)}
                target='_blank'
                rel='noreferrer'
              >
                View on block explorer
              </a>
            </p>
          </Toast>,
        );
      } finally {
        store.isRegistering = false;
      }
    });

    const approve: () => Promise<unknown> = flow(function* () {
      store.isApproving = true;
      try {
        const {strategy} = store;
        assert(strategy, 'strategy');
        yield strategy.approve();
      } finally {
        store.isApproving = false;
      }
    });

    const actions = {
      setAmount(amount: string) {
        if (tryParseNumber(amount) !== undefined) {
          store.form.amount = amount;
        }
      },
      setDstNativeAmount(amount: string | DstNativeAmount): void {
        if (amount in DstNativeAmount) {
          store.form.dstNativeAmount = amount;
        }
        const {dstChainId} = store.form;
        if (!dstChainId) return;

        const dstNative = getNativeCurrency(dstChainId);
        if (amount === '' || tryParseCurrencyAmount(dstNative, amount) !== undefined) {
          store.form.dstNativeAmount = amount;
        }
      },
      setMaxAmount() {
        if (!store.maxAmount) return;
        store.form.amount = store.maxAmount.toExact();
      },
      setSrcChainId(chainId: ChainId): void {
        throw new Error('Not implemented');
      },
      setDstChainId(chainId: ChainId): void {
        store.form.dstChainId = chainId;
        const {srcCurrency, dstCurrency} = store.form;
        if (srcCurrency) {
          const dstCurrency = findMatchingCurrencyOnChain(srcCurrency, chainId);
          store.form.dstCurrency = dstCurrency;
        } else if (dstCurrency) {
          store.form.dstCurrency = findCurrencyOnChain(dstCurrency, chainId);
        }
      },
      setSrcCurrency(currency: Currency) {
        if (!isSrcCurrencyValid(currency)) {
          store.form.dstChainId = undefined;
          store.form.dstCurrency = undefined;
        }
        store.form.srcCurrency = currency;
        store.form.srcChainId = currency.chainId;
        if (!store.form.dstCurrency) {
          const dstCurrency = findMatchingCurrency(currency);
          store.form.dstCurrency = dstCurrency;
          store.form.dstChainId = dstCurrency?.chainId;
        }
      },
      setDstCurrency(currency: Currency) {
        store.form.dstCurrency = currency;
        store.form.dstChainId = currency.chainId;
      },
      switch() {
        const {form} = store;
        [form.srcChainId, form.dstChainId, form.srcCurrency, form.dstCurrency] = [
          form.dstChainId,
          form.srcChainId,
          form.dstCurrency,
          form.srcCurrency,
        ];
      },
      register,
      approve,
      transfer: flow(function* () {
        const {strategy} = store;
        try {
          assert(strategy, 'strategy');
          store.isExecuting = true;
          if (!store.isRegistered) {
            const {dstCurrency} = store.form;
            const {dstNativeBalance} = store;
            assert(dstCurrency);
            assert(dstNativeBalance);
            const registerStrategy = store.strategies.find((strategy) =>
              strategy.supports(dstCurrency),
            );
            assert(registerStrategy);

            const estimatedGasAmount: Awaited<
              ReturnType<BridgeStrategy['estimateNative']['register']>
            > = yield registerStrategy.estimateNative.register(dstCurrency);

            if (dstNativeBalance.greaterThan(estimatedGasAmount)) {
              yield register();
            }
          }
          if (!store.isApproved) {
            yield approve();
          }
          const {
            messageFee: fee,
            amount,
            srcAddress,
            dstAddress,
            srcWallet,
            dstWallet,
            adapterParams,
            outputAmount,
          } = store;
          const {srcChainId, dstChainId, dstCurrency, srcCurrency} = store.form;

          assert(srcChainId, 'srcChainId');
          assert(dstChainId, 'dstChainId');
          assert(srcCurrency, 'srcCurrency');
          assert(dstCurrency, 'dstCurrency');
          assert(srcAddress, 'srcAddress');
          assert(dstAddress, 'dstAddress');
          assert(fee, 'fee');
          assert(amount, 'amount');
          assert(adapterParams, 'adapterParams');
          assert(outputAmount, 'outputAmount');

          const minAmount = outputAmount;

          const input: TransferInput = {
            srcChainId,
            dstChainId,
            srcCurrency,
            dstCurrency,
            srcAddress,
            dstAddress,
            amount,
            minAmount,
            fee,
            adapterParams,
          };

          yield switchChain(srcChainId);
          store.isSigning = true;
          const result: TransactionResult = yield strategy.transfer(input);
          store.isSigning = false;
          store.isMining = true;
          const receipt: Awaited<ReturnType<TransactionResult['wait']>> = yield result.wait();
          store.isMining = false;

          reportTransfer(input, srcWallet?.type, dstWallet?.type);

          // todo: don't depend on uiStore
          if (!store.isRegistered) {
            uiStore.claimReminderAlert.open();
          }

          const tx = transactionStore.create({
            chainId: srcChainId,
            txHash: receipt.txHash,
            type: 'TRANSFER',
            input,
            expectedDate: getExpectedTransferDate(input),
          });
          actions.updateBalances();
          toast.success(
            <Toast>
              <h1>Transaction Submitted</h1>
              <p>
                <a href={getScanLink(srcChainId, receipt.txHash)} target='_blank' rel='noreferrer'>
                  View on block explorer
                </a>
              </p>
            </Toast>,
          );
          waitForMessageReceived(srcChainId, receipt.txHash)
            .then((message) => {
              // never mark tx as failed
              // we will eventually deliver the tx
              tx.update({
                completed: true,
                confirmation: {
                  chainId: message.dstChainId,
                  txHash: message.dstTxHash,
                },
              });
              if (isAptosChainId(dstChainId)) {
                unclaimedStore.updateBalance(dstCurrency, dstAddress);
              }
            })
            .finally(() => {
              actions.updateBalances();
            });
        } catch (e) {
          displayError(e, () => {
            const {message, title} = parseWalletError(e);
            toast.error(
              <Toast>
                <h1>{title}</h1>
                <p>{message}</p>
              </Toast>,
            );
          });
          throw e;
        } finally {
          store.isSigning = false;
          store.isMining = false;
          store.isExecuting = false;
        }
      }),
      async updateBalances() {
        const {evm, aptos} = walletStore;
        const allTokens = getAllTokens();
        const promises = allTokens.map((token) => {
          if (evm && isEvmChainId(token.chainId)) {
            balanceStore.updateBalance(token, evm.account);
          } else if (aptos && isAptosChainId(token.chainId)) {
            balanceStore.updateBalance(token, aptos.account);
          }
        });
        return Promise.allSettled(promises);
      },
      setStrategies(strategies: BridgeStrategy[]) {
        store.strategies.replace(strategies);
      },
      setCurrencies(currencies: Currency[]) {
        // todo: not sure if this is good idea
        // maybe we should just store this in config ?
        const env = getEnv<BridgeStoreEnv>(store);
        unprotect(env.currencies);
        env.currencies.replace(currencies);
      },
    };
    return actions;
  })
  .actions((store) => {
    const providers = store.strategies;
    let globalNonce = 0;
    const updateLimit = flow(function* () {
      const localNonce = ++globalNonce;
      store.limitAmount = undefined;
      const {srcCurrency, dstCurrency} = store.form;
      if (!srcCurrency) return;
      if (!dstCurrency) return;
      const strategy = providers.find((i) => i.isApplicable());
      if (!strategy) return;
      const limitAmount: Awaited<ReturnType<BridgeStrategy['getLimit']>> = yield strategy.getLimit(
        srcCurrency,
        dstCurrency,
      );
      if (localNonce !== globalNonce) return;
      store.limitAmount = limitAmount;
    });
    return {
      updateLimit,
    };
  })
  .actions((store) => {
    let globalNonce = 0;
    const updateExtraGas = flow(function* () {
      const localNonce = ++globalNonce;
      store.extraGas = undefined;
      const {srcChainId, dstChainId} = store.form;
      const {strategy} = store;
      if (!srcChainId) return;
      if (!dstChainId) return;
      if (!strategy) return;
      const extraGas: Awaited<ReturnType<BridgeStrategy['getExtraGas']>> =
        yield strategy.getExtraGas(srcChainId, dstChainId);
      if (extraGas === 0) {
        console.warn('Extra gas returned 0 - should never be 0 !');
      }
      if (localNonce !== globalNonce) return;
      store.extraGas = extraGas;
    });
    return {updateExtraGas};
  })
  .actions((store) => {
    let globalNonce = 0;
    const updateMessageFee = flow(function* () {
      const localNonce = ++globalNonce;
      store.messageFee = undefined;
      const {srcChainId, dstChainId} = store.form;
      const {strategy, adapterParams} = store;
      if (!srcChainId) return;
      if (!dstChainId) return;
      if (!strategy) return;
      if (!adapterParams) return;
      const messageFee: FeeQuote = yield strategy.getMessageFee(adapterParams);
      if (localNonce !== globalNonce) return;
      store.messageFee = messageFee;
    });
    return {updateMessageFee};
  })
  .actions((store) => {
    let globalNonce = 0;
    const updateOutput = flow(function* () {
      const localNonce = ++globalNonce;
      store.output = undefined;
      const {dstCurrency} = store.form;
      const {amount, strategy} = store;
      if (!amount) return;
      if (!dstCurrency) return;
      if (!strategy) return;
      const output: Awaited<ReturnType<BridgeStrategy['getOutput']>> = yield strategy.getOutput(
        amount,
        dstCurrency,
      );
      if (localNonce !== globalNonce) return;
      store.output = output;
    });
    return {updateOutput};
  });

const env = {currencies: types.array(types.frozen<Currency>()).create()};
type BridgeStoreEnv = typeof env;

export const bridgeStore = BridgeStoreModel.create({form: {dstChainId: APTOS_CHAIN_ID}}, env);

function isAptosCoin(currency: Currency): boolean {
  return currency.symbol === 'APT' && isAptosChainId(currency.chainId);
}

function isSrcCurrencyDisabled(currency: Currency) {
  const balance = getWalletBalance(currency);
  const isZero = !balance || balance?.equalTo(0);
  return isZero;
}
function isDstCurrencyDisabled(currency: Currency) {
  if (isAptosCoin(currency)) return true;
  return false;
}
function isSrcChainDisabled(chainId: ChainId) {
  return false;
}
function isDstChainDisabled(chainId: ChainId) {
  return false;
}

function isValidPair(srcCurrency: Currency, dstCurrency: Currency): boolean {
  // naive:
  // WETH -> ETH
  // ETH -> WETH
  // ETH -> ETH
  // both can't be aptos
  if (isAptosChainId(srcCurrency.chainId) && isAptosChainId(dstCurrency.chainId)) return false;
  // one has to be aptos
  if (!isAptosChainId(srcCurrency.chainId) && !isAptosChainId(dstCurrency.chainId)) return false;
  if (
    srcCurrency.symbol.endsWith(dstCurrency.symbol) ||
    dstCurrency.symbol.endsWith(srcCurrency.symbol)
  ) {
    return true;
  }
  return false;
}

function findMatchingCurrency(currency: Currency) {
  const {currencies} = bridgeStore;
  return currencies.find((other) => isValidPair(currency, other));
}

function findCurrencyOnChain(aCurrency: Currency, chainId: ChainId) {
  const {currencies} = bridgeStore;
  return currencies.find((bCurrency) => {
    if (bCurrency.chainId !== chainId) return false;
    if (aCurrency.symbol.endsWith(bCurrency.symbol)) return true;
    if (bCurrency.symbol.endsWith(aCurrency.symbol)) return true;
    return false;
  });
}

function findMatchingCurrencyOnChain(currency: Currency, chainId: ChainId) {
  const {currencies} = bridgeStore;
  return currencies.find((other) => {
    return other.chainId === chainId && isValidPair(currency, other);
  });
}

function isSrcCurrencyValid(srcCurrency: Currency) {
  const {dstChainId, dstCurrency} = bridgeStore.form;
  if (!dstChainId) return true;
  // both can't be aptos
  if (isAptosChainId(dstChainId) && isAptosChainId(srcCurrency.chainId)) return false;
  // one has to be aptos
  if (!isAptosChainId(dstChainId) && !isAptosChainId(srcCurrency.chainId)) return false;
  if (dstCurrency) {
    return isValidPair(srcCurrency, dstCurrency);
  }
  return true;
}

function isDstCurrencyValid(dstCurrency: Currency) {
  const {srcChainId, srcCurrency} = bridgeStore.form;
  if (!srcChainId) return true;
  // both can't be aptos
  if (isAptosChainId(srcChainId) && isAptosChainId(dstCurrency.chainId)) return false;
  // one has to be aptos
  if (!isAptosChainId(srcChainId) && !isAptosChainId(dstCurrency.chainId)) return false;
  if (srcCurrency) {
    return isValidPair(srcCurrency, dstCurrency);
  }
  return true;
}

type CurrencyOption = {
  currency: Currency;
  disabled?: boolean;
  valid?: boolean;
  overlay?: React.ReactNode;
};

type ChainOption = {
  chainId: ChainId;
  disabled?: boolean;
  overlay?: React.ReactNode;
};

// returns all tokens native
function getAllTokens(): Currency[] {
  const nativeTokens = bridgeStore.chains.map(getNativeCurrency);
  const bridgeTokens = bridgeStore.currencies;
  const allTokens = uniq([...nativeTokens, ...bridgeTokens]);
  return allTokens;
}

export function initBridgeStore() {
  const updateUnclaimedBalance = () => {
    const {aptos} = walletStore;
    if (!aptos) return;
    bridgeStore.currencies
      .filter((token) => isAptosChainId(token.chainId))
      .filter((token) => !isNativeCurrency(token))
      .forEach((token) => {
        unclaimedStore.updateBalance(token, aptos.account);
      });
  };

  const updateEvmBalance = () => {
    const {evm} = walletStore;
    if (!evm) return;
    getAllTokens()
      .filter((token) => isEvmChainId(token.chainId))
      .forEach((token) => {
        balanceStore.updateBalance(token, evm.account);
      });
  };

  const updateAptosBalance = () => {
    const {aptos} = walletStore;
    if (!aptos) return;
    const {account} = aptos;

    getAllTokens()
      .filter((token) => isAptosChainId(token.chainId))
      .forEach((token) => {
        balanceStore.updateBalance(token, account);
      });
  };

  const updateMessageFee = () => {
    const {srcChainId, dstChainId} = bridgeStore.form;
    const {adapterParams} = bridgeStore;
    if (!srcChainId) return;
    if (!dstChainId) return;
    if (!adapterParams) return;
    bridgeStore.updateMessageFee();
  };

  const updateExtraGas = () => {
    const {srcChainId, dstChainId} = bridgeStore.form;
    const {strategy} = bridgeStore;
    if (!srcChainId) return;
    if (!dstChainId) return;
    if (!strategy) return;
    bridgeStore.updateExtraGas();
  };

  const updateOutput = () => {
    const {dstChainId} = bridgeStore.form;
    const {amount} = bridgeStore;
    if (!amount) return;
    if (!dstChainId) return;
    bridgeStore.updateOutput();
  };

  const updateDstPrice = () => {
    const {srcChainId, dstChainId} = bridgeStore.form;
    if (!srcChainId) return;
    if (!dstChainId) return;
    relayerStore.updateDstConfig(srcChainId, dstChainId);
    relayerStore.updateDstPrice(srcChainId, dstChainId);
  };

  const updateTransferLimit = () => {
    const {srcCurrency, dstChainId} = bridgeStore.form;
    if (!srcCurrency) return;
    if (!dstChainId) return;
    bridgeStore.updateLimit();
  };

  const updateDefaultAirdropAmount = () => {
    const {dstChainId} = bridgeStore.form;
    if (!dstChainId) return;
    airdropStore.updateDefaultAmount(dstChainId);
  };

  const updateAllowance = () => {
    const {evm} = walletStore;
    const {srcCurrency} = bridgeStore.form;
    const {strategy} = bridgeStore;
    if (!srcCurrency) return;
    if (!evm) return;
    if (!isEvmChainId(srcCurrency.chainId)) return;
    if (!isToken(srcCurrency)) return;
    if (!strategy) return;
    const spender = strategy.spender?.();
    if (!spender) return;
    const owner = evm.account;
    // todo: check why updated twice
    // console.log({spender});
    approveStore.updateAllowance(srcCurrency, owner, spender);
  };

  const updateAptosResources = () => {
    const {aptos} = walletStore;
    if (!aptos) return;
    const tokens = bridgeStore.currencies.filter((c) => isAptosChainId(c.chainId));
    tokens.forEach((token) => resourceStore.update(token, aptos.account));
  };

  const updateEvmResources = () => {
    const {evm} = walletStore;
    if (!evm) return;
    const tokens = bridgeStore.currencies.filter((c) => isEvmChainId(c.chainId));
    tokens.forEach((token) => resourceStore.update(token, evm.account));
  };

  const handlers = [
    // each in separate `thread`
    autorun(() => updateEvmBalance()),
    autorun(() => updateEvmResources()),
    autorun(() => updateAptosBalance()),
    autorun(() => updateAptosResources()),
    autorun(() => updateUnclaimedBalance()),
    autorun(() => updateMessageFee()),
    autorun(() => updateExtraGas()),
    autorun(() => updateOutput()),
    autorun(() => updateDstPrice()),
    autorun(() => updateTransferLimit()),
    autorun(() => updateDefaultAirdropAmount()),
    autorun(() => updateAllowance()),
    // refresh
    interval(() => updateEvmBalance(), 30_000),
    interval(() => updateAptosBalance(), 30_000),
  ];

  // unregister
  return () => {
    handlers.forEach((handler) => handler());
  };
}

function interval(cb: () => void, timeMs: number) {
  const id = setInterval(cb, timeMs);
  return () => clearInterval(id);
}
