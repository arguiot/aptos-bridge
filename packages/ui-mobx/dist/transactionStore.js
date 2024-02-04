import { types } from 'mobx-state-tree';
import { timeStamp } from './types';
export const TransactionModel = types
    .model({
    type: types.frozen(),
    input: types.maybeNull(types.frozen()),
    chainId: types.frozen(),
    expectedDate: types.maybe(types.number),
    submittedDate: types.optional(types.number, () => timeStamp()),
    error: types.maybeNull(types.frozen()),
    txHash: types.maybe(types.string),
    // confirmation destination chain - for transfer
    confirmation: types.maybe(types.model({
        txHash: types.maybe(types.string),
        chainId: types.frozen(),
    })),
    completed: types.optional(types.boolean, false),
})
    .actions(function (transaction) {
    const actions = {
        update(changes) {
            //@ts-ignore
            Object.assign(transaction, changes);
        },
    };
    return actions;
});
export const TransactionStoreModel = types
    .model({
    transactions: types.optional(types.array(TransactionModel), () => []),
})
    .views((store) => {
    const views = {
        // todo: rename hasPending
        get isPending() {
            return this.pendingTransactions.length > 0;
        },
        get hasPending() {
            return views.isPending;
        },
        get recentTransactions() {
            return store.transactions.slice().reverse();
        },
        get pendingTransactions() {
            return views.recentTransactions.filter((transaction) => !transaction.completed && !transaction.error);
        },
    };
    return views;
})
    .actions((state) => {
    const create = (snapshot) => {
        const model = TransactionModel.create(snapshot);
        actions.addTransaction(model);
        return model;
    };
    const actions = {
        addTransaction(transaction) {
            state.transactions.push(transaction);
        },
        clear() {
            state.transactions.clear();
        },
        create,
    };
    return actions;
});
export const transactionStore = TransactionStoreModel.create();
