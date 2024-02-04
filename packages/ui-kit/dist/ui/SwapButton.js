import { jsx as _jsx } from "react/jsx-runtime";
import { styled, keyframes } from '@mui/system';
import { Icon } from './Icon';
const swipeDown = keyframes({
    '20%': {
        transform: 'translateY(0%)',
        opacity: 1,
    },
    '40%': {
        transform: 'translateY(100%)',
        opacity: 0,
    },
    '41%': {
        transform: 'translateY(-100%)',
    },
    '42%': {
        opacity: 1,
    },
    '70%': {
        transform: 'translateY(0%)',
        opacity: 1,
    },
});
const swipeUp = keyframes({
    '20%': {
        transform: 'translateY(0%)',
        opacity: 1,
    },
    '40%': {
        transform: 'translateY(-100%)',
        opacity: 0,
    },
    '41%': {
        transform: 'translateY(100%)',
    },
    '42%': {
        opacity: 1,
    },
    '70%': {
        transform: 'translateY(0%)',
        opacity: 1,
    },
});
const Button = styled('button', { name: 'SwapButton' })(({ theme }) => ({
    height: '88px',
    backgroundColor: 'transparent',
    border: '0',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '&:focus': {
        outline: '0',
        filter: 'brightness(1.5)',
    },
    '&:focus path:first-of-type, &:hover path:first-of-type': {
        animation: `1s ${swipeDown} ease-out`,
    },
    '&:focus path:nth-of-type(2), &:hover path:nth-of-type(2)': {
        animation: `1s ${swipeUp} ease-out`,
    },
}));
export const SwapButton = (props) => {
    const { iconSize = 24 } = props;
    return (_jsx(Button, Object.assign({}, props, { children: _jsx(Icon.Swap, { size: iconSize }) })));
};
