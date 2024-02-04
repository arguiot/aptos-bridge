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
import { styled, useTheme } from '@mui/system';
import { Button } from './Button';
import { Icon } from './Icon';
const SelectButtonRoot = styled(Button, {
    name: 'SelectButtonRoot',
    label: 'SelectButtonRoot',
    shouldForwardProp: (prop) => prop !== 'readonly',
})((props) => (Object.assign({ cursor: props.onClick ? 'pointer' : 'initial', height: '72px', minWidth: '136px', display: 'flex', position: 'relative', width: '100%', padding: '16px', textAlign: 'left' }, (props.readonly && {
    '&:hover:not(:disabled)': {
        backgroundColor: props.theme.palette.secondary.main,
    },
    '&:focus': {
        backgroundColor: props.theme.palette.secondary.main,
    },
}))));
const Title = styled('div', { name: 'SelectButtonTitle' })(({ theme }) => ({
    fontSize: '12px',
    color: theme.palette.text.secondary,
}));
const Value = styled('div', {
    name: 'SelectButtonValue',
    shouldForwardProp: (prop) => prop !== 'withIcon' && prop !== 'readonly',
})((_a) => {
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        color: props.readonly ? theme.palette.text.secondary : theme.palette.text.primary,
        alignItems: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        fontWeight: '500',
        maxWidth: props.withIcon ? '60%' : '95%',
        '& > svg': {
            marginLeft: '8px',
        },
    });
});
const ValueLine = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
        marginLeft: '8px',
        minWidth: '10px',
    },
}));
const SelectButtonIcon = styled('div', { name: 'SelectButtonIcon' })(({ theme }) => ({
    marginRight: '16px',
    minWidth: 40,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
}));
const ContentWrapper = styled('div')(() => ({
    width: '100%',
}));
const ConnectedIcon = styled('div')(() => ({
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 8,
    marginRight: 8,
}));
export const SelectButton = (_a) => {
    var { chevron = true, connected, readonly = false, icon, title, value } = _a, btnProps = __rest(_a, ["chevron", "connected", "readonly", "icon", "title", "value"]);
    const theme = useTheme();
    return (_jsxs(SelectButtonRoot, Object.assign({}, btnProps, { readonly: readonly }, { children: [icon && _jsx(SelectButtonIcon, { children: icon }), _jsxs(ContentWrapper, { children: [_jsx(Title, { children: title }), _jsxs(ValueLine, { children: [_jsx(Value, Object.assign({ withIcon: !!icon, readonly: readonly }, { children: value || 'Select' })), chevron && _jsx(Icon.Chevron, { size: 10 })] })] }), connected && (_jsx(ConnectedIcon, { children: _jsx(Icon.ActiveDot, { color: theme.palette.success.main, size: 12 }) }))] })));
};
