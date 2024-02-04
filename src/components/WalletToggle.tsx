import {Text} from '@layerzerolabs/ui-kit';
import {Wallet} from '@layerzerolabs/ui-mobx';

import {uiStore, WalletTab} from '../stores/uiStore';

export const WalletToggle: React.FC<{wallet?: Wallet}> = ({wallet}) => {
  const onClick = wallet
    ? wallet.disconnect
    : () => {
        uiStore.walletModal.setActiveTab(WalletTab.WALLET);
        uiStore.walletModal.open();
      };

  return (
    <Text.Link variant='p3' onClick={onClick} sx={{zIndex: 5}}>
      {wallet ? 'Disconnect' : 'Connect'}
    </Text.Link>
  );
};
