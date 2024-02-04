import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from '@mui/system';
import * as SwitchPrimitive from '@radix-ui/react-switch';
const SwitchRoot = styled(SwitchPrimitive.Root)(({ theme }) => ({
    width: 38,
    height: 20,
    borderRadius: 23,
    border: 0,
    padding: 0,
    cursor: 'pointer',
    backgroundColor: theme.palette.divider,
    '&[data-state=checked]': {
        backgroundColor: theme.palette.primary.main,
    },
    '&:hover': {
        backgroundColor: theme.palette.primary.light,
    },
}));
const Thumb = styled(SwitchPrimitive.Thumb)(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: '100%',
    backgroundColor: '#FFF',
    display: 'block',
    transform: 'translateX(2px)',
    transition: 'transform 100ms ease-in',
    '&[data-state=checked]': {
        transform: 'translateX(calc(100% + 4px))',
    },
}));
export const Switch = (props) => {
    return (_jsx(SwitchRoot, Object.assign({}, props, { children: _jsx(Thumb, {}) })));
};
