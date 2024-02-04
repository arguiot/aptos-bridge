import {
  Bar,
  Box,
  Button,
  ButtonGroup,
  DesktopOnly,
  formatAddress,
  Icon,
  MobileOnly,
  NetworkIcon,
  SxProps,
  Text,
} from '@layerzerolabs/ui-kit';
import {walletStore} from '@layerzerolabs/ui-mobx';
import {observer} from 'mobx-react';
import Link from 'next/link';
import * as React from 'react';

import {bridgeStore} from '../stores/bridgeStore';
import {uiStore, WalletTab} from '../stores/uiStore';
import {AccountModal} from './AccountModal';
import {Button as AptosButton} from './Button';

const NavLink = ({title, href, sx}: {title: string; href: string; sx?: SxProps}) => {
  return (
    <Link href={href}>
      <Text.Link
        sx={{
          ml: {xs: '12px', md: '24px'},
          ...sx,
        }}
        variant='p1'
      >
        {title}
      </Text.Link>
    </Link>
  );
};

export const AppHeader = observer(() => {
  return (
    <>
      <Bar sx={{paddingY: {xs: 1.5, sm: 3}}}>
        <Bar.Section>
          <Link href='/'>
            <a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/static/logo.svg' width={100} height={34} alt='Aptos Bridge' />
            </a>
          </Link>
          <DesktopOnly>
            <NavLink title={'Transfer'} href={'/bridge'} sx={{ml: '50px'}} />
            <NavLink title={'Widget'} href={'/widget'} />
            <NavLink title={'FAQ'} href={'/faq'} />
          </DesktopOnly>
        </Bar.Section>
        <MobileOnly>
          <Bar.Section>
            <NavLink title={'Transfer'} href={'/bridge'} />
            <NavLink title={'Widget'} href={'/widget'} />
            <NavLink title={'FAQ'} href={'/faq'} />
          </Bar.Section>
        </MobileOnly>
        <DesktopOnly>
          <Bar.Section>
            <CommonItems />
          </Bar.Section>
        </DesktopOnly>
      </Bar>
    </>
  );
});

export const AppFooter = () => {
  return (
    <MobileOnly>
      <Bar>
        <Bar.Section>
          <CommonItems />
        </Bar.Section>
      </Bar>
    </MobileOnly>
  );
};

const CommonItems = observer(() => {
  const {aptos, evm} = walletStore;
  const {hasUnclaimed} = bridgeStore;
  const {hasPendingTransactions} = uiStore.txProgress;
  const {walletModal} = uiStore;

  const handleConnect = () => {
    walletModal.setActiveTab(WalletTab.WALLET);
    walletModal.open();
  };

  return (
    <>
      {/* early render messes up the color - weird bug */}
      {hasPendingTransactions && (
        <Button size='md'>
          <DesktopOnly display='inline'>Pending&nbsp;</DesktopOnly>
          <Icon.Spinner inline />
        </Button>
      )}
      {!aptos && !evm ? (
        <AptosButton size='md' onClick={handleConnect} variant='primary'>
          Connect Wallets
        </AptosButton>
      ) : (
        <ButtonGroup>
          {evm ? (
            <Button
              variant='secondary'
              size='md'
              onClick={handleConnect}
              sx={{display: 'flex', alignItems: 'center'}}
            >
              <Box sx={{mr: 1}}>
                <NetworkIcon chainId={evm.chainId} size={16} />
              </Box>
              {formatAddress(evm.account)}
            </Button>
          ) : (
            <Button
              variant='secondary'
              size='md'
              onClick={handleConnect}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '169px',
              }}
            >
              Connect EVM
            </Button>
          )}
          {aptos ? (
            <Button
              variant='secondary'
              size='md'
              onClick={handleConnect}
              sx={{display: 'flex', alignItems: 'center'}}
            >
              <Box sx={{mr: 1}}>
                <NetworkIcon chainId={aptos.chainId} size={16} />
              </Box>
              {formatAddress(aptos.account)}
            </Button>
          ) : (
            <Button
              variant='secondary'
              size='md'
              onClick={handleConnect}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '169px',
              }}
            >
              Connect APTOS
            </Button>
          )}
        </ButtonGroup>
      )}
      {hasUnclaimed && (
        <Button
          variant='secondary'
          size='md'
          onClick={() => {
            walletModal.setActiveTab(WalletTab.UNCLAIMED);
            walletModal.open();
          }}
        >
          <span>Claimable Tokens</span>
          <Icon.Alert inline size={14} sx={{ml: '17px'}} />
        </Button>
      )}

      <AccountModal
        open={walletModal.value}
        onClose={() => {
          walletModal.setActiveTab(WalletTab.TRANSACTIONS);
          walletModal.close();
        }}
      />
    </>
  );
});
