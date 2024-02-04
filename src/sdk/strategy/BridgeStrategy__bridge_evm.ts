import {AptosBridge__evm} from '@layerzerolabs/ui-bridge-aptos';
import {Currency, CurrencyAmount} from '@layerzerolabs/ui-core';

import {bridgeStore} from '../../stores/bridgeStore';
import {AbstractBridgeStrategy, getEvmSigner} from './AbstractBridgeStrategy';
import {BridgeOutput, BridgeStrategy} from './BridgeStrategy';

export class BridgeStrategy__bridge_evm
  extends AbstractBridgeStrategy<AptosBridge__evm>
  implements BridgeStrategy
{
  constructor(api: AptosBridge__evm) {
    super(api);
  }

  signer = getEvmSigner;

  spender(): string | undefined {
    const {srcChainId} = bridgeStore.form;
    if (!srcChainId) return undefined;
    return this.api.getBridgeAddress(srcChainId);
  }

  async getOutput(inputAmount: CurrencyAmount, dstCurrency: Currency): Promise<BridgeOutput> {
    const output = await this.api.getOutput(inputAmount, dstCurrency);
    return {
      amount: output.amount,
      totalFee: output.fee,
    };
  }
}
