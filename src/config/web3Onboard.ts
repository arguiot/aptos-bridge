import {createWeb3OnboardChains} from '@layerzerolabs/ui-adapter-web3-onboard';
import coinbaseWalletModule from '@web3-onboard/coinbase';
import createWeb3Onboard, {OnboardAPI} from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';

const logo = (height: number) => `<svg></svg>`;
const injected = injectedModule();
const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule();

// need to try to restore because re-rerenders removes chains from somehow
export const web3Onboard: OnboardAPI = createWeb3Onboard({
  wallets: [
    //
    injected,
    coinbaseWalletSdk,
    walletConnect,
  ],
  appMetadata: {
    icon: logo(30),
    logo: logo(40),
    name: 'OFT BRIDGE',
    description: 'OFT BRIDGE by LayerZero',
  },
  chains: createWeb3OnboardChains(),
  accountCenter: {
    desktop: {enabled: false},
    mobile: {enabled: false},
  },
  notify: {
    enabled: false,
  },
});
