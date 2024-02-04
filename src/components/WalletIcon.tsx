import {getWalletIcon, WalletType} from '@layerzerolabs/ui-core';
import {Box} from '@layerzerolabs/ui-kit';
import * as React from 'react';

export interface WalletIconProps {
  size?: number;
  type?: WalletType;
}
export const WalletIcon = ({type, size = 26}: WalletIconProps) => {
  return (
    <Box sx={{width: size, minHeight: size, position: 'relative', display: 'inline-block'}}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {type && <img src={getWalletIcon(type)} width={size} alt={type} title={type} />}
    </Box>
  );
};
