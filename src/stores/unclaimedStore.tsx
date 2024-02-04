import {Currency, CurrencyAmount, getScanLink} from '@layerzerolabs/ui-core';
import {Toast} from '@layerzerolabs/ui-kit';
import {parseWalletError, walletStore} from '@layerzerolabs/ui-mobx';
import assert from 'assert';
import {flow, Instance, types} from 'mobx-state-tree';
import {toast} from 'react-toastify';

import {BridgeStrategy} from '../sdk/strategy/BridgeStrategy';
import {uiStore, WalletTab} from './uiStore';

const BalanceModel = types
  .model({
    address: types.string,
    amount: types.frozen<CurrencyAmount>(),
  })
  .views((balance) => ({
    get currency(): Currency {
      return balance.amount.currency;
    },
  }));

type Balance = Instance<typeof BalanceModel>;

const UnclaimedStoreModel = types
  .model({
    isExecuting: false,
    isSigning: false,
    isMining: false,
    balances: types.map(BalanceModel),
    claimingAmount: types.maybe(types.frozen<CurrencyAmount>()),
    strategies: types.array(types.frozen<BridgeStrategy>()),
  })
  .views((store) => {
    const views = {
      isUnclaimed(currency: Currency): boolean {
        const {aptos} = walletStore;
        if (!aptos?.account) return false;

        const balance = views.getBalance(currency, aptos.account);
        if (!balance) return false;

        return balance.amount.greaterThan(0);
      },
      getUnclaimedFor(address?: string): Balance[] {
        return this.getBalancesFor(address).filter((balance) => balance.amount.greaterThan(0));
      },
      getBalancesFor(address?: string): Balance[] {
        return Array.from(store.balances.values()).filter((i) => i.address === address);
      },
      getBalance(currency: Currency, address: string): Balance | undefined {
        const key = toKey(currency, address);
        return store.balances.get(key);
      },
      getStrategy(currency: Currency): BridgeStrategy | undefined {
        const strategy = store.strategies.find((p) => p.supports(currency));
        return strategy;
      },
      get unclaimed(): Balance[] {
        const {aptos} = walletStore;
        return this.getUnclaimedFor(aptos?.account);
      },
    };
    return views;
  })
  .actions((store) => ({
    setStrategies(strategies: BridgeStrategy[]) {
      store.strategies.replace(strategies);
    },
  }))
  .actions((store) => {
    const actions: {
      claim(currency: Currency): Promise<unknown>;
      updateBalance(currency: Currency, account: string): Promise<unknown>;
    } = {
      claim: flow(function* (currency: Currency) {
        const provider = store.getStrategy(currency);
        assert(provider);
        try {
          store.isExecuting = true;
          const {aptos} = walletStore;
          assert(aptos);
          const claimingAmount: Awaited<ReturnType<BridgeStrategy['getUnclaimed']>> =
            yield provider.getUnclaimed(currency, aptos.account);
          store.claimingAmount = claimingAmount;
          store.isSigning = true;
          const tx: Awaited<ReturnType<BridgeStrategy['claim']>> = yield provider.claim(currency);
          store.isSigning = false;
          store.isMining = true;
          const receipt = yield tx.wait();
          store.isMining = false;
          store.isExecuting = false;

          yield actions.updateBalance(currency, aptos.account);

          toast.success(
            <Toast>
              <h1>
                Claimed {claimingAmount?.toExact()} {currency.symbol}
              </h1>
              <p>
                <a href={getScanLink(currency.chainId, receipt.txHash)} target='_blank'>
                  View on block explorer
                </a>
              </p>
            </Toast>,
          );
        } catch (e) {
          const {title, message} = parseWalletError(e);

          toast.error(
            <Toast>
              <h1>{title}</h1>
              <p>{message}</p>
            </Toast>,
          );
          throw e;
        } finally {
          store.isExecuting = false;
          store.isSigning = false;
          store.isMining = false;

          // todo: don't depend on uiStore
          closeUnclaimedTokensModal();
        }
      }),
      updateBalance: flow(function* (currency: Currency, address: string) {
        const key = toKey(currency, address);
        const strategy = store.getStrategy(currency);
        assert(strategy);
        const amount: CurrencyAmount = yield strategy.getUnclaimed(currency, address);
        const balance = store.getBalance(currency, address);
        if (balance) {
          balance.amount = amount;
        } else {
          store.balances.set(key, BalanceModel.create({amount, address}));
        }
      }),
    };
    return actions;
  });

function closeUnclaimedTokensModal() {
  if (uiStore.walletModal.activeTab === WalletTab.UNCLAIMED) {
    uiStore.walletModal.setActiveTab(WalletTab.TRANSACTIONS);
    uiStore.walletModal.close();
  }
  uiStore.claimReminderAlert.close();
}

function toKey(currency: Currency, address: string) {
  return `${currency.symbol}:${address}`;
}

export const unclaimedStore = UnclaimedStoreModel.create();
