import {OftBridge__evm} from '@layerzerolabs/ui-bridge-oft';
import {Currency, CurrencyAmount} from '@layerzerolabs/ui-core';

import {bridgeStore} from '../../stores/bridgeStore';
import {AbstractBridgeStrategy, getEvmSigner} from './AbstractBridgeStrategy';
import {BridgeOutput, BridgeStrategy} from './BridgeStrategy';

export class BridgeStrategy__oft_evm
  extends AbstractBridgeStrategy<OftBridge__evm>
  implements BridgeStrategy
{
  constructor(api: OftBridge__evm) {
    super(api);
  }

  signer = getEvmSigner;

  spender(): string | undefined {
    return this.srcProxy?.address;
  }

  async getOutput(inputAmount: CurrencyAmount, dstCurrency: Currency): Promise<BridgeOutput> {
    const output = await this.api.getOutput(inputAmount, dstCurrency);
    return {
      amount: output.amount,
      totalFee: output.fee,
    };
  }

  get srcProxy() {
    const {srcCurrency} = bridgeStore.form;
    if (!srcCurrency) return undefined;
    return this.api.config.proxy.find((proxy) => proxy.chainId === srcCurrency.chainId);
  }
}
