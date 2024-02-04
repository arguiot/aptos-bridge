import {ChainType, WALLETS_APTOS, WALLETS_EVM, WalletType} from '@layerzerolabs/ui-core';
import {isWalletAvailable} from '@layerzerolabs/ui-core';
import {
  Box,
  Button,
  Icon,
  Input,
  Modal,
  ModalProps,
  SxProps,
  Tabs,
  Text,
  useTheme,
} from '@layerzerolabs/ui-kit';
import {getWalletExtension, transactionStore, walletStore} from '@layerzerolabs/ui-mobx';
import {intersection, sortBy} from 'lodash';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';

import {configStore} from '../stores/configStore';
import {uiStore, WalletTab} from '../stores/uiStore';
import {TransactionItem} from './TransactionItem';
import {UnclaimedTokensPanel} from './UnclaimedTokensPanel';
import {WalletIcon} from './WalletIcon';

export type AccountModalProps = Omit<ModalProps, 'title' | 'children'> & {title?: string};

export const AccountModal = observer(({title = 'Connect Wallet', ...props}: AccountModalProps) => {
  const {...modalProps} = props;
  const theme = useTheme();
  const {evm, aptos} = walletStore;

  // not really src/dst
  const srcWallet = evm;
  const dstWallet = aptos;
  const srcChainType = ChainType.EVM;
  const dstChainType = ChainType.APTOS;

  // actual logic:

  // const srcChainType = srcWallet?.chainId
  //   ? getChainType(srcWallet.chainId)
  //   : dstWallet?.chainId && getChainType(dstWallet.chainId) === ChainType.APTOS
  //   ? ChainType.EVM
  //   : ChainType.APTOS;
  // const dstChainType = dstWallet?.chainId
  //   ? getChainType(dstWallet.chainId)
  //   : srcWallet?.chainId && getChainType(srcWallet.chainId) === ChainType.APTOS
  //   ? ChainType.EVM
  //   : ChainType.APTOS;

  const wallets = sortBy(configStore.wallets, (walletType) =>
    isWalletAvailable(walletType) ? -1 : 1,
  );

  const srcWalletTypes = intersection(wallets, WALLETS_EVM);
  const dstWalletTypes = intersection(wallets, WALLETS_APTOS);

  return (
    <Modal title={title} overlay {...modalProps}>
      <Tabs
        activeTab={uiStore.walletModal.activeTab}
        setActiveTab={(tab) => uiStore.walletModal.setActiveTab(tab as WalletTab)}
        sx={{mx: 2}}
      >
        <Tabs.Tab title={WalletTab.WALLET}>
          <Box sx={{width: '100%'}}>
            <WalletGroup
              isConnected={!!srcWallet}
              onDisconnect={srcWallet?.disconnect}
              // onPasteAccount={setDstAccount}
              heading={
                <Box>
                  <Text variant='p3' color={theme.palette.text.secondary}>
                    {/* Source{' '} */}
                  </Text>
                  <Text variant='p3'>{srcChainType} </Text>
                  <Dot active={!!srcWallet} />
                </Box>
              }
            >
              {srcWalletTypes.map((walletType) => {
                const isConnected = srcWallet?.type === walletType;
                return (
                  (isConnected || !srcWallet) && (
                    <WalletItem key={walletType} walletType={walletType} />
                  )
                );
              })}
            </WalletGroup>
            <WalletGroup
              sx={{mt: 3}}
              onDisconnect={dstWallet?.disconnect}
              isConnected={!!dstWallet}
              // onPasteAccount={setDstAccount}
              heading={
                <Box>
                  <Text variant='p3' color={theme.palette.text.secondary}>
                    {/* Destination{' '} */}
                  </Text>
                  <Text variant='p3'>{dstChainType} </Text>
                  <Dot active={!!dstWallet} />
                </Box>
              }
            >
              {dstWalletTypes.map((walletType) => {
                const isConnected = dstWallet?.type === walletType;
                return (
                  (isConnected || !dstWallet) && (
                    <WalletItem key={walletType} walletType={walletType} />
                  )
                );
              })}
            </WalletGroup>
          </Box>
          <Box sx={{mt: 'auto', pb: 2}}>
            <Text variant='p3' sx={{mr: 0.5}} color='text.secondary'>
              Is this your first time?
            </Text>
            <Text.Link href='/faq' color={theme.palette.primary.main} variant='p3'>
              Learn more
            </Text.Link>
          </Box>
        </Tabs.Tab>
        <Tabs.Tab title={WalletTab.UNCLAIMED}>
          <UnclaimedTokensPanel />
        </Tabs.Tab>
        <Tabs.Tab title={WalletTab.TRANSACTIONS}>
          <Box sx={{width: '100%'}}>
            {transactionStore.recentTransactions.map((tx, index) => (
              <TransactionItem tx={tx} key={tx.txHash ?? index} />
            ))}
          </Box>
        </Tabs.Tab>
      </Tabs>
    </Modal>
  );
});

type WalletGroupProps = {
  heading: React.ReactNode;
  isConnected?: boolean;
  onDisconnect?: () => void;
  onPasteAccount?: (value: string) => void;
  sx?: SxProps;
};

const WalletGroup: React.FC<WalletGroupProps> = ({
  children,
  heading,
  isConnected,
  onDisconnect,
  onPasteAccount,
  sx,
}) => {
  const [isPaste, setIsPaste] = useState(false);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isPaste) inputRef.current?.focus();
  }, [isPaste]);
  return (
    <Box sx={sx}>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        {heading}
        <Box>
          {isConnected ? (
            <Button variant='incognito' onClick={onDisconnect}>
              {/* @ts-ignore */}
              <Text.Link variant='p3' color={theme.palette.text.secondary}>
                Disconnect
                {/* @ts-ignore */}
              </Text.Link>
            </Button>
          ) : onPasteAccount ? (
            <Button variant='incognito' onClick={() => setIsPaste(!isPaste)}>
              <Text variant='p3' color={theme.palette.text.secondary}>
                or{' '}
              </Text>
              {/* @ts-ignore */}
              <Text.Link variant='p3'>{isPaste ? 'Connect Wallet' : 'Paste Account'}</Text.Link>
            </Button>
          ) : null}
        </Box>
      </Box>
      <Box sx={{mt: 1}}>
        <Input
          ref={inputRef}
          // todo: fix typings
          // @ts-ignore
          size='md'
          placeholder='Paste Address'
          endAdornment={<InputStateAdornment type='success' />}
          sx={{height: 56, display: isPaste ? undefined : 'none'}}
        />

        {!isPaste && children}
      </Box>
    </Box>
  );
};

const InputStateAdornment: React.FC<{type?: 'pending' | 'success' | 'error'}> = ({type}) => {
  const theme = useTheme();
  if (!type) {
    return null;
  }
  if (type === 'pending') {
    // @ts-ignore
    return <Icon.Spinner size={16} />;
  }
  if (type === 'success') {
    return <Icon.Checkmark size={16} color={theme.palette.success.main} />;
  }
  if (type === 'error') {
    return <Icon.Info size={16} color={theme.palette.warning.main} />;
  }
  return null;
};

const WalletItem: React.FC<{
  walletType: WalletType;
}> = observer(({walletType}) => {
  const theme = useTheme();
  const wallets = [walletStore.aptos, walletStore.evm];
  const isAvailable = isWalletAvailable(walletType);

  // special case - Brave identifies as metamask
  if (walletType === WalletType.Brave && !isAvailable) return null;
  if (walletType === WalletType.MetaMask && isWalletAvailable(WalletType.Brave)) return null;

  const isConnected = wallets.some((wallet) => wallet?.type === walletType);
  const [isConnecting, setConnecting] = useState(false);
  // todo: don't allow multiple to connect
  const onConnect = async () => {
    if (isConnected || isConnecting) return;
    if (!isAvailable) return getWalletExtension(walletType);
    try {
      setConnecting(true);
      await Promise.resolve(walletStore.connect(walletType));
    } finally {
      if (walletStore.aptos && walletStore.evm) {
        uiStore.walletModal.close();
      }

      setConnecting(false);
    }
  };

  return (
    <Button
      variant='incognito'
      onClick={onConnect}
      sx={{
        height: 56,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        padding: 1.5,
        mb: 1,
      }}
    >
      <WalletIcon type={walletType} />
      <Text variant='p2' sx={{ml: 2}}>
        {isConnecting
          ? 'Connecting...'
          : isConnected
          ? `Connected with ${walletType}`
          : isAvailable
          ? `Connect ${walletType}`
          : `Get ${walletType} Wallet`}
      </Text>
    </Button>
  );
});

const Dot: React.FC<{active?: boolean}> = ({active}) => {
  const theme = useTheme();
  return (
    <Icon.ActiveDot
      inline
      color={active ? theme.palette.success.main : theme.palette.text.secondary}
      size={12}
    />
  );
};
