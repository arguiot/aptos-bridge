import {ChainStage} from '@layerzerolabs/lz-sdk';

import {CHAIN_STAGE} from '../env';
import * as MAINNET from './mainnet';
import * as TESTNET from './testnet';

export const {OFT} = CHAIN_STAGE === ChainStage.MAINNET ? MAINNET : TESTNET;
