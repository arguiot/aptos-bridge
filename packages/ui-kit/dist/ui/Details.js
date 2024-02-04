import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled, Box } from '@mui/system';
const Item = styled('div', { name: 'DetailsItem' })(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    '&:not(:last-of-type)': {
        marginBottom: theme.spacing(1),
    },
}));
const Key = styled('div', { name: 'DetailsItemKey' })(({ theme }) => ({
    fontSize: 12,
    lineHeight: 1.3,
    color: theme.palette.text.secondary,
}));
const Value = styled('div', { name: 'DetailsItemKey' })(({ theme }) => ({
    fontSize: 12,
    lineHeight: 1.3,
    color: theme.palette.text.primary,
}));
export const Details = (props) => {
    const { items, sx } = props;
    return (_jsx(Box, Object.assign({ sx: sx }, { children: items.map(({ key, label, value }, index) => (_jsxs(Item, { children: [_jsx(Key, { children: label !== null && label !== void 0 ? label : key }), _jsx(Value, { children: value })] }, key !== null && key !== void 0 ? key : index))) })));
};
