import {ChainId} from '@layerzerolabs/lz-sdk';
import {WALLETS_APTOS, WALLETS_EVM, WalletType} from '@layerzerolabs/ui-core';
import {networkStore} from '@layerzerolabs/ui-mobx';
import {types} from 'mobx-state-tree';

const ConfigStoreModel = types
  .model({
    tokens: types.array(types.frozen<string>()),
    wallets: types.array(types.frozen<WalletType>()),
  })
  .views(() => ({
    get chains(): ChainId[] {
      return networkStore.enabledChains;
    },
  }))
  .actions((store) => {
    const actions = {
      setChains(chains: ChainId[]) {
        networkStore.setEnabledNetworks(chains);
      },
      setWallets(wallets: WalletType[]) {
        store.wallets.replace(wallets);
      },
      setTokens(symbols: string[]) {
        store.tokens.replace(symbols);
      },
    };
    return actions;
  });

export const configStore = ConfigStoreModel.create({
  tokens: ['USDC', 'USDT', 'WETH', 'ETH', 'BTC.b', 'CAKE', 'USDD', 'WBTC'],
  wallets: [...WALLETS_EVM, ...WALLETS_APTOS],
});
