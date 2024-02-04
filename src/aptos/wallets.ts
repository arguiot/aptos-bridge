import {WalletsByType} from '@layerzerolabs/ui-adapter-aptos';
import {WalletType} from '@layerzerolabs/ui-core';
import {
  AptosWalletAdapter,
  FewchaWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  MSafeWalletAdapter,
} from '@manahippo/aptos-wallet-adapter';

export const walletsByType: WalletsByType = {
  [WalletType.Pontem]: new PontemWalletAdapter(),
  [WalletType.Martian]: new MartianWalletAdapter(),
  [WalletType.Fewcha]: new FewchaWalletAdapter(),
  [WalletType.Petra]: new AptosWalletAdapter(),
  [WalletType.MSafe]: new MSafeWalletAdapter(),
};
