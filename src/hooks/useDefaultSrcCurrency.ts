import {getWalletBalance} from '@layerzerolabs/ui-mobx';
import {compact} from 'lodash';
import {useEffect} from 'react';

import {bridgeStore} from '../stores/bridgeStore';

export function useDefaultSrcCurrency() {
  const {srcWallet, currencies} = bridgeStore;
  const {srcCurrency} = bridgeStore.form;
  const balances = srcWallet
    ? currencies.filter((c) => c.chainId === srcWallet.chainId).map((c) => getWalletBalance(c))
    : [];
  const isLoaded = srcWallet ? balances.every((b) => !!b) : false;
  useEffect(() => {
    if (srcCurrency) return;
    if (!isLoaded) return;
    if (!srcWallet) return;
    const highestBalance = compact(balances)
      .sort((a, b) => Number(b.toExact()) - Number(a.toExact()))
      .at(0);
    if (highestBalance) {
      bridgeStore.setSrcCurrency(highestBalance.currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcWallet?.account, isLoaded]);
}
