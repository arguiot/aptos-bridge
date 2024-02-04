import type {TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {getScanLink, getTransactionLink} from '@layerzerolabs/ui-core';
import {Icon, Stack, Text} from '@layerzerolabs/ui-kit';
import {Transaction} from '@layerzerolabs/ui-mobx';
import {Box, useTheme} from '@mui/system';
import {observer} from 'mobx-react';

interface TransactionItemProps {
  tx: Transaction;
}

// naive
function isCrossChainTx(tx: Transaction) {
  const input = tx.input;
  if (input?.dstChainId) return true;
  return false;
}

export const TransactionItem = observer(({tx}: TransactionItemProps) => {
  const theme = useTheme();
  const isSuccess = tx.completed;
  const isError = !!tx.error;
  const isPending = !isError && !isSuccess;
  const link = isCrossChainTx(tx)
    ? getScanLink(tx.chainId, tx.txHash!)
    : getTransactionLink(tx.chainId, tx.txHash!);

  const input: TransferInput | undefined = tx.input;

  return (
    <Box sx={{display: 'flex', mb: 2, width: '100%'}}>
      <a href={link} target='_blank'>
        <Icon.BlockchainExplorer size={16} color={theme.palette.text.secondary} />
      </a>
      <Text
        size={12}
        sx={{flex: 1, ml: 1, mr: 2}}
        color={isSuccess ? theme.palette.text.primary : theme.palette.text.secondary}
      >
        <Stack direction='row' justifyContent='space-between'>
          <Box>{tx.type}</Box>
          <Box> {input && `${input.amount.toSignificant()} ${input.srcCurrency.symbol}`}</Box>
        </Stack>
      </Text>
      {isSuccess && <Icon.Success size={16} />}
      {isPending && <Icon.Spinner size={16} />}
      {isError && <Icon.Error size={16} />}
    </Box>
  );
});
