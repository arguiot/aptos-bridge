import {formatCurrencyAmount, formatFiatAmount, tryGetNetwork} from '@layerzerolabs/ui-core';
import {
  Alert,
  AlertType,
  Box,
  Button,
  Container,
  CurrencySelect,
  CurrencySelectOption,
  Details,
  Icon,
  Input,
  InputAdornment,
  InputsGroup,
  NetworkSelect,
  NetworkSelectOption,
  Panel,
  styled,
  SwapButton,
  Text,
  useTheme,
  WithTooltip,
} from '@layerzerolabs/ui-kit';
import {approveStore, FiatSymbol, resourceStore, toFiat, walletStore} from '@layerzerolabs/ui-mobx';
import {observer} from 'mobx-react';
import React, {useState} from 'react';
import Lottie from 'react-lottie-player';

import ClaimExampleAnimation from '../animations/claim-example-animation.json';
import {IS_WIDGET} from '../config/env';
import {useCakeLimitAmount} from '../hooks/useCakeLimitAmount';
import {useDefaultSrcCurrency} from '../hooks/useDefaultSrcCurrency';
import {bridgeStore} from '../stores/bridgeStore';
import {uiStore, WalletTab} from '../stores/uiStore';
import {unclaimedStore} from '../stores/unclaimedStore';
import {AptosTracker} from './AptosTracker';
import {Button as AptosButton} from './Button';
import {CurrencySelectListItem} from './CurrencySelectListItem';
import {GasOnDestinationModal} from './GasOnDestinationModal';
import {NetworkSelectListItem} from './NetworkSelectListItem';
import {WalletDecoration} from './WalletDecoration';
import {WalletToggle} from './WalletToggle';

export const AptosBridge = observer(() => {
  useDefaultSrcCurrency();
  const theme = useTheme();
  const {
    errors,
    isApproving,
    isExecuting,
    outputAmount,
    srcWallet,
    dstWallet,
    amount,
    dstNativeAmount,
    form,
    output,
  } = bridgeStore;
  const [error] = errors;
  const bridgeFee = output?.totalFee;

  const fiatSymbols = [FiatSymbol.USD, FiatSymbol.EUR];
  const [fiatSymbol, setFiatSymbol] = useState(FiatSymbol.USD);

  const {evm, aptos} = walletStore;
  const isConnected = Boolean(evm && aptos);

  const isSigning =
    bridgeStore.isSigning ||
    (bridgeStore.isApproving && approveStore.isSigning) ||
    (bridgeStore.isRegistering && resourceStore.isSigning);

  const isMining =
    bridgeStore.isMining ||
    (bridgeStore.isApproving && approveStore.isMining) ||
    (bridgeStore.isRegistering && resourceStore.isMining);

  function openWalletModal() {
    uiStore.walletModal.setActiveTab(WalletTab.WALLET);
    uiStore.walletModal.open();
  }

  const hasActiveTxs = uiStore.txProgress.transactions.length > 0;

  const cakeLimit = useCakeLimitAmount();

  return (
    <>
      <Container maxWidth='sm' sx={{paddingX: 0}}>
        {hasActiveTxs && (
          <Panel title='' sx={{margin: 'auto', height: 118}}>
            <AptosTracker />
          </Panel>
        )}

        <Panel title='' sx={{margin: 'auto', mt: hasActiveTxs ? 4 : 8}}>
          <Box
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mt: '-16px',
            }}
          >
            <WalletDecoration
              address={srcWallet?.account}
              type={srcWallet?.type}
              onClick={openWalletModal}
            />
            <WalletToggle wallet={srcWallet} />
          </Box>

          <InputsGroup>
            <InputsGroup.Top>
              <CurrencySelect
                sx={{flex: 2}}
                options={bridgeStore.srcCurrencyOptions}
                value={bridgeStore.form.srcCurrency}
                onSelect={bridgeStore.setSrcCurrency}
                renderOption={renderCurrencyOption}
              />
              <NetworkSelect
                sx={{flex: 1}}
                readonly
                icon={false}
                value={bridgeStore.form?.srcChainId}
                renderOption={renderNetworkOption}
              />
            </InputsGroup.Top>
            <InputsGroup.Bottom>
              <Input
                // @ts-ignore
                size='lg'
                placeholder='0'
                startAdornment={
                  <Button size='xs' variant='tertiary' onClick={bridgeStore.setMaxAmount}>
                    Max
                  </Button>
                }
                onChange={(event) => bridgeStore.setAmount(event.target.value)}
                value={bridgeStore.form.amount}
                endAdornment={
                  <InputAdornment>
                    <Text color={theme.palette.text.secondary} size={12}>
                      Balance
                    </Text>
                    <Text color={theme.palette.text.secondary} size={12}>
                      {formatCurrencyAmount.nice(bridgeStore.srcBalance, 3)}
                    </Text>
                  </InputAdornment>
                }
              />
            </InputsGroup.Bottom>
          </InputsGroup>
          <SwapButton onClick={bridgeStore.switch} />
          <Box
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mt: '-30px',
              paddingTop: '5px',
              position: 'relative',
              zIndex: 5,
            }}
          >
            <WalletDecoration
              address={dstWallet?.account}
              type={dstWallet?.type}
              onClick={openWalletModal}
            />
            <WalletToggle wallet={dstWallet} />
          </Box>
          <InputsGroup>
            <InputsGroup.Top>
              <CurrencySelect
                // forcing consistent format
                readonly
                sx={{flex: 2}}
                value={bridgeStore.form.dstCurrency}
                renderOption={renderCurrencyOption}
              />
              <NetworkSelect
                sx={{flex: 1}}
                options={bridgeStore.dstNetworkOptions}
                icon={false}
                onSelect={bridgeStore.setDstChainId}
                value={bridgeStore.form?.dstChainId}
                renderOption={renderNetworkOption}
              />
            </InputsGroup.Top>

            <InputsGroup.Bottom>
              <Input
                // @ts-ignore
                size='lg'
                value={bridgeStore.outputAmount?.toExact() ?? '-'}
                readOnly
                endAdornment={
                  <InputAdornment>
                    <div>
                      {fiatSymbols.map((symbol) => (
                        <Text
                          key={symbol}
                          sx={{cursor: 'pointer'}}
                          color={fiatSymbol !== symbol ? theme.palette.text.secondary : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFiatSymbol(symbol);
                          }}
                          size={12}
                        >
                          {symbol}{' '}
                        </Text>
                      ))}
                    </div>
                    <Text color={theme.palette.text.secondary} size={12}>
                      {formatFiatAmount.nice(toFiat(outputAmount, fiatSymbol))}
                    </Text>
                  </InputAdornment>
                }
              />
            </InputsGroup.Bottom>
          </InputsGroup>
          <Details
            sx={{my: '24px'}}
            items={[
              {
                label: 'Gas on destination',
                value: form.dstChainId ? (
                  <GasOnDestinationButton onClick={uiStore.dstNativeAmountModal.open}>
                    {dstNativeAmount?.equalTo(0) || !dstNativeAmount
                      ? 'Add'
                      : `${dstNativeAmount.toExact()} ${dstNativeAmount.currency.symbol}`}
                  </GasOnDestinationButton>
                ) : (
                  '--'
                ),
              },
              {
                label: (
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    Fee
                    <WithTooltip text='The amount shown in the destination input accounts for this fee'>
                      <div>
                        <Icon.Info size={12} sx={{ml: 0.5}} />
                      </div>
                    </WithTooltip>
                  </Box>
                ),
                value: bridgeFee ? bridgeFee?.toExact() : '--',
              },
              // {
              //   label: 'Cake limit',
              //   value: cakeLimit.isCake && cakeLimit.limit?.toExact(),
              // },
            ]}
          />
          {isConnected ? (
            cakeLimit.error ? (
              <AptosButton variant='primary' type='button' disabled>
                {cakeLimit.error}
              </AptosButton>
            ) : error ? (
              <AptosButton variant='primary' type='button' disabled>
                {error}
              </AptosButton>
            ) : isApproving ? (
              <AptosButton variant='primary' type='button'>
                Approving ...
              </AptosButton>
            ) : isExecuting ? (
              <AptosButton variant='primary' type='button'>
                Sending ...
              </AptosButton>
            ) : (
              <AptosButton variant='primary' type='button' onClick={bridgeStore.transfer}>
                Transfer
              </AptosButton>
            )
          ) : (
            <AptosButton variant='primary' type='button' onClick={openWalletModal}>
              Connect
            </AptosButton>
          )}

          <Alert
            key='claim'
            title={unclaimedStore.isSigning ? 'Confirm in your wallet' : 'Claiming tokens'}
            open={unclaimedStore.isExecuting}
            type={IS_WIDGET ? AlertType.LOADING : undefined}
            image={
              IS_WIDGET ? undefined : <Lottie loop animationData={ClaimExampleAnimation} play />
            }
          >
            <div>
              Claiming{' '}
              <Text>
                {unclaimedStore.claimingAmount?.toSignificant()}{' '}
                {unclaimedStore.claimingAmount?.currency.symbol}
              </Text>{' '}
              on <Text>APTOS</Text>
            </div>
            <Text color={theme.palette.text.secondary} size={12} sx={{mt: 'auto'}}>
              {unclaimedStore.isSigning
                ? 'Confirm this transaction in your wallet'
                : 'Waiting for blockchain confirmation...'}
            </Text>
          </Alert>

          <Alert
            key='reminder'
            title="Don't forget to claim"
            open={uiStore.claimReminderAlert.value}
            onClose={uiStore.claimReminderAlert.close}
            type={IS_WIDGET ? AlertType.SUCCESS : undefined}
            image={
              IS_WIDGET ? undefined : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src='/static/claim-example.svg' height={60} width={252} alt='Claim example' />
              )
            }
          >
            <Text
              variant='p3'
              color={theme.palette.text.secondary}
              sx={{marginBottom: '24px', maxWidth: '432px'}}
            >
              You must claim your assets once your transaction has completed. This is required
              because your Aptos wallet did not have enough APT tokens to cover initial transaction
              fees. Remember, this is only required the first time you interact with an asset.
            </Text>
            <AptosButton
              onClick={uiStore.claimReminderAlert.close}
              variant='primary'
              sx={{width: '204px', height: '40px', marginTop: 'auto'}}
            >
              OKAY
            </AptosButton>
          </Alert>

          <Alert
            key='transfer'
            open={bridgeStore.isExecuting}
            type={IS_WIDGET ? AlertType.LOADING : undefined}
            image={
              IS_WIDGET ? undefined : <Lottie loop animationData={ClaimExampleAnimation} play />
            }
            title={
              bridgeStore.isRegistering
                ? 'Register token first'
                : bridgeStore.isApproving
                ? 'Approving transaction'
                : isMining
                ? 'Submitting transaction'
                : 'Confirm in your wallet'
            }
          >
            <div>
              Transferring{' '}
              <Text>
                {amount?.toSignificant()} {amount?.currency.symbol}{' '}
              </Text>
              from <Text>{tryGetNetwork(form.srcChainId)?.name} </Text>
              to <Text>{tryGetNetwork(form.dstChainId)?.name} </Text>
            </div>

            {bridgeStore.isRegistering ? (
              <Text variant='p3' sx={{mt: 2}} color={theme.palette.text.secondary}>
                Asset registration is only required during your first interaction with an asset on
                Aptos. This is a mandatory Aptos security measure that will keep your wallet secure.
              </Text>
            ) : null}

            <Text color={theme.palette.text.secondary} size={12} sx={{mt: 3}}>
              {bridgeStore.isRegistering ? (
                'Confirm this transaction in your wallet'
              ) : bridgeStore.isApproving ? (
                'Approve this transaction in your wallet.'
              ) : isSigning ? (
                'Please check pending wallet actions if you did not receive a transaction prompt.'
              ) : isMining ? (
                'Waiting for blockchain confirmation...'
              ) : (
                <>&nbsp;</>
              )}
            </Text>
          </Alert>

          <Alert
            key='rpc-error'
            open={uiStore.rpcErrorAlert.value}
            title='Something went wrong'
            image={
              IS_WIDGET ? undefined : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src='/static/something-went-wrong.svg'
                  height={96}
                  width={146}
                  alt='Something went wrong'
                />
              )
            }
          >
            <Text
              variant='p3'
              color={theme.palette.text.secondary}
              sx={{marginBottom: '24px', maxWidth: '432px'}}
            >
              The network is congested right now. Please wait 5 minutes and refresh the page again.
            </Text>
            <AptosButton
              onClick={uiStore.rpcErrorAlert.close}
              variant='primary'
              sx={{width: '204px', height: '40px', marginTop: 'auto'}}
            >
              OKAY
            </AptosButton>
          </Alert>
        </Panel>
      </Container>
      <GasOnDestinationModal
        open={uiStore.dstNativeAmountModal.value}
        onClose={uiStore.dstNativeAmountModal.close}
      />
    </>
  );
});

const GasOnDestinationButton = styled('span', {name: 'GasOnDestinationButton'})(({theme}) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

function renderCurrencyOption(option: CurrencySelectOption) {
  return <CurrencySelectListItem option={option} />;
}

function renderNetworkOption(option: NetworkSelectOption) {
  return <NetworkSelectListItem option={option} />;
}
