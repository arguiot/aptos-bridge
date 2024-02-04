import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, styled } from '@mui/system';
import { usePagination } from '../hooks/usePagination';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { Tracker } from './Tracker';
const Row = styled('div')(() => ({
    display: 'flex',
    overflowX: 'hidden',
}));
const Header = styled('div')(() => ({
    marginBottom: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
}));
export const TrackerCarousel = (props) => {
    const { txs, sx, title = 'Transactions' } = props;
    if (!txs || txs.length === 0) {
        return null;
    }
    const pagination = usePagination(txs, 1);
    return (_jsxs(Box, Object.assign({ sx: sx }, { children: [_jsxs(Header, { children: [_jsx(Text, Object.assign({ variant: 'p3', color: 'text.secondary' }, { children: title })), _jsx(Box, Object.assign({ sx: { display: 'flex' } }, { children: pagination.totalPagesCount > 1 && (_jsxs(_Fragment, { children: [_jsx(Button, Object.assign({ variant: 'incognito', onClick: pagination.onPrevPage, sx: { mr: 1 } }, { children: _jsx(Icon.Chevron, { size: 12, sx: { transform: 'rotate(90deg)' } }) })), _jsx(Text, Object.assign({ variant: 'p3' }, { children: pagination.currentPage })), _jsxs(Text, Object.assign({ variant: 'p3', color: 'text.secondary' }, { children: ["/", pagination.totalPagesCount] })), _jsx(Button, Object.assign({ variant: 'incognito', onClick: pagination.onNextPage, sx: { ml: 1 } }, { children: _jsx(Icon.Chevron, { size: 12, sx: { transform: 'rotate(-90deg)' } }) }))] })) }))] }), _jsx(Row, { children: pagination.currentPageItems.map((tx) => props.renderTracker ? (props.renderTracker(tx)) : (_jsx(Tracker, { tx: tx, sx: { minWidth: '100%' } }, tx.txHash))) })] })));
};
