import { flow, types } from 'mobx-state-tree';
import { getNetwork } from '@layerzerolabs/ui-core';
export const BalanceStoreModel = types
    .model({
    balances: types.map(types.frozen()),
    providers: types.array(types.frozen()),
})
    .views((store) => {
    return {
        pickBalance(currency, account) {
            const key = currencyAccountKey(currency, account);
            return store.balances.get(key);
        },
    };
})
    .actions((store) => {
    return {
        setProviders(providers) {
            store.providers.replace(providers);
        },
        updateBalance: flow(function* (currency, account) {
            const key = currencyAccountKey(currency, account);
            for (const provider of store.providers) {
                if (provider.supports(currency)) {
                    const newBalance = yield provider.getBalance(currency, account);
                    const oldBalance = store.balances.get(key);
                    // don't update balance if same value
                    if (oldBalance === null || oldBalance === void 0 ? void 0 : oldBalance.equalTo(newBalance))
                        return;
                    store.balances.set(key, newBalance);
                    // end
                    return;
                }
            }
            throw new Error(`No provider for ${currency.symbol} on ${getNetwork(currency.chainId).name}`);
        }),
    };
});
const currencyKey = (c) => { var _a; return [c.chainId, c.symbol, (_a = c.address) !== null && _a !== void 0 ? _a : '0xNATIVE'].join(':'); };
const currencyAccountKey = (currency, account) => currencyKey(currency) + ':' + account;
export const balanceStore = BalanceStoreModel.create();
