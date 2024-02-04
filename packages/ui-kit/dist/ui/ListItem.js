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
import { styled } from '@mui/system';
const Item = styled('button', { name: 'ListItem' })(({ theme, disabled, overlay }) => (Object.assign(Object.assign(Object.assign({ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'stretch', fontSize: '14px', backgroundColor: 'transparent', border: '0', color: theme.palette.text.primary, width: '100%', padding: '10px 16px', '&:hover': {
        backgroundColor: theme.palette.secondary.light,
    }, '&:focus': {
        backgroundColor: theme.palette.secondary.light,
        outline: 0,
    } }, (disabled ? { opacity: 0.5, cursor: 'initial' } : { cursor: 'pointer' })), { '&:not(:hover) > [class*=ListItemOverlay]': {
        display: 'none',
    } }), (overlay && {
    '&:hover > [class*=ListItemRight]': {
        display: 'none',
    },
}))));
const Left = styled('div', { name: 'ListItemLeft' })(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'space-between',
}));
const Right = styled('div', { name: 'ListItemRight', label: 'ListItemRight' })(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
}));
const Center = styled('div', { name: 'ListItemCenter' })(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'space-between',
}));
const Label = styled('div', { name: 'ListItemLabel' })(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '12px',
    whiteSpace: 'nowrap',
}));
const Value = styled('div', { name: 'ListItemValue' })(({ theme }) => ({
    fontWeight: '400',
    letterSpacing: '-0.02em',
    lineHeight: '20px',
}));
const Start = styled('div', { name: 'ListItemStart' })({
    width: 32,
    height: 32,
    marginRight: 12,
    alignSelf: 'center',
});
const End = styled('div', { name: 'ListItemEnd' })({
    marginLeft: 12,
    alignSelf: 'center',
});
const Overlay = styled('div', { name: 'ListItemOverlay', label: 'ListItemOverlay' })({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 12,
    fontSize: 12,
});
export const ListItem = (props) => {
    const { bottomCenter, bottomLeft, bottomRight, endAdornment, onClick, startAdornment, topCenter, topLeft, topRight, overlay } = props, commonProps = __rest(props, ["bottomCenter", "bottomLeft", "bottomRight", "endAdornment", "onClick", "startAdornment", "topCenter", "topLeft", "topRight", "overlay"]);
    return (_jsxs(Item, Object.assign({ onClick: onClick, overlay: overlay }, commonProps, { children: [startAdornment && _jsx(Start, { children: startAdornment }), _jsxs(Left, { children: [_jsx(Label, { children: topLeft }), _jsx(Value, { children: bottomLeft })] }), _jsxs(Center, { children: [_jsx(Label, { children: topCenter }), _jsx(Value, { children: bottomCenter })] }), _jsxs(Right, { children: [_jsx(Label, { children: topRight }), _jsx(Value, { children: bottomRight })] }), endAdornment && _jsx(End, { children: endAdornment }), overlay && _jsx(Overlay, { children: overlay })] })));
};
