import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrencyAmount, getNetwork, getScanLink, } from '@layerzerolabs/ui-core';
import { getTxProgress, getTxRemainingTime } from '@layerzerolabs/ui-mobx';
import { Box, styled, useTheme } from '@mui/system';
import { observer } from 'mobx-react';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { formatRemainingTime } from '../utils/formatRemainingTime';
const TrackerBox = styled(Box, { name: 'TrackerBox' })(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    minHeight: 60,
    padding: '8px 16px',
    position: 'relative',
    overflow: 'hidden',
}));
const Header = styled('div', { name: 'Header' })(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
const MainInfo = styled('div', { name: 'MainInfo' })(() => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
}));
const Progress = styled('div', { name: 'Progress' })(({ theme, percentage = 0 }) => ({
    position: 'absolute',
    height: 2,
    backgroundColor: theme.palette.primary.main,
    transition: 'all 1s linear',
    width: `${percentage}%`,
    bottom: 0,
    left: 0,
}));
const CloseBtn = styled('button')(() => ({
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    display: 'flex',
    '&:hover': {
        opacity: 0.7,
        cursor: 'pointer',
    },
}));
export const Tracker = observer((props) => {
    var _a, _b, _c;
    const theme = useTheme();
    const { sx, tx, onClose } = props;
    if (!tx) {
        return null;
    }
    const srcChainId = tx.chainId;
    const dstChainId = (_a = tx.input) === null || _a === void 0 ? void 0 : _a.dstChainId;
    const amount = (_b = tx.input) === null || _b === void 0 ? void 0 : _b.amount;
    const srcChain = srcChainId ? getNetwork(srcChainId) : undefined;
    const dstChain = dstChainId ? getNetwork(dstChainId) : undefined;
    const progress = getTxProgress(tx);
    const remaining = getTxRemainingTime(tx);
    const percentage = progress * 100;
    return (_jsxs(TrackerBox, Object.assign({ sx: sx }, { children: [_jsxs(Header, { children: [_jsx("a", Object.assign({ href: srcChainId && tx.txHash ? getScanLink(srcChainId, tx.txHash) : undefined, target: '_blank' }, { children: _jsxs(Box, Object.assign({ sx: { display: 'flex' } }, { children: [_jsx(Icon.Link, { size: 12, color: theme.palette.text.secondary, sx: { mr: '5px' } }), _jsxs(Text, Object.assign({ variant: 'p3', color: theme.palette.text.secondary }, { children: ["\u00A0", srcChain === null || srcChain === void 0 ? void 0 : srcChain.name, "\u00A0"] })), _jsx(Icon.Arrow, { size: 12, color: theme.palette.text.secondary, sx: { transform: 'rotate(-90deg)' } }), _jsxs(Text, Object.assign({ color: theme.palette.text.secondary, variant: 'p3' }, { children: ["\u00A0", dstChain === null || dstChain === void 0 ? void 0 : dstChain.name] }))] })) })), onClose && (_jsx(CloseBtn, Object.assign({ type: 'button', onClick: onClose }, { children: _jsx(Text, Object.assign({ variant: 'p3', color: theme.palette.text.secondary }, { children: "Close" })) })))] }), _jsxs(MainInfo, { children: [_jsxs(Text, Object.assign({ variant: 'p2', bold: true }, { children: [amount ? formatCurrencyAmount(amount) : '-', " ", amount === null || amount === void 0 ? void 0 : amount.currency.symbol] })), (_c = props.status) !== null && _c !== void 0 ? _c : (_jsx(Text, Object.assign({ bold: true, variant: 'p2', color: tx.completed ? 'success.main' : tx.error ? 'warning.main' : 'primary.main', sx: { textTransform: 'capitalize' } }, { children: tx.completed ? 'Complete' : tx.error ? 'Failed' : formatRemainingTime(remaining) })))] }), _jsx(Progress, { percentage: percentage })] })));
});
