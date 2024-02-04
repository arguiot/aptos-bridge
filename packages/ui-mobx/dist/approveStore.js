import { flow, types } from 'mobx-state-tree';
import assert from 'assert';
import { walletStore } from './walletStore';
import { switchChain } from './utils';
export const ApproveStoreModel = types
    .model({
    isSigning: false,
    isMining: false,
    isApproving: false,
    allowances: types.map(types.frozen()),
    api: types.frozen(),
})
    .actions((store) => {
    const updateAllowance = flow(function* (token, owner, spender) {
        const key = allowanceKey(token, owner, spender);
        const erc20 = store.api.forToken(token);
        const amount = yield erc20.allowance(owner, spender);
        store.allowances.set(key, amount);
        return amount;
    });
    const actions = {
        approve: flow(function* (amount, owner, spender) {
            try {
                yield switchChain(amount.currency.chainId);
                const { evm } = walletStore;
                assert(evm === null || evm === void 0 ? void 0 : evm.signer, 'signer');
                const erc20 = store.api.forToken(amount.currency);
                store.isSigning = true;
                const tx = yield erc20.approve(amount, spender);
                const result = yield tx.signAndSubmitTransaction(evm.signer);
                store.isSigning = false;
                store.isMining = true;
                yield result.wait();
                store.isMining = false;
                yield updateAllowance(amount.currency, owner, spender);
            }
            finally {
                store.isApproving = false;
                store.isMining = false;
                store.isSigning = false;
            }
        }),
        setApi(api) {
            store.api = api;
        },
        updateAllowance,
    };
    return actions;
})
    .views((store) => {
    const views = {
        pickAllowance(token, owner, spender) {
            const key = allowanceKey(token, owner, spender);
            return store.allowances.get(key);
        },
        isApproved(amount, owner, spender) {
            const allowance = views.pickAllowance(amount.currency, owner, spender);
            if (!allowance)
                return undefined;
            return !allowance.lessThan(amount);
        },
    };
    return views;
});
const currencyKey = (c) => [c.chainId, c.symbol].join(':');
const allowanceKey = (c, owner, spender) => currencyKey(c) + ':' + spender + ':' + owner;
export const approveStore = ApproveStoreModel.create();
