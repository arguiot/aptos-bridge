import {getNativeCurrency} from '@layerzerolabs/ui-core';
import {
  Box,
  Button,
  CurrencyIcon,
  Input,
  Modal,
  ModalProps,
  Selector,
  Switch,
  Text,
  useTheme,
} from '@layerzerolabs/ui-kit';
import {observer} from 'mobx-react';

import {bridgeStore, DstNativeAmount} from '../stores/bridgeStore';

type GasOnDestinationModalProps = Omit<ModalProps, 'title' | 'children'>;

const options: string[] = [DstNativeAmount.DEFAULT, DstNativeAmount.MAX];

export const GasOnDestinationModal = observer((props: GasOnDestinationModalProps) => {
  const theme = useTheme();

  const {form} = bridgeStore;

  const {dstNativeAmount, maxDstNativeAmount} = bridgeStore;
  const dstNativeAmountInput = options.includes(form.dstNativeAmount)
    ? bridgeStore.dstNativeAmount?.toExact()
    : form.dstNativeAmount;

  const dstNativeAmountError =
    maxDstNativeAmount && dstNativeAmount?.greaterThan(maxDstNativeAmount)
      ? `Requested airdrop exceeds max: ${maxDstNativeAmount.toExact()} ${
          maxDstNativeAmount.currency.symbol
        }`
      : undefined;

  const isCustom = !options.includes(form.dstNativeAmount) && dstNativeAmountInput !== '0';

  const dstNativeCost = bridgeStore.messageFee?.nativeFee;

  const srcNative = form.srcChainId ? getNativeCurrency(form.srcChainId) : undefined;
  const dstNative = form.dstChainId ? getNativeCurrency(form.dstChainId) : undefined;

  return (
    <Modal title='Get ready for your destination' {...props}>
      <Box sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Text variant='p3' color='text.secondary'>
          Choose the amount of{' '}
          <Text variant='p3' color='primary.main'>
            {dstNative?.symbol}
          </Text>{' '}
          you want to swap.
          <br />
          The total amount you’ll pay in your wallet includes the gas you’ll be airdropping to your
          destination.
        </Text>
        <Box sx={{mt: 4, mb: 2}}>
          <Selector selection={form.dstNativeAmount}>
            <Selector.Option onClick={() => bridgeStore.setDstNativeAmount('0')} value={'0'}>
              None
            </Selector.Option>
            <Selector.Option
              onClick={() => bridgeStore.setDstNativeAmount(DstNativeAmount.DEFAULT)}
              value={DstNativeAmount.DEFAULT}
            >
              Medium
            </Selector.Option>
            <Selector.Option
              onClick={() => bridgeStore.setDstNativeAmount(DstNativeAmount.MAX)}
              value={DstNativeAmount.MAX}
            >
              Max
            </Selector.Option>
          </Selector>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Text color={theme.palette.text.secondary}>Custom amount</Text>
          <Switch checked={isCustom} />
        </Box>
        <Input
          onChange={(e) => bridgeStore.setDstNativeAmount(e.target.value)}
          size='md'
          error={dstNativeAmountError}
          value={dstNativeAmountInput}
          sx={{mt: 2, width: '100%'}}
          startAdornment={<CurrencyIcon size={16} currency={dstNative} />}
          endAdornment={
            <Button
              variant='tertiary'
              size='xs'
              onClick={() => bridgeStore.setDstNativeAmount(DstNativeAmount.MAX)}
            >
              Max
            </Button>
          }
        />
        <Box sx={{mt: 'auto', display: 'flex', justifyContent: 'space-between'}}>
          <Text color={theme.palette.text.secondary} variant='p3'>
            Cost
          </Text>
          <Text variant='p3'>
            {dstNativeCost?.toSignificant()} {dstNativeCost?.currency.symbol}
          </Text>
        </Box>
      </Box>
    </Modal>
  );
});
