import {TransferInput} from '@layerzerolabs/ui-aptos-bridge';
import {WalletType} from '@layerzerolabs/ui-core';
import {reportEvent} from '@layerzerolabs/ui-mobx';

export function reportTransfer(
  input: TransferInput,
  srcWalletType?: WalletType,
  dstWalletType?: WalletType,
) {
  reportEvent('transfer', {
    srcWalletType,
    dstWalletType,
    srcChainId: input.srcChainId,
    dstChainId: input.dstChainId,
    'srcCurrency.symbol': input.srcCurrency.symbol,
    'dstCurrency.symbol': input.dstCurrency.symbol,
    amount: input.amount.toFixed(2),
    nativeFee: input.fee.nativeFee.toExact(),
    'adapterParams.dstNativeAmount': input.adapterParams.dstNativeAmount?.toExact() ?? '0',
  });
}
