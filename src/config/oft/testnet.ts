import {ChainId} from '@layerzerolabs/lz-sdk';
import type {OftBridgeConfig} from '@layerzerolabs/ui-bridge-oft';
import {Token} from '@layerzerolabs/ui-core';
import {compact} from 'lodash';

export const OFT: OftBridgeConfig[] = compact([
  // BTC.b
  {
    proxy: [
      {
        chainId: ChainId.FUJI,
        address: '0xB1ba9274a27C27b848186A8504f4409DD30E6Ec7',
      },
    ],
    tokens: [
      new Token(ChainId.FUJI, '0x3D1Bf401Fa74a8711fA3e09AB3B3ECA24CCF9218', 8, 'BTC.b'),
      new Token(ChainId.GOERLI, '0xd75D7F9f598Eb5Cc5539B460D54aB21E0469f4A8', 8, 'BTC.b'),
      new Token(
        ChainId.APTOS_TESTNET,
        '0x32dc19ea987e86e024241843b90e6aa91d04d05f868d8ecb691fa5ce26a5b2b6::oft::BTCbOFT',
        8,
        'BTC.b',
      ),
    ],
  },

  // CAKE - LayerZero
  false && {
    proxy: [
      {
        chainId: ChainId.BSC_TESTNET,
        address: '0x7E2EFCDa5fB7ce8cC0Ff8830eEF50f6e6C71d8e5',
      },
    ],
    tokens: [
      new Token(
        ChainId.BSC_TESTNET,
        '0x9cabdd4486e8C3473E4620223fbaEBA8ac61001E',
        18,
        'CAKE',
        'CakeOFT',
      ),
      new Token(
        ChainId.APTOS_TESTNET,
        '0x1f361b9dc3ebc762a6bce1fd4414963615090cf49763c73a3fc653437e2ea298::oft::CakeOFT',
        8,
        'CAKE',
        'CakeOFT',
      ),
    ],
  },

  // CAKE - PCS
  {
    proxy: [
      {
        chainId: ChainId.BSC_TESTNET,
        address: '0xf22c77E28085EB520452510CC612D4BAB366c088',
      },
    ],
    tokens: [
      new Token(
        ChainId.BSC_TESTNET,
        '0xFa60D973F7642B748046464e165A65B7323b0DEE',
        18,
        'CAKE',
        'CakeOFT',
      ),
      new Token(
        ChainId.APTOS_TESTNET,
        '0x2e33bd36860a6fe4eff85d7f66d33d429c9afcf54713d8dd734cfa71ce124b4a::oft::CakeOFT',
        8,
        'CAKE',
        'CakeOFT',
      ),
    ],
  },
]);
