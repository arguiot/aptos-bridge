import {fromEvmChainId} from '@layerzerolabs/ui-core';
import {Signer} from 'ethers';

// TODO: use assertWallet from @layerzerolabs/ui-evm
export async function assertWallet(
  signer: Signer,
  expected: {address: string; chainId: number},
): Promise<void> {
  const [evmChainId, address] = await Promise.all([signer.getChainId(), signer.getAddress()]);

  if (!isLzChainId({evmChainId, lzChainId: expected.chainId})) {
    throw new Error(
      `Invalid wallet chain id. Expected ${expected.chainId} got ${fromEvmChainId(evmChainId)}`,
    );
  }

  if (!isSameAddress(expected.address, address)) {
    throw new Error(`Invalid wallet evm chain id. Expected ${expected.address} got ${address}`);
  }
}

function isLzChainId({evmChainId, lzChainId}: {evmChainId: number; lzChainId: number}) {
  return fromEvmChainId(evmChainId) === lzChainId;
}

function isSameAddress(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
