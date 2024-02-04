import { isAptosChainId, isEvmChainId, } from '@layerzerolabs/ui-core';
import assert from 'assert';
import { flow, types } from 'mobx-state-tree';
import { walletStore } from './walletStore';
const ResourceStoreModel = types
    .model({
    isSigning: false,
    isMining: false,
    isRegistering: false,
    // Map<`address:type`, boolean>
    resources: types.map(types.boolean),
    providers: types.array(types.frozen()),
})
    .views((store) => {
    function isRegistered(resource, address) {
        if (address === undefined) {
            const { wallets } = walletStore;
            return wallets.some((wallet) => isRegistered(resource, wallet.account));
        }
        const provider = views.getProvider(resource);
        if (!provider)
            return undefined;
        const type = provider.getType(resource);
        const key = toKey({ address, type });
        return store.resources.get(key);
    }
    const views = {
        isRegistered,
        getProvider(resource) {
            return store.providers.find((p) => p.supports(resource));
        },
    };
    return views;
})
    .actions((store) => {
    const register = flow(function* (resource) {
        try {
            // right now only EVM and Aptos support
            const wallet = isAptosChainId(resource.chainId)
                ? walletStore.aptos
                : isEvmChainId(resource.chainId)
                    ? walletStore.evm
                    : undefined;
            assert(wallet === null || wallet === void 0 ? void 0 : wallet.signer);
            const provider = store.getProvider(resource);
            assert(provider);
            store.isRegistering = true;
            const tx = yield provider.register(resource);
            store.isSigning = true;
            const result = yield tx.signAndSubmitTransaction(wallet.signer);
            store.isSigning = false;
            store.isMining = true;
            yield result.wait();
            store.isMining = false;
            yield actions.update(resource, wallet.account);
            return result;
        }
        finally {
            store.isRegistering = false;
            store.isSigning = false;
            store.isMining = false;
        }
    });
    const update = flow(function* (resource, address) {
        const provider = store.getProvider(resource);
        assert(provider);
        const type = provider.getType(resource);
        const key = toKey({ address, type });
        const isRegistered = yield provider.isRegistered(resource, address);
        store.resources.set(key, isRegistered);
    });
    const actions = {
        update,
        register,
        setProviders(providers) {
            store.providers.replace(providers);
        },
    };
    return actions;
});
function toKey({ address, type }) {
    return `${address}:${type}`;
}
export const resourceStore = ResourceStoreModel.create({});
