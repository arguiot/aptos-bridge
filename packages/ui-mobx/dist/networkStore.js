import { types } from 'mobx-state-tree';
import { getNetwork, NETWORKS } from '@layerzerolabs/ui-core';
export const networkStore = types
    .model({
    enabledNetworks: types.array(types.frozen()),
})
    .views((store) => {
    const views = {
        get enabledChains() {
            return store.enabledNetworks.map((i) => i.chainId);
        },
    };
    return views;
})
    .actions((store) => ({
    setEnabledNetworks(enabledNetworks) {
        store.enabledNetworks.replace(enabledNetworks.map((network) => {
            const chainId = typeof network === 'number' ? network : network.chainId;
            return getNetwork(chainId);
        }));
    },
}))
    .create({ enabledNetworks: NETWORKS });
export const enabledNetworks = networkStore.enabledNetworks;
if (typeof window !== 'undefined') {
    Object.assign(window, { enabledNetworks, networkStore });
}
