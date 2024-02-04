import { fromEvmChainId, isEvmChainId } from '@layerzerolabs/ui-core';
import { providers } from 'ethers';
import { types } from 'mobx-state-tree';
let evmAdapter;
export function getEvmAdapter() {
    return evmAdapter;
}
export function setEvmAdapter(adapter) {
    evmAdapter = adapter;
}
export const EthWalletModel = types
    .model({
    type: types.frozen(),
    account: types.string,
    evmChainId: types.number,
    signer: types.frozen(),
})
    .actions((wallet) => ({
    disconnect() {
        return getEvmAdapter().disconnect(wallet.type);
    },
    switchChain(chainId) {
        return getEvmAdapter().switchChain(chainId);
    },
}))
    .views((wallet) => ({
    supports(chainId) {
        return isEvmChainId(chainId);
    },
    get provider() {
        var _a, _b;
        const provider = (_a = wallet.signer) === null || _a === void 0 ? void 0 : _a.provider;
        if (provider instanceof providers.Web3Provider) {
            return provider;
        }
        return new providers.Web3Provider((_b = wallet.signer) === null || _b === void 0 ? void 0 : _b.provider);
    },
    get chainId() {
        try {
            return fromEvmChainId(wallet.evmChainId);
        }
        catch (_a) {
            return undefined;
        }
    },
}));
