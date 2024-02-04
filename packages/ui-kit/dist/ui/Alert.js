var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, keyframes, styled, useTheme } from '@mui/system';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from './Icon';
export var AlertType;
(function (AlertType) {
    AlertType["LOADING"] = "loading";
    AlertType["SUCCESS"] = "success";
    AlertType["ERROR"] = "error";
})(AlertType || (AlertType = {}));
const DialogContent = styled(Dialog.Content, {
    shouldForwardProp: (prop) => prop !== 'shown',
    name: 'Alert',
})(({ theme }) => ({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    padding: '24px 64px',
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius,
    // @ts-ignore
    fontFamily: theme.typography.fontFamily,
    zIndex: 1001,
    [theme.breakpoints.up('md')]: {
        width: 600,
        minHeight: 420,
    },
}));
const DialogOverlay = styled(Dialog.Overlay)((props) => ({
    background: 'rgba(0 0 0 / 0.72)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'grid',
    placeItems: 'center',
    overflowY: 'auto',
    zIndex: 1000,
}));
const rotate = keyframes({
    '0%': {
        transform: 'rotate(0deg)',
    },
    '100%': {
        transform: 'rotate(360deg)',
    },
});
const LoadingIcon = styled('div', { name: 'AlertLoadingIcon' })((_a) => {
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        borderRadius: '100%',
        width: '96px',
        height: '96px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.palette.text.primary,
        borderTopColor: theme.palette.divider,
        animation: `${rotate} 1s ease-out infinite`,
    });
});
const SuccessIcon = styled('div', { name: 'AlertSuccessIcon' })(({ theme }) => ({
    borderRadius: '100%',
    width: '96px',
    height: '96px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.success.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const ErrorIcon = styled('div', { name: 'AlertErrorIcon' })(({ theme }) => ({
    borderRadius: '100%',
    width: '96px',
    height: '96px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const DialogTitle = styled(Dialog.Title, { name: 'AlertTitle' })(({ theme }) => ({
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: '600',
    marginBottom: '16px',
    color: theme.palette.text.primary,
    textAlign: 'center',
}));
const DialogClose = styled(Dialog.Close)((props) => ({
    backgroundColor: 'transparent',
    border: 0,
    position: 'absolute',
    top: 23,
    right: 19,
    cursor: 'pointer',
    paddingRight: 0,
    '&:hover': {
        filter: 'brightness(1.5)',
    },
}));
export const Alert = (props) => {
    const { children, type, title, onClose, image, overlay = true } = props, alertProps = __rest(props, ["children", "type", "title", "onClose", "image", "overlay"]);
    const theme = useTheme();
    return (_jsx(Dialog.Root, Object.assign({ open: alertProps.open, onOpenChange: (isOpen) => !isOpen && (onClose === null || onClose === void 0 ? void 0 : onClose()) }, { children: _jsxs(Dialog.Portal, { children: [overlay && _jsx(DialogOverlay, {}), _jsxs(DialogContent, Object.assign({}, alertProps, { children: [onClose && (_jsx(DialogClose, Object.assign({ asChild: true }, { children: _jsx(Icon.Close, { size: 16 }) }))), _jsxs(Box, Object.assign({ sx: { height: '184px', display: 'flex', alignItems: 'center' } }, { children: [image, type === AlertType.LOADING && _jsx(LoadingIcon, {}), type === AlertType.SUCCESS && (_jsx(SuccessIcon, { children: _jsx(Icon.Checkmark, { size: 16, color: theme.palette.success.main }) })), type === AlertType.ERROR && (_jsx(ErrorIcon, { children: _jsx(Icon.Close, { size: 16, color: theme.palette.error.main }) }))] })), _jsx(DialogTitle, { children: title }), children] }))] }) })));
};
