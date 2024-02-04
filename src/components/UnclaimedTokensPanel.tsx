import {Currency, CurrencyAmount, getNetwork} from '@layerzerolabs/ui-core';
import {Box, Button, CurrencyIcon, Text} from '@layerzerolabs/ui-kit';
import {fiatStore} from '@layerzerolabs/ui-mobx';
import {observer} from 'mobx-react';
import {useState} from 'react';

import {unclaimedStore} from '../stores/unclaimedStore';

export const UnclaimedTokensPanel = observer(() => {
  const {unclaimed} = unclaimedStore;
  return (
    <>
      {unclaimed.map((balance) => (
        <UnclaimedItem
          key={balance.currency.symbol}
          amount={balance.amount}
          onClaim={(currency) => unclaimedStore.claim(currency)}
        />
      ))}
    </>
  );
});

const UnclaimedItem: React.FC<{amount: CurrencyAmount; onClaim: (currency: Currency) => unknown}> =
  observer((props) => {
    const {amount, onClaim} = props;
    const network = getNetwork(amount.currency.chainId);
    const [isClaiming, setIsClaiming] = useState(false);
    const fiatBalance = fiatStore.toFiatAmount(amount);

    async function claim(currency: Currency) {
      try {
        setIsClaiming(true);
        await Promise.resolve(onClaim(currency));
      } finally {
        setIsClaiming(false);
      }
    }

    return (
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, width: '100%'}}>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <CurrencyIcon size={32} currency={amount.currency} />
          <Box sx={{ml: 1.5}}>
            <Box>
              <Text variant='p3' color='text.secondary'>
                {network?.name}
              </Text>
            </Box>
            <Box>
              <Text variant='p2'>{amount.currency.symbol}</Text>
            </Box>
          </Box>
        </Box>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box sx={{textAlign: 'right'}}>
            <Box>
              <Text variant='p3' color='text.secondary'>
                {fiatBalance ? '$' + fiatBalance.value.toFixed(2) : '-'}
              </Text>
            </Box>
            <Box>
              <Text variant='p2'>{amount.toExact()}</Text>
            </Box>
          </Box>
          <Button
            variant={isClaiming ? 'secondary' : 'primary'}
            size='md'
            sx={{ml: 1.5}}
            onClick={() => claim(amount.currency)}
          >
            Claim
          </Button>
        </Box>
      </Box>
    );
  });
