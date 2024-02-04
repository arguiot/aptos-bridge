import { reportEvent } from './reportEvent';
export function reportOftTransfer(input, srcWalletType, dstWalletType) {
    var _a, _b;
    reportEvent('transfer', {
        srcWalletType,
        dstWalletType,
        srcChainId: input.srcChainId,
        dstChainId: input.dstChainId,
        'srcCurrency.symbol': input.srcCurrency.symbol,
        'dstCurrency.symbol': input.dstCurrency.symbol,
        amount: input.amount.toFixed(2),
        nativeFee: input.fee.nativeFee.toExact(),
        'adapterParams.dstNativeAmount': (_b = (_a = input.adapterParams.dstNativeAmount) === null || _a === void 0 ? void 0 : _a.toExact()) !== null && _b !== void 0 ? _b : '0',
    });
}
