import assert from 'assert';
import { flow, types } from 'mobx-state-tree';
const AirdropStoreModel = types
    .model({
    // Map<chainId, CurrencyAmount>
    defaultAmount: types.map(types.frozen()),
    providers: types.array(types.frozen()),
})
    .views((store) => ({
    getDefault(dstChainId) {
        return store.defaultAmount.get(String(dstChainId));
    },
}))
    .actions((store) => ({
    setProviders(providers) {
        store.providers.replace(providers);
    },
}))
    .actions((store) => {
    let globalNonce = 0;
    const updateDefaultAmount = flow(function* (dstChainId) {
        const localNonce = ++globalNonce;
        const provider = store.providers.find((p) => p.supports(dstChainId));
        assert(provider);
        const amount = yield provider.estimateDefaultAirdrop(dstChainId);
        if (globalNonce !== localNonce)
            return;
        store.defaultAmount.set(String(dstChainId), amount);
    });
    return { updateDefaultAmount: updateDefaultAmount };
});
export const airdropStore = AirdropStoreModel.create({});
