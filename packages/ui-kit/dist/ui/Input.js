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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { styled } from '@mui/system';
import { forwardRef } from 'react';
var HEIGHT;
(function (HEIGHT) {
    HEIGHT[HEIGHT["md"] = 40] = "md";
    HEIGHT[HEIGHT["lg"] = 68] = "lg";
})(HEIGHT || (HEIGHT = {}));
var FONT_SIZE;
(function (FONT_SIZE) {
    FONT_SIZE[FONT_SIZE["md"] = 14] = "md";
    FONT_SIZE[FONT_SIZE["lg"] = 24] = "lg";
})(FONT_SIZE || (FONT_SIZE = {}));
var ADORNMENT_PADDING;
(function (ADORNMENT_PADDING) {
    ADORNMENT_PADDING[ADORNMENT_PADDING["md"] = 8] = "md";
    ADORNMENT_PADDING[ADORNMENT_PADDING["lg"] = 16] = "lg";
})(ADORNMENT_PADDING || (ADORNMENT_PADDING = {}));
const InputWrapper = styled('div', {
    name: 'InputWrapper',
    label: 'InputWrapper',
    shouldForwardProp: (props) => props !== 'size' && props !== 'sx',
})((_a) => {
    var _b, _c, _d;
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        height: HEIGHT[(_b = props.size) !== null && _b !== void 0 ? _b : 'md'],
        paddingLeft: ADORNMENT_PADDING[(_c = props.size) !== null && _c !== void 0 ? _c : 'md'],
        paddingRight: ADORNMENT_PADDING[(_d = props.size) !== null && _d !== void 0 ? _d : 'md'],
        width: '100%',
        '&:hover': {
        // filter: 'brightness(1.1)',
        },
        '&:focus-within': {
        // filter: 'brightness(1.2)',
        },
    });
});
const InputBase = styled('input', {
    shouldForwardProp: (props) => props !== 'size' && props !== 'startAdornment' && props !== 'endAdornment',
    name: 'Input',
})((props) => {
    var _a;
    return ({
        backgroundColor: 'transparent',
        color: props.theme.palette.text.primary,
        fontSize: FONT_SIZE[(_a = props.size) !== null && _a !== void 0 ? _a : 'md'],
        border: 0,
        width: 0,
        flexBasis: 0,
        flexGrow: 1,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '&:focus': {
            outline: 0,
        },
        '&::-webkit-input-placeholder': {
            color: props.theme.palette.text.primary,
            opacity: 0.24,
        },
    });
});
const StartAdornment = styled('div', { name: 'InputStartAdornment' })(({ size = 'md' }) => ({
    marginRight: ADORNMENT_PADDING[size],
}));
const EndAdornment = styled('div', { name: 'InputEndAdornment' })(({ size = 'md' }) => ({
    marginLeft: ADORNMENT_PADDING[size],
    display: 'flex',
}));
const Error = styled('div', { name: 'InputError' })(({ theme }) => ({
    fontSize: 12,
    lineHeight: '16px',
    color: theme.palette.error.main,
    textAlign: 'right',
    width: '100%',
    marginTop: 4,
}));
export const Input = forwardRef((props, ref) => {
    const { endAdornment, startAdornment, size, sx, error } = props, inputProps = __rest(props, ["endAdornment", "startAdornment", "size", "sx", "error"]);
    return (_jsxs(_Fragment, { children: [_jsxs(InputWrapper, Object.assign({ sx: sx, size: size }, { children: [startAdornment && _jsx(StartAdornment, Object.assign({ size: size }, { children: startAdornment })), _jsx(InputBase, Object.assign({ type: 'text', ref: ref, startAdornment: startAdornment, endAdornment: endAdornment, 
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        size: size }, inputProps)), endAdornment && _jsx(EndAdornment, Object.assign({ size: size }, { children: endAdornment }))] })), error && _jsx(Error, { children: error })] }));
});
const SInputAdornment = styled('div', { name: 'InputAdornment' })(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
}));
export const InputAdornment = (props) => {
    return _jsx(SInputAdornment, { children: props.children });
};
