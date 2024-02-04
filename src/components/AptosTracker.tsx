import type {TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {isToken} from '@layerzerolabs/ui-core';
import {
  Button,
  Tracker as TrackerBase,
  TrackerCarousel,
  useHasMounted,
} from '@layerzerolabs/ui-kit';
import {Transaction, walletStore} from '@layerzerolabs/ui-mobx';
import {observer} from 'mobx-react';

import {uiStore} from '../stores/uiStore';
import {unclaimedStore} from '../stores/unclaimedStore';

export const AptosTracker: React.FC = observer(() => {
  // Ensure the tracker has mounted, bug in React is causing a UI issue
  const mounted = useHasMounted();
  if (!mounted) return null;

  return (
    <TrackerCarousel
      txs={uiStore.txProgress.transactions}
      sx={{mb: 4}}
      renderTracker={renderTracker}
    />
  );
});

function renderTracker(tx: Transaction) {
  return <Tracker tx={tx} key={tx.txHash} />;
}

const Tracker = observer(({tx}: {tx: Transaction}) => {
  const {aptos} = walletStore;
  const isUnclaimed = unclaimedStore.isUnclaimed(tx.input.dstCurrency);
  const input: TransferInput | undefined = tx.input;
  const isDstWalletConnected = aptos && input?.dstAddress === aptos.account;

  return (
    <TrackerBase
      key={tx.txHash}
      tx={tx}
      sx={{minWidth: '100%'}}
      onClose={
        !isUnclaimed && (tx.completed || tx.error)
          ? () => uiStore.txProgress.dismiss(tx.txHash!)
          : undefined
      }
      status={
        isDstWalletConnected && tx.completed && isToken(tx.input.dstCurrency) && isUnclaimed ? (
          <Button
            size='sm'
            sx={{marginTop: -2.5}}
            variant='primary'
            onClick={() => unclaimedStore.claim(tx.input.dstCurrency)}
          >
            Claim
          </Button>
        ) : undefined // use the default status if no claim is available
      }
    />
  );
});
