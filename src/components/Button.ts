import * as React from 'react';
import {styled} from '@mui/system';
import {Button as ButtonBase} from '@layerzerolabs/ui-kit';

export const Button: typeof ButtonBase = styled(ButtonBase)(({variant}) => ({
  ...(variant === 'primary' && {textTransform: 'uppercase'}),
}));
