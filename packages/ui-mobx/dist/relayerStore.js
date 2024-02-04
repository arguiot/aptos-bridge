import { types, flow } from 'mobx-state-tree';
import { compact } from 'lodash';
export const RelayerStoreModel = types
    .model({
    dstPriceItems: types.map(types.frozen()),
    dstConfigItems: types.map(types.frozen()),
    providers: types.array(types.frozen()),
})
    .views((store) => {
    const views = {
        pickDstPrice: (srcChainId, dstChainId) => {
            return store.dstPriceItems.get(toKey(srcChainId, dstChainId));
        },
        pickDstConfig: (srcChainId, dstChainId) => {
            return store.dstConfigItems.get(toKey(srcChainId, dstChainId));
        },
        pickMaxDstNativeAmount: (srcChainId, dstChainId) => {
            var _a;
            return (_a = views.pickDstConfig(srcChainId, dstChainId)) === null || _a === void 0 ? void 0 : _a.dstNativeAmtCap;
        },
        pickProvider: (srcChainId) => {
            return store.providers.find((p) => p.isApplicable(srcChainId));
        },
    };
    return views;
})
    .actions((store) => {
    const actions = {
        setProviders(providers) {
            store.providers.replace(providers);
        },
        updateDstPrice: flow(function* (srcChainId, dstChainId) {
            const provider = store.pickProvider(srcChainId);
            if (!provider)
                throw new Error(`No provider found for chainId: ${srcChainId}`);
            const price = yield provider.dstPriceLookup(srcChainId, dstChainId);
            store.dstPriceItems.set(toKey(srcChainId, dstChainId), price);
        }),
        updateDstConfig: flow(function* (srcChainId, dstChainId) {
            const provider = store.pickProvider(srcChainId);
            if (!provider)
                return undefined;
            const config = yield provider.dstConfigLookup(srcChainId, dstChainId);
            store.dstConfigItems.set(toKey(srcChainId, dstChainId), config);
        }),
        updateAll: (chainIds) => {
            const paths = compact(chainIds.flatMap((srcChainId) => chainIds.map((dstChainId) => {
                if (srcChainId === dstChainId)
                    return undefined;
                return { srcChainId, dstChainId };
            })));
            return Promise.allSettled(paths.map((path) => {
                actions.updateDstPrice(path.srcChainId, path.dstChainId);
                actions.updateDstConfig(path.srcChainId, path.dstChainId);
            }));
        },
    };
    return actions;
});
function toKey(srcChainId, dstChainId) {
    return srcChainId + ':' + dstChainId;
}
export const relayerStore = RelayerStoreModel.create();
