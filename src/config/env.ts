import {ChainId, ChainStage} from '@layerzerolabs/lz-sdk';

export const IS_WIDGET = !process.env.NEXT_PUBLIC_IS_WEBSITE;

export const CHAIN_STAGE: ChainStage = getChainStageFromEnv(process.env.NEXT_PUBLIC_CHAIN_STAGE);
export const APTOS_CHAIN_ID =
  CHAIN_STAGE === ChainStage.TESTNET ? ChainId.APTOS_TESTNET : ChainId.APTOS;

export const APTOS_NODE_URL =
  process.env.NEXT_PUBLIC_APTOS_NODE_URL ||
  (CHAIN_STAGE === ChainStage.TESTNET
    ? 'https://fullnode.testnet.aptoslabs.com/v1'
    : 'https://mainnet.aptoslabs.com/v1');

export const ENABLED_CHAINS =
  CHAIN_STAGE === ChainStage.TESTNET
    ? [
        //
        ChainId.BSC_TESTNET,
        ChainId.APTOS_TESTNET,
        ChainId.GOERLI,
        ChainId.FUJI,
      ]
    : [
        ChainId.ETHEREUM,
        ChainId.ARBITRUM,
        ChainId.OPTIMISM,
        ChainId.BSC,
        ChainId.AVALANCHE,
        ChainId.POLYGON,
        ChainId.APTOS,
      ];

function getChainStageFromEnv(value?: string): ChainStage {
  const chainStage = String(value || '').toUpperCase();
  if (chainStage === 'TESTNET') return ChainStage.TESTNET;
  return ChainStage.MAINNET;
}
