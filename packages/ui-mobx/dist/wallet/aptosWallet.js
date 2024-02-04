import { types } from 'mobx-state-tree';
import { fromAptosChainId, isAptosChainId } from '@layerzerolabs/ui-core';
let aptosAdapter;
export function setAptosAdapter(adapter) {
    aptosAdapter = adapter;
}
export function getAptosAdapter() {
    return aptosAdapter;
}
// todo: create instance of wallet for every wallet
export const AptosWalletModel = types
    .model({
    type: types.frozen(),
    account: types.string,
    aptosChainId: types.maybe(types.number),
    publicKey: types.maybe(types.string),
    signer: types.frozen(),
})
    .actions((wallet) => ({
    disconnect() {
        return getAptosAdapter().disconnect();
    },
    switchChain(chainId) {
        throw new Error(`switchChain not implemented`);
    },
}))
    .views((wallet) => ({
    supports(chainId) {
        return isAptosChainId(chainId);
    },
    get chainId() {
        return wallet.aptosChainId ? fromAptosChainId(wallet.aptosChainId) : undefined;
    },
}));
