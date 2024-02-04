import {WalletType} from '@layerzerolabs/ui-core';
import {Box, formatAddress, Text, useTheme} from '@layerzerolabs/ui-kit';
import * as React from 'react';

import {WalletIcon} from './WalletIcon';

export interface WalletDecorationProps {
  address?: string;
  type?: WalletType;
  onClick: () => void;
}

export const WalletDecoration = (props: WalletDecorationProps) => {
  const {address, type} = props;
  const theme = useTheme();

  return (
    <Box
      sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', zIndex: 5}}
      onClick={props.onClick}
    >
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          width: '16px',
          height: '16px',
          display: 'inline-block',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        >
          <WalletIcon type={type} size={10} />
        </Box>
      </Box>
      {/* @ts-ignore */}
      <Text.Link variant='p3' color={theme.palette.text.secondary} sx={{ml: 1}}>
        {address && formatAddress(address, 9)}
        {/* @ts-ignore */}
      </Text.Link>
    </Box>
  );
};
