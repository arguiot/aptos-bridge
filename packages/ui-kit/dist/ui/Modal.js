import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled } from '@mui/system';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from './Icon';
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
}));
const DialogContent = styled(Dialog.Content)((props) => ({
    opacity: 1,
    pointerEvents: 'none',
    backgroundColor: props.theme.palette.background.paper,
    maxWidth: '100%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    paddingTop: 16,
    // transition: opacity 200ms ease-out, transform 100ms ease-out;
    display: 'flex',
    flexDirection: 'column',
    // @ts-ignore
    fontFamily: props.theme.typography.fontFamily,
    borderRadius: props.theme.shape.borderRadius,
    width: '100%',
    height: '100%',
    [props.theme.breakpoints.up('md')]: {
        width: 432,
        height: 584,
    },
}));
const DialogTitle = styled(Dialog.Title)((props) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '400',
    marginRight: 16,
    marginLeft: 16,
    color: props.theme.palette.text.primary,
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
const ScrollContainer = styled('div', { name: 'ScrollContainer' })(({ theme }) => ({
    overflowY: 'scroll',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {
        width: '1px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.text.secondary,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.text.secondary,
    },
}));
const TopAdornment = styled('div', { name: 'ModalTopAdornment' })(({ theme }) => ({
    marginBottom: '32px',
}));
export const Modal = (props) => {
    const { title, open, onClose, children, topAdornment, overlay = true } = props;
    return (_jsx(Dialog.Root, Object.assign({ open: open, onOpenChange: (isOpen) => !isOpen && (onClose === null || onClose === void 0 ? void 0 : onClose()) }, { children: _jsxs(Dialog.Portal, { children: [overlay && _jsx(DialogOverlay, {}), _jsxs(DialogContent, { children: [_jsx(DialogTitle, { children: title }), topAdornment && _jsx(TopAdornment, { children: topAdornment }), _jsx(ScrollContainer, { children: children }), _jsx(DialogClose, Object.assign({ asChild: true }, { children: _jsx(Icon.Close, { size: 16 }) }))] })] }) })));
};
