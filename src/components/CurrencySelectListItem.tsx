import {formatCurrencyAmount, formatFiatAmount, getNetwork} from '@layerzerolabs/ui-core';
import {CurrencyIcon, CurrencySelectOption, ListItem} from '@layerzerolabs/ui-kit';
import {fiatStore, getWalletBalance} from '@layerzerolabs/ui-mobx';

export const CurrencySelectListItem: React.FC<{
  option: CurrencySelectOption;
}> = ({option, ...props}) => {
  const {currency} = option;
  const network = getNetwork(currency.chainId);
  const balance = getWalletBalance(currency);
  const fiatBalance = fiatStore.toFiatAmount(balance);
  return (
    <ListItem
      {...props}
      disabled={option.disabled}
      overlay={option.overlay}
      startAdornment={<CurrencyIcon size={32} currency={currency} />}
      bottomLeft={currency.symbol}
      topLeft={network.name}
      topRight={fiatBalance ? formatFiatAmount(fiatBalance) : '-'}
      bottomRight={formatCurrencyAmount.nice(balance, 3) ?? '-'}
    />
  );
};
