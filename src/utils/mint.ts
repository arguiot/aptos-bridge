import {ChainId} from '@layerzerolabs/lz-sdk';
import {
  isEvmAddress,
  isEvmChainId,
  isToken,
  parseCurrencyAmount,
  toBigNumber,
} from '@layerzerolabs/ui-core';
import {switchChain, walletStore} from '@layerzerolabs/ui-mobx';
import assert from 'assert';
import * as ethers from 'ethers';

import {bridgeStore} from '../stores/bridgeStore';

export async function mint(amount: number) {
  const {evm} = walletStore;
  assert(evm);
  const token = bridgeStore.form.srcCurrency;
  assert(isToken(token));
  assert(isEvmChainId(token.chainId));
  await switchChain(token.chainId);
  const {signer} = evm;
  assert(signer);
  assert(token);

  const mintAmount = parseCurrencyAmount(token, String(amount));

  const iface = new ethers.utils.Interface([
    'function mint(address _account, uint _amount) public',
  ]);
  const contract = new ethers.Contract(token.address, iface, signer);
  const response = await contract.mint(evm.account, toBigNumber(mintAmount));
  await response.wait();
  bridgeStore.updateBalances();
}
