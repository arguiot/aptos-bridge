import {ChainId} from '@layerzerolabs/lz-sdk';
import type {OftBridgeConfig} from '@layerzerolabs/ui-bridge-oft';
import {Token} from '@layerzerolabs/ui-core';

export const OFT: OftBridgeConfig[] = [
  // BTC.b
  {
    proxy: [
      {
        chainId: ChainId.AVALANCHE,
        address: '0x2297aEbD383787A160DD0d9F71508148769342E3',
      },
    ],
    tokens: [
      new Token(ChainId.ETHEREUM, '0x2297aEbD383787A160DD0d9F71508148769342E3', 8, 'BTC.b'),
      new Token(ChainId.BSC, '0x2297aEbD383787A160DD0d9F71508148769342E3', 8, 'BTC.b'),
      new Token(ChainId.POLYGON, '0x2297aEbD383787A160DD0d9F71508148769342E3', 8, 'BTC.b'),
      new Token(ChainId.ARBITRUM, '0x2297aEbD383787A160DD0d9F71508148769342E3', 8, 'BTC.b'),
      new Token(ChainId.OPTIMISM, '0x2297aEbD383787A160DD0d9F71508148769342E3', 8, 'BTC.b'),
      new Token(ChainId.AVALANCHE, '0x152b9d0fdc40c096757f570a51e494bd4b943e50', 8, 'BTC.b'),
      new Token(
        ChainId.APTOS,
        '0x8b107b816356295ea62750020edea701bfc6d11575953d0e146c20d7b9409300::oft::BTCbOFT',
        8,
        'BTC.b',
      ),
    ],
  },
  // CAKE
  {
    proxy: [
      {
        chainId: ChainId.BSC,
        address: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
      },
    ],
    tokens: [
      new Token(ChainId.BSC, '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', 18, 'CAKE', 'Cake'),
      new Token(
        ChainId.APTOS,
        '0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT',
        8,
        'CAKE',
        'CakeOFT',
      ),
    ],
  },
];
