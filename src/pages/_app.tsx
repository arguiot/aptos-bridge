import '../styles/style.css';
import '../styles/onboard.css';
import '../aptos/polyfill';
import 'react-toastify/dist/ReactToastify.css';

import {createAptosAdapter} from '@layerzerolabs/ui-adapter-aptos';
import {createWeb3OnboardAdapter} from '@layerzerolabs/ui-adapter-web3-onboard';
import {themeAptos, ThemeProvider, ToastProvider} from '@layerzerolabs/ui-kit';
import {WalletProvider} from '@manahippo/aptos-wallet-adapter';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {AppProps} from 'next/app';
import Head from 'next/head';

import {walletsByType} from '../aptos/wallets';
import {bootstrap} from '../config/bootstrap';
import {web3Onboard} from '../config/web3Onboard';

const queryClient = new QueryClient();

const {Provider: Web3OnboardProvider, adapter: evmAdapter} = createWeb3OnboardAdapter(web3Onboard);
const aptosAdapter = createAptosAdapter(walletsByType);
const wallets = Object.values(walletsByType);

bootstrap({
  aptosAdapter,
  evmAdapter,
});

// app is re-rendered on every save
export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.svg' />
        <title>APTOS BRIDGE by LayerZero</title>
      </Head>
      <ThemeProvider theme={themeAptos}>
        <Web3OnboardProvider>
          <WalletProvider wallets={wallets}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                {/* @ts-ignore */}
                <Component {...pageProps} />
              </ToastProvider>
            </QueryClientProvider>
          </WalletProvider>
        </Web3OnboardProvider>
      </ThemeProvider>
    </>
  );
}
