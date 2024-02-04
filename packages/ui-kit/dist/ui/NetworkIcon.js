import { jsx as _jsx } from "react/jsx-runtime";
import { getNetworkIcon } from '@layerzerolabs/ui-core';
import { styled } from '@mui/system';
import { Icon } from './Icon';
const Image = styled('img')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
}));
export const NetworkIcon = (props) => {
    if (!props.chainId) {
        return _jsx(Icon.DefaultNetwork, { size: props.size });
    }
    return _jsx(Image, { src: getNetworkIcon(props.chainId), width: props.size, height: props.size });
};
