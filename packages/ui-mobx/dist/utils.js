var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CurrencyAmount } from '@layerzerolabs/ui-core';
import { ProviderRpcErrorCode } from '@layerzerolabs/ui-ethers';
import { approveStore } from './approveStore';
import { balanceStore } from './balanceStore';
import { walletStore } from './walletStore';
export function getActiveAccount() {
    var _a;
    return (_a = walletStore.evm) === null || _a === void 0 ? void 0 : _a.account;
}
export function getSigner() {
    var _a;
    const signer = (_a = walletStore.evm) === null || _a === void 0 ? void 0 : _a.signer;
    if (!signer)
        throw new Error(`No signer`);
    return signer;
}
export function getBalance(currency, account) {
    if (!account || !currency)
        return undefined;
    return balanceStore.pickBalance(currency, account);
}
export function getWalletBalance(currency) {
    if (!currency)
        return undefined;
    const wallets = walletStore.wallets;
    for (const wallet of wallets) {
        if (wallet.supports(currency.chainId)) {
            return getBalance(currency, wallet.account);
        }
    }
    return undefined;
}
export function approve(amount, spender, owner = getActiveAccount()) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!owner)
            throw new Error(`No active wallet`);
        yield walletStore.switchChain(amount.currency.chainId);
        return approveStore.approve(amount, owner, spender);
    });
}
export function approveMax(currency, spender, owner = getActiveAccount()) {
    const amount = CurrencyAmount.fromRawAmount(currency, MAX_APPROVE);
    return approve(amount, spender, owner);
}
export function isApproved(amount, spender, owner = getActiveAccount()) {
    if (!owner || !spender)
        return undefined;
    return approveStore.isApproved(amount, owner, spender);
}
export function switchChain(chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        return walletStore.switchChain(chainId);
    });
}
export function isAddEthereumChainError(e) {
    var _a, _b;
    // wallet connect error "Try adding the chain using wallet_addEthereumChain first"
    if (typeof e === 'string' && e.includes('wallet_addEthereumChain'))
        return true;
    // metamask error
    if (typeof e === 'object') {
        const switchError = e;
        if (switchError.code === ProviderRpcErrorCode.CHAIN_NOT_ADDED)
            return true;
        // Check for original error because of mobile issue https://github.com/MetaMask/metamask-mobile/issues/3312
        if (((_b = (_a = switchError === null || switchError === void 0 ? void 0 : switchError.data) === null || _a === void 0 ? void 0 : _a.originalError) === null || _b === void 0 ? void 0 : _b.code) === ProviderRpcErrorCode.CHAIN_NOT_ADDED)
            return true;
    }
    return false;
}
const MAX_APPROVE = '0x' + 'f'.repeat(64);
