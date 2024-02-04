import assert from 'assert';
import { getWalletExtensionUrl } from '@layerzerolabs/ui-core';
function parseWalletErrorTitle(e) {
    const title = (e === null || e === void 0 ? void 0 : e.code) === 4001 ? 'Transaction rejected' : 'Transaction failed';
    return title;
}
function parseWalletErrorMessage(e) {
    const any = e;
    const code = any === null || any === void 0 ? void 0 : any.code;
    if (code && typeof code === 'string') {
        if (code === 'INSUFFICIENT_FUNDS') {
            return ErrorMessage.INSUFFICIENT_FUNDS;
        }
    }
    const reason = any === null || any === void 0 ? void 0 : any.reason;
    if (reason && typeof reason === 'string') {
        return reason;
    }
    const message = any === null || any === void 0 ? void 0 : any.message;
    if (message && typeof message === 'string') {
        if (typeof message === 'string') {
            // aptos
            if (message.includes('INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE')) {
                return ErrorMessage.INSUFFICIENT_FUNDS;
            }
            // aptos
            if (message.includes('RejectedByUser')) {
                return ErrorMessage.REJECTED_BY_USER;
            }
        }
        return message;
    }
    // last resort
    const error = String(e !== null && e !== void 0 ? e : 'Unknown error');
    return error;
}
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["INSUFFICIENT_FUNDS"] = "Insufficient funds for gas. Make sure you have enough gas.";
    ErrorMessage["REJECTED_BY_USER"] = "Transaction was rejected.";
})(ErrorMessage || (ErrorMessage = {}));
export function parseWalletError(e) {
    const title = parseWalletErrorTitle(e);
    const message = parseWalletErrorMessage(e);
    return { title, message };
}
export function getWalletExtension(walletType) {
    if (typeof window === 'undefined')
        return;
    const url = getWalletExtensionUrl(walletType);
    assert(url, 'url');
    window.open(url, '_blank', 'noopener,noreferrer');
}
