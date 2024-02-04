import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { GlobalStyles, keyframes, styled, useTheme } from '@mui/system';
import { observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';
import { Button } from './Button';
import { Icon } from './Icon';
const TOAST_Z_INDEX = 100;
const TOAST_DELAY = 7000;
function createProgressAnimation(theme) {
    const animation = {};
    for (let i = 0; i <= 1; i += 0.01) {
        const key = `${i * 100}%`;
        animation[key] = {
            background: `conic-gradient(${theme.palette.text.primary} ${i * 360}deg, ${theme.palette.divider} 0deg)`,
        };
    }
    return animation;
}
const progress = (theme) => keyframes(createProgressAnimation(theme));
const toastTheme = (_jsx(GlobalStyles, { styles: (theme) => ({
        ':root': {
            '--toastify-z-index': TOAST_Z_INDEX,
            '--toastify-color-progress-light': theme.palette.text.primary,
        },
        '.Toastify .Toastify__toast': {
            backgroundColor: theme.palette.background.default,
            minHeight: 72,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            paddingRight: 50,
            boxShadow: 'none',
        },
        '.Toastify .Toastify__progress-bar': {
            right: 0,
            left: 'auto',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 18,
            width: 32,
            height: 32,
            borderRadius: '100%',
            animationName: progress(theme),
            '&::after': {
                content: '""',
                background: theme.palette.background.default,
                borderRadius: '100%',
                width: 30,
                height: 30,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%',
            },
        },
        '.Toastify .Toastify__toast-container h1': {
            letterSpacing: '-0.02em',
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: '600',
            color: theme.palette.text.primary,
            // @ts-ignore
            fontFamily: theme.typography.fontFamily,
        },
        '.Toastify .Toastify__toast-container p': {
            color: theme.palette.text.secondary,
            fontWeight: '400',
            fontSize: '12px',
            lineHeight: '16px',
            marginTop: '4px',
            lineBreak: 'anywhere',
        },
        '.Toastify .Toastify__toast-container a': {
            textDecoration: 'underline',
        },
        '.Toastify .Toastify__toast-icon': {
            marginBottom: 'auto',
            marginTop: 2,
        },
        '.Toastify .Toastify__toast-container': {
            width: 432,
            maxWidth: '100%',
            marginTop: 70,
        },
    }) }));
const Container = styled('div', {
    name: 'ToastContainer',
})({
    display: 'flex',
    '& > svg': {
        marginRight: '12px',
    },
});
export const Toast = observer(({ children }) => {
    return (_jsx(Container, { children: _jsx("div", { children: children }) }));
});
export const ToastProvider = ({ children }) => {
    return (_jsxs(_Fragment, { children: [children, toastTheme, _jsx(ToastContainer, { autoClose: TOAST_DELAY, closeButton: CloseButton, closeOnClick: false, pauseOnHover: true, pauseOnFocusLoss: true })] }));
};
const SCloseIcon = styled('div', { name: 'CloseButton' })(() => ({
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translate(-50%, -50%)',
    marginRight: 18,
}));
const CloseButton = ({ closeToast, ariaLabel }) => {
    const theme = useTheme();
    return (_jsx(Button, Object.assign({ variant: 'incognito', "aria-label": ariaLabel, sx: {
            position: 'absolute',
            right: 0,
            top: 0,
            width: '54px',
            height: '100%',
            zIndex: TOAST_Z_INDEX + 10,
        }, onClick: (event) => {
            closeToast(event);
        } }, { children: _jsx(SCloseIcon, { children: _jsx(Icon.Close, { size: 16, color: theme.palette.text.primary }) }) })));
};
