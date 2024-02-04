import {Transaction, transactionStore} from '@layerzerolabs/ui-mobx';
import {applySnapshot, getSnapshot, onSnapshot, types} from 'mobx-state-tree';

const ToggleModel = types
  .model({
    value: types.optional(types.boolean, false),
  })
  .actions((store) => ({
    open() {
      store.value = true;
    },
    close() {
      store.value = false;
    },
    toggle() {
      store.value = !store.value;
    },
  }));

// todo: don't put labels in enums
export enum WalletTab {
  WALLET = 'Wallet',
  TRANSACTIONS = 'Transactions',
  UNCLAIMED = 'Unclaimed',
}

const WalletModal = ToggleModel.props({
  activeTab: types.optional(types.frozen<WalletTab>(), WalletTab.TRANSACTIONS),
}).actions((store) => ({
  setActiveTab(tab: WalletTab) {
    store.activeTab = tab;
  },
}));

const TransactionProgressModel = ToggleModel.props({
  dismissed: types.array(types.string), // txHash[]
})
  .views((store) => ({
    get transactions(): Transaction[] {
      return transactionStore.recentTransactions.filter(
        (tx) => !store.dismissed.includes(tx.txHash!),
      );
    },
    get hasPendingTransactions(): boolean {
      return this.transactions.some((transaction) => !transaction.completed && !transaction.error);
    },
  }))
  .actions((store) => ({
    dismiss(txHash: string) {
      store.dismissed.push(txHash);
    },
  }));

export const UiStoreModel = types.model({
  walletModal: types.optional(WalletModal, {}),
  txProgress: types.optional(TransactionProgressModel, {}),
  dstNativeAmountModal: types.optional(ToggleModel, {}),
  claimReminderAlert: types.optional(ToggleModel, {}),
  rpcErrorAlert: types.optional(ToggleModel, {}),
});

export const uiStore = UiStoreModel.create();

const PROGRESS_KEY = 'ui.txProgress';

export function recordUiStore() {
  if (typeof window === 'undefined') return;

  restoreSnapshot();
  // only
  onSnapshot(uiStore.txProgress, () => {
    saveSnapshot();
  });

  function restoreSnapshot() {
    try {
      const json = localStorage.getItem(PROGRESS_KEY);
      if (!json) return;
      const snapshot = JSON.parse(json);
      applySnapshot(uiStore.txProgress, snapshot);
    } catch {
      //
    }
  }
  function saveSnapshot() {
    try {
      const snapshot = getSnapshot(uiStore.txProgress);
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot));
    } catch {
      //
    }
  }
}
