import {TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {
  getBlockTime,
  getExpectedDate,
  getRequiredBlockConfirmations,
  isAptosChainId,
  timeStamp,
} from '@layerzerolabs/ui-core';

// todo: move this to BridgeApi
export function getExpectedTransferDate(input: TransferInput) {
  const isCake = input.srcCurrency.symbol.toUpperCase() === 'CAKE';
  if (!isCake) return getExpectedDate(input.srcChainId, input.dstChainId);
  const {srcChainId, dstChainId} = input;
  const confirmations = isAptosChainId(srcChainId) ? 20 : getRequiredBlockConfirmations(srcChainId);
  const nowTimestamp = timeStamp();
  const srcDelay = getBlockTime(srcChainId) * (1 + confirmations);
  const dstDelay = 2 * getBlockTime(dstChainId);
  const lambdaDelay = 15.0;
  const extraDelay = 10.0;
  return nowTimestamp + srcDelay + dstDelay + lambdaDelay + extraDelay;
}
