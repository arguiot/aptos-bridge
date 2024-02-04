var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { types, flow } from 'mobx-state-tree';
import { AptosWalletModel, getAptosAdapter } from './wallet/aptosWallet';
import { EthWalletModel, getEvmAdapter } from './wallet/evmWallet';
import { compact } from 'lodash';
import { WALLETS_APTOS, WALLETS_EVM, isEvmChainId } from '@layerzerolabs/ui-core';
export const WalletStoreModel = types
    .model({
    evm: types.maybe(EthWalletModel),
    aptos: types.maybe(AptosWalletModel),
    isSwitching: false,
})
    .views((store) => ({
    get eth() {
        return store.evm;
    },
    get activeWallet() {
        return store.evm;
    },
    get wallets() {
        return compact([store.evm, store.aptos]);
    },
}))
    .actions((store) => {
    const actions = {
        disconnect(walletType) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!walletType || WALLETS_EVM.includes(walletType)) {
                    yield getEvmAdapter().disconnect();
                }
                else if (WALLETS_APTOS.includes(walletType)) {
                    yield getAptosAdapter().disconnect(walletType);
                }
            });
        },
        connect(walletType) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                if (!walletType || WALLETS_EVM.includes(walletType)) {
                    yield getEvmAdapter().connect(walletType);
                    if (!((_a = store.evm) === null || _a === void 0 ? void 0 : _a.account))
                        throw new Error(`connect did not sync account`);
                    if (!((_b = store.evm) === null || _b === void 0 ? void 0 : _b.signer))
                        throw new Error(`connect did not sync signer`);
                    if (!((_c = store.evm) === null || _c === void 0 ? void 0 : _c.evmChainId))
                        throw new Error(`connect did not sync evmChainId`);
                }
                else if (WALLETS_APTOS.includes(walletType)) {
                    yield getAptosAdapter().connect(walletType);
                }
            });
        },
        switchChain: flow(function* (chainId) {
            var _a, _b;
            if (!isEvmChainId(chainId))
                return;
            if (((_a = store.eth) === null || _a === void 0 ? void 0 : _a.chainId) === chainId)
                return;
            try {
                store.isSwitching = true;
                yield getEvmAdapter().switchChain(chainId);
                if (((_b = store.eth) === null || _b === void 0 ? void 0 : _b.chainId) !== chainId)
                    throw new Error(`switchChain did not sync chainId`);
            }
            finally {
                store.isSwitching = false;
            }
        }),
        useAptosWallet(context, name) {
            if (context) {
                store.aptos = AptosWalletModel.create(context);
            }
            else {
                store.aptos = undefined;
            }
        },
        useEvmWallet(context, name) {
            if (context) {
                store.evm = EthWalletModel.create(context);
            }
            else {
                store.evm = undefined;
            }
        },
    };
    return actions;
});
export const walletStore = WalletStoreModel.create({
// eth: {
//   account: '0x6d9F1a927CBcb5e2c28D13CA735bc6d6131406da',
//   evmChainId: toEvmChainId(ChainId.BSC_TESTNET),
// },
});
