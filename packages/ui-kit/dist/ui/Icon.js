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
import { keyframes, styled, useTheme } from '@mui/system';
import { forwardRef } from 'react';
const rotate = keyframes({
    '0%': {
        transform: 'rotate(0deg)',
    },
    '100%': {
        transform: 'rotate(360deg)',
    },
});
const Svg = styled('svg', {
    shouldForwardProp: (prop) => prop !== 'color' && prop !== 'inline' && prop !== 'spin',
})((props) => {
    var _a;
    return ({
        color: props.color || props.theme.palette.text.primary,
        display: props.inline ? 'inline' : 'block',
        verticalAlign: props.inline ? 'middle' : undefined,
        width: (_a = props.size) !== null && _a !== void 0 ? _a : undefined,
        animation: props.spin ? `1s ${rotate} linear infinite` : undefined,
    });
});
export const Icon = () => {
    return null;
};
Icon.Close = forwardRef((props, ref) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', ref: ref }, props, { children: [_jsx("path", { d: 'M13 3L3 13', stroke: 'currentColor' }), _jsx("path", { d: 'M3 3L13 13', stroke: 'currentColor' })] }))));
Icon.Chevron = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 10 6', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M1 1L5 5L9 1', stroke: 'currentColor', strokeLinejoin: 'round' }) })));
Icon.DefaultToken = (_a) => {
    var { size = 40 } = _a, props = __rest(_a, ["size"]);
    const theme = useTheme();
    return (_jsx(Svg, Object.assign({ width: size, height: size, viewBox: '0 0 40 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("rect", { width: '40', height: '40', rx: '20', fill: theme.palette.divider }) })));
};
Icon.DefaultNetwork = (_a) => {
    var { size = 40 } = _a, props = __rest(_a, ["size"]);
    const theme = useTheme();
    return (_jsx(Svg, Object.assign({ width: size, height: size, viewBox: '0 0 40 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("rect", { width: '40', height: '40', fill: theme.palette.divider }) })));
};
Icon.Checkmark = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M2.75 8L6.25 11.5L13.25 4.5', stroke: 'currentColor', strokeWidth: '1.16667' }) })));
Icon.Swap = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { d: 'M14 3L14 20L19 14.8629', stroke: 'currentColor' }), _jsx("path", { d: 'M10 21L10 4L5 9.13712', stroke: 'currentColor' })] })));
Icon.Search = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("circle", { cx: '7.5', cy: '7.5', r: '6', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }), _jsx("path", { d: 'M12 12L15 15', stroke: 'currentColor', strokeLinejoin: 'round' })] })));
Icon.ActiveDot = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 12 12', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("circle", { opacity: '0.08', cx: '6', cy: '6', r: '6', fill: 'currentColor' }), _jsx("circle", { opacity: '0.08', cx: '6', cy: '6', r: '4', fill: 'currentColor' }), _jsx("circle", { cx: '6', cy: '6', r: '2', fill: 'currentColor' })] })));
Icon.Spinner = styled('div', { name: 'IconSpinner' })((props) => {
    var _a, _b, _c, _d;
    return ({
        borderRadius: '100%',
        width: (_a = props.size) !== null && _a !== void 0 ? _a : 16,
        height: (_b = props.size) !== null && _b !== void 0 ? _b : 16,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: props.theme.palette.secondary.main,
        borderTopColor: (_c = props.color) !== null && _c !== void 0 ? _c : props.theme.palette.text.primary,
        borderRightColor: (_d = props.color) !== null && _d !== void 0 ? _d : props.theme.palette.text.primary,
        animation: `1s ${rotate} linear infinite`,
        display: 'inline-block',
        verticalAlign: props.inline ? 'middle' : undefined,
    });
});
Icon.Success = (props) => {
    const theme = useTheme();
    return (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("circle", { cx: '8', cy: '8', r: '7', fill: theme.palette.success.main }), _jsx("path", { d: 'M3.5 8L6.5 11L12.5 5', stroke: 'black' })] })));
};
Icon.Error = (props) => {
    const theme = useTheme();
    return (_jsxs(Svg, Object.assign({ viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("rect", { x: '1', y: '1', width: '18', height: '18', rx: '9', fill: theme.palette.error.main }), _jsx("path", { d: 'M13.5984 6.40039L6.39844 13.6004', stroke: 'black' }), _jsx("path", { d: 'M6.39844 6.40039L13.5984 13.6004', stroke: 'black' })] })));
};
Icon.Alert = (props) => {
    const theme = useTheme();
    return (_jsxs(Svg, Object.assign({ viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("rect", { x: '1', y: '1', width: '18', height: '18', rx: '9', fill: theme.palette.warning.main }), _jsx("path", { d: 'M10 6.625L10 11.125', stroke: 'black' }), _jsx("path", { d: 'M10 12.25L10 13.375', stroke: 'black' })] })));
};
Icon.Pending = (props) => {
    const theme = useTheme();
    return (_jsxs(Svg, Object.assign({ viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', spin: true }, props, { children: [_jsx("circle", { cx: '10', cy: '10', r: '9', fill: theme.palette.info.main }), _jsx("path", { d: 'M10 15.5C8.9122 15.5 7.84883 15.1774 6.94436 14.5731C6.03989 13.9687 5.33494 13.1098 4.91866 12.1048C4.50238 11.0998 4.39346 9.9939 4.60568 8.927C4.8179 7.86011 5.34172 6.8801 6.11091 6.11091C6.8801 5.34172 7.86011 4.8179 8.927 4.60568C9.9939 4.39346 11.0998 4.50238 12.1048 4.91866C13.1098 5.33494 13.9687 6.03989 14.5731 6.94436C15.1774 7.84883 15.5 8.9122 15.5 10', stroke: 'black' })] })));
};
Icon.Link = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { d: 'M14 2H10M14 2L8 8M14 2V6', stroke: 'currentColor' }), _jsx("path", { d: 'M8 1.99805H2V13.998H14V7.99805', stroke: 'currentColor' })] })));
Icon.BlockchainExplorer = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsxs("g", Object.assign({ clipPath: 'url(#clip0_2335_25686)' }, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M12.1702 3.8283C10.8034 2.46146 8.58727 2.46146 7.22044 3.8283L6.08907 4.95967L5.38196 4.25256L6.51333 3.12119C8.27069 1.36383 11.1199 1.36383 12.8773 3.12119C14.6347 4.87855 14.6347 7.72779 12.8773 9.48515L11.7459 10.6165L11.0388 9.90941L12.1702 8.77804C13.537 7.41121 13.537 5.19513 12.1702 3.8283Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M3.82591 12.1715C5.19274 13.5383 7.40882 13.5383 8.77565 12.1715L9.90703 11.0401L10.6141 11.7472L9.48276 12.8786C7.7254 14.6359 4.87616 14.6359 3.1188 12.8786C1.36144 11.1212 1.36144 8.27196 3.1188 6.51461L4.25017 5.38324L4.95728 6.09034L3.82591 7.22171C2.45907 8.58855 2.45907 10.8046 3.82591 12.1715Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M5.94964 9.34333L9.34375 5.94922L10.0509 6.65633L6.65674 10.0504L5.94964 9.34333Z', fill: 'currentColor' })] })), _jsx("defs", { children: _jsx("clipPath", Object.assign({ id: 'clip0_2335_25686' }, { children: _jsx("rect", { width: '16', height: '16', fill: 'currentColor' }) })) })] })));
Icon.Info = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("circle", { cx: '8', cy: '8', r: '6.5', transform: 'rotate(-180 8 8)', stroke: 'currentColor' }), _jsx("path", { d: 'M8 5L8 9', stroke: 'currentColor' }), _jsx("path", { d: 'M8 10L8 11', stroke: 'currentColor' })] })));
Icon.Hamburger = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsxs("g", Object.assign({ clipPath: 'url(#clip0_3692_127293)' }, { children: [_jsx("rect", { y: '4', width: '20', height: '1', fill: 'currentColor' }), _jsx("rect", { y: '10', width: '20', height: '1', fill: 'currentColor' }), _jsx("rect", { y: '16', width: '20', height: '1', fill: 'currentColor' })] })), _jsx("defs", { children: _jsx("clipPath", Object.assign({ id: 'clip0_3692_127293' }, { children: _jsx("rect", { width: '20', height: '20', fill: 'currentColor' }) })) })] })));
Icon.Globe = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M7.5 8.5V13.903C7.02472 13.7213 6.50776 13.2725 6.03982 12.4536C5.47565 11.4663 5.08036 10.0831 5.01092 8.5H7.5ZM8.5 8.5V13.903C8.97528 13.7213 9.49224 13.2725 9.96018 12.4536C10.5243 11.4663 10.9196 10.0831 10.9891 8.5H8.5ZM10.9891 7.5H8.5V2.09705C8.97528 2.27865 9.49224 2.72748 9.96018 3.54639C10.5243 4.53368 10.9196 5.91691 10.9891 7.5ZM11.99 8.5C11.9093 10.4991 11.349 12.2665 10.5092 13.4517C12.4263 12.5679 13.7978 10.7026 13.9795 8.5H11.99ZM13.9795 7.5H11.99C11.9093 5.50088 11.349 3.73352 10.5092 2.54829C12.4263 3.43211 13.7978 5.29738 13.9795 7.5ZM14.9824 8.5H15V8V7.5H14.9824C14.7377 4.03251 11.9675 1.2623 8.5 1.01758V1H8H7.5V1.01758C4.03251 1.2623 1.2623 4.03251 1.01758 7.5H1V8V8.5H1.01758C1.2623 11.9675 4.03251 14.7377 7.5 14.9824V15H8H8.5V14.9824C11.9675 14.7377 14.7377 11.9675 14.9824 8.5ZM2.02054 8.5C2.20225 10.7026 3.57369 12.5679 5.49077 13.4517C4.65098 12.2665 4.09067 10.4991 4.01005 8.5H2.02054ZM2.02054 7.5H4.01005C4.09067 5.50088 4.65098 3.73353 5.49077 2.54829C3.57369 3.43211 2.20225 5.29738 2.02054 7.5ZM5.01092 7.5C5.08036 5.9169 5.47565 4.53368 6.03982 3.54639C6.50776 2.72748 7.02472 2.27865 7.5 2.09705V7.5H5.01092Z', fill: 'currentColor' }) })));
Icon.Add = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M7.5 8.5V14H8.5V8.5H14V7.5H8.5V2H7.5V7.5H2V8.5H7.5Z', fill: 'currentColor' }) })));
Icon.Arrow = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M7.5 11.7909L4.35554 8.64648L3.64844 9.35359L8.00199 13.7071L12.3555 9.35359L11.6484 8.64648L8.5 11.7949L8.5 2L7.5 2L7.5 11.7909Z', fill: 'currentColor' }) })));
Icon.Calendar = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M5 3V4H6V3H10V4H11V3H13V6H3V3H5ZM3 7V13H13V7H3ZM14 7V14H2V2H5V1H6V2H10V1H11V2H14V6V7Z', fill: 'currentColor' }) })));
Icon.Clock = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M7.5 4H8.5V7.5H11V8.5H7.5V4Z', fill: 'currentColor' })] })));
Icon.Copy = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10.2992 2H2.69922V11.2H4.69922V4.00195H10.2992V2ZM11.2992 4.00195H14.2992V15.202H4.69922V12.2H2.69922H1.69922V11.2V2V1H2.69922H10.2992H11.2992V2V4.00195ZM5.69922 5.00195H13.2992V14.202H5.69922V5.00195Z', fill: 'currentColor' }) })));
Icon.Doc = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M6.5 10.5L6.5 14L13 14L13 2L3 2L3 10.5L6.5 10.5ZM2 11L2 0.999999L14 1L14 15L6 15L2 11ZM5.5 13.0858L3.91421 11.5L5.5 11.5L5.5 13.0858Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M9 4H4V3H9V4ZM12 6H4V5H12V6Z', fill: 'currentColor' })] })));
Icon.Doc2 = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M3 14H13V5.41421L9.58579 2H3V14ZM10 1H2V15H14V5L10 1Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M9 11H4V10H9V11Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M12 13H4V12H12V13Z', fill: 'currentColor' })] })));
Icon.Doc3 = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M12 14H2V2H12V8V14ZM12 15H1V1H13V8H15V15H13H12ZM13 14H14V9H13V14ZM11 5H3V4H11V5ZM3 7H8V6H3V7Z', fill: 'currentColor' }) })));
Icon.Download = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10.6484 7.64648L8.5 9.79485L8.5 1H7.5L7.5 9.79101L5.35547 7.64648L4.64836 8.35359L8.00192 11.7071L11.3555 8.35359L10.6484 7.64648ZM3 15L13 15V14L3 14V15Z', fill: 'currentColor' }) })));
Icon.Expand = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M2 13V9H3V12.3651L12.3651 3H9V2H13H14V3V7H13L13 3.77929L3.7793 13H7V14H3H2V13Z', fill: 'currentColor' }) })));
Icon.Gas = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10 2H2V6L10 6V2ZM2 14L2 7L10 7V14H2ZM1 1V15H11V8.99995H12V14.9999H15V3.69093L12.7236 2.55273L12.2764 3.44716L14 4.30896V13.9999H13V7.99995H11V1H1Z', fill: 'currentColor' }) })));
Icon.Help = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z', fill: 'currentColor' }), _jsx("path", { d: 'M7.42442 9.73504H8.39244C8.39244 9.59516 8.39593 9.47142 8.40291 9.36382C8.40988 9.25263 8.42733 9.14862 8.45523 9.05178C8.48314 8.95494 8.525 8.8599 8.58081 8.76664C8.64012 8.67339 8.72209 8.57476 8.82674 8.47075C8.9907 8.32011 9.1564 8.15692 9.32384 7.98117C9.49477 7.80542 9.64826 7.61533 9.7843 7.41089C9.92035 7.21004 10.032 6.99664 10.1192 6.77068C10.2064 6.54113 10.25 6.29724 10.25 6.039C10.25 5.71621 10.1994 5.42928 10.0983 5.17821C9.99709 4.92715 9.85058 4.71374 9.65872 4.538C9.46686 4.36225 9.2314 4.22954 8.95233 4.13988C8.67674 4.04663 8.36279 4 8.01047 4C7.69302 4 7.39651 4.04483 7.12093 4.1345C6.84884 4.22058 6.61337 4.34611 6.41453 4.5111C6.21221 4.67967 6.05174 4.88411 5.93314 5.12441C5.81453 5.36472 5.75349 5.63551 5.75 5.93679H6.71802C6.71802 5.75028 6.75465 5.59067 6.82791 5.45797C6.90116 5.32168 6.99884 5.2087 7.12093 5.11903C7.23953 5.03295 7.37558 4.97019 7.52907 4.93073C7.68605 4.88769 7.84651 4.86617 8.01047 4.86617C8.22326 4.86617 8.41163 4.89487 8.57558 4.95225C8.73953 5.00964 8.87558 5.09393 8.98372 5.20511C9.0814 5.30554 9.15465 5.42928 9.20349 5.57633C9.25581 5.71979 9.28198 5.88478 9.28198 6.07128C9.28198 6.25062 9.24884 6.42098 9.18256 6.58238C9.11628 6.74378 9.03256 6.89621 8.9314 7.03968C8.82674 7.18673 8.71163 7.32661 8.58605 7.45931C8.46395 7.59202 8.3436 7.72114 8.225 7.84667C8.05058 8.01166 7.91105 8.15512 7.8064 8.27707C7.70174 8.39543 7.62151 8.51917 7.5657 8.64829C7.50988 8.78099 7.47326 8.93163 7.45581 9.1002C7.43837 9.26519 7.42791 9.4768 7.42442 9.73504ZM7.31453 11.419C7.31453 11.584 7.36337 11.722 7.46105 11.8332C7.56221 11.9444 7.71221 12 7.91105 12C8.10988 12 8.25988 11.9444 8.36105 11.8332C8.4657 11.722 8.51802 11.584 8.51802 11.419C8.51802 11.2468 8.4657 11.1033 8.36105 10.9886C8.25988 10.8738 8.10988 10.8164 7.91105 10.8164C7.71221 10.8164 7.56221 10.8738 7.46105 10.9886C7.36337 11.1033 7.31453 11.2468 7.31453 11.419Z', fill: 'currentColor' })] })));
Icon.Info = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8.5 7V11H7.5V7H8.5Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8.5 5V6H7.5V5H8.5Z', fill: 'currentColor' })] })));
Icon.Info2 = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M7.83333 2C4.61333 2 2 4.61333 2 7.83333C2 11.0533 4.61333 13.6667 7.83333 13.6667C11.0533 13.6667 13.6667 11.0533 13.6667 7.83333C13.6667 4.61333 11.0533 2 7.83333 2ZM8.41667 11.9167H7.25V10.75H8.41667V11.9167ZM9.62417 7.39583L9.09917 7.9325C8.8075 8.23 8.5975 8.49833 8.4925 8.91833C8.44583 9.105 8.41667 9.315 8.41667 9.58333H7.25V9.29167C7.25 9.02333 7.29667 8.76667 7.37833 8.5275C7.495 8.18917 7.6875 7.88583 7.9325 7.64083L8.65583 6.90583C8.92417 6.64917 9.0525 6.26417 8.97667 5.85583C8.90083 5.43583 8.57417 5.08 8.16583 4.96333C7.51833 4.7825 6.9175 5.15 6.725 5.70417C6.655 5.92 6.47417 6.08333 6.24667 6.08333H6.07167C5.73333 6.08333 5.5 5.75667 5.59333 5.43C5.84417 4.5725 6.57333 3.91917 7.4775 3.77917C8.36417 3.63917 9.21 4.1 9.735 4.82917C10.4233 5.78 10.2192 6.80083 9.62417 7.39583Z', fill: 'currentColor' }) })));
Icon.List = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M1 4H2V3H1V4ZM4 4H15V3H4V4ZM15 9H4V8H15V9ZM1 9H2V8H1V9ZM15 14H4V13H15V14ZM1 14H2V13H1V14Z', fill: 'currentColor' }) })));
Icon.Person = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M10 5C10 6.10454 9.10454 7 8 7C6.89544 7 6 6.10455 6 5C6 3.89543 6.89543 3 8 3C9.10455 3 10 3.89544 10 5ZM8 8C9.65683 8 11 6.65683 11 5C11 3.34314 9.65683 2 8 2C6.34314 2 5 3.34314 5 5C5 6.65683 6.34314 8 8 8ZM6.08658 9.3806C6.69321 9.12933 7.34339 9 8 9C8.65661 9 9.30679 9.12933 9.91342 9.3806C10.52 9.63188 11.0712 10.0002 11.5355 10.4645C11.9998 10.9288 12.3681 11.48 12.6194 12.0866C12.8707 12.6932 13 13.3434 13 14H14C14 13.2121 13.8448 12.4319 13.5433 11.7039C13.2417 10.9759 12.7998 10.3145 12.2426 9.75736C11.6855 9.20021 11.0241 8.75825 10.2961 8.45672C9.56815 8.15519 8.78793 8 8 8C7.21207 8 6.43185 8.15519 5.7039 8.45672C4.97595 8.75825 4.31451 9.20021 3.75736 9.75736C3.20021 10.3145 2.75825 10.9759 2.45672 11.7039C2.15519 12.4319 2 13.2121 2 14H3C3 13.3434 3.12933 12.6932 3.3806 12.0866C3.63188 11.48 4.00017 10.9288 4.46447 10.4645C4.92876 10.0002 5.47995 9.63188 6.08658 9.3806Z', fill: 'currentColor' }) })));
Icon.Reset = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M11.3532 12.9755C10.1438 13.7906 8.67897 14.1372 7.23256 13.9507C5.78616 13.7642 4.45721 13.0572 3.49419 11.962C2.53116 10.8668 1.99999 9.45836 1.99999 7.99998H0.999991C0.999991 9.70143 1.61969 11.3446 2.74322 12.6224C3.86675 13.9001 5.41719 14.7249 7.10466 14.9425C8.79213 15.1601 10.5011 14.7557 11.912 13.8048C13.323 12.8539 14.3393 11.4217 14.771 9.77594C15.2026 8.13016 15.0201 6.38351 14.2575 4.86254C13.4949 3.34156 12.2044 2.15041 10.6274 1.51178C9.05035 0.873157 7.2947 0.83078 5.68868 1.39258C4.42375 1.83506 3.31986 2.62847 2.5 3.66982V2H1.5V5.5H5V4.5H3.12657C3.84243 3.50318 4.85051 2.74519 6.01886 2.33649C7.39545 1.85495 8.9003 1.89127 10.2521 2.43867C11.6038 2.98606 12.7099 4.00705 13.3636 5.31074C14.0172 6.61443 14.1737 8.11157 13.8037 9.52223C13.4337 10.9329 12.5625 12.1605 11.3532 12.9755Z', fill: 'currentColor' }) })));
Icon.Settings = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M12.8374 5.6132L12.6489 6.07285L13.1073 6.26432L14.4998 6.8459L14.4982 9.1493L13.1078 9.72834L12.6485 9.91964L12.8375 10.3799L13.41 11.7737L11.7798 13.4052L10.3937 12.8373L9.9342 12.6491L9.74281 13.1073L9.16113 14.5H6.85314L6.27146 13.1073L6.07989 12.6487L5.62011 12.8375L4.22642 13.41L2.59245 11.7767L3.16257 10.3868L3.35112 9.92715L2.89268 9.73567L1.50023 9.15409L1.50184 6.8507L2.89221 6.27165L3.35153 6.08036L3.16248 5.62011L2.59001 4.22641L4.22333 2.59245L5.6132 3.16257L6.07285 3.35112L6.26433 2.89268L6.84591 1.50023L9.1493 1.50179L9.72835 2.8922L9.91964 3.35153L10.3799 3.16248L11.7736 2.59001L13.4076 4.22333L12.8374 5.6132ZM6.92961 9.60196C7.24645 9.81366 7.61895 9.92665 8 9.92665C8.51098 9.92665 9.00103 9.72367 9.36235 9.36235C9.72367 9.00103 9.92666 8.51098 9.92666 8C9.92666 7.61894 9.81366 7.24644 9.60196 6.92961C9.39025 6.61277 9.08936 6.36583 8.7373 6.22C8.38525 6.07418 7.99787 6.03602 7.62413 6.11036C7.2504 6.18471 6.9071 6.3682 6.63765 6.63765C6.3682 6.9071 6.18471 7.25039 6.11037 7.62413C6.03603 7.99786 6.07418 8.38525 6.22001 8.7373C6.36583 9.08935 6.61277 9.39025 6.92961 9.60196Z', stroke: 'currentColor' }) })));
Icon.Star = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M8 1.0183L10.1037 4.75055L10.216 4.94991L10.4403 4.99517L14.64 5.84253L11.7405 8.99656L11.5856 9.16503L11.6119 9.39236L12.1037 13.6483L8.20808 11.8654L8 11.7701L7.79192 11.8654L3.89626 13.6483L4.38813 9.39236L4.4144 9.16503L4.25953 8.99656L1.36 5.84253L5.55966 4.99517L5.78398 4.94991L5.89634 4.75055L8 1.0183Z', stroke: 'currentColor' }) })));
Icon.StarFilled = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { d: 'M8 0L10.5392 4.50505L15.6085 5.52786L12.1086 9.33495L12.7023 14.4721L8 12.32L3.29772 14.4721L3.89144 9.33495L0.391548 5.52786L5.46077 4.50505L8 0Z', fill: 'currentColor' }) })));
Icon.Stopwatch = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M8 1H11V0H5V1H8ZM8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8.5 6V10H7.5V6H8.5Z', fill: 'currentColor' }) })));
Icon.Sync = (props) => (_jsxs(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: [_jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M12.4698 3.99621C13.3161 4.94078 13.8413 6.12921 13.97 7.39087L14.9648 7.28936C14.8147 5.81742 14.2019 4.43092 13.2146 3.32892C12.2273 2.22692 10.9162 1.4661 9.46957 1.15569C8.02291 0.845284 6.5151 1.00125 5.16261 1.6012C4.11511 2.06585 3.2025 2.77833 2.5 3.67104L2.5 2H1.5L1.5 5.5H5V4.5H3.12753C3.74798 3.63604 4.58934 2.94946 5.5681 2.5153C6.72738 2.00106 8.01978 1.86737 9.25977 2.13344C10.4998 2.39951 11.6236 3.05164 12.4698 3.99621Z', fill: 'currentColor' }), _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M3.53018 12.0038C2.68392 11.0592 2.15872 9.87079 2.02999 8.60913L1.03516 8.71064C1.18534 10.1826 1.79807 11.5691 2.78538 12.6711C3.77268 13.7731 5.08377 14.5339 6.53043 14.8443C7.97709 15.1547 9.4849 14.9988 10.8374 14.3988C11.8849 13.9341 12.7975 13.2217 13.5 12.329V14H14.5V10.5H11V11.5H12.8725C12.252 12.364 11.4107 13.0505 10.4319 13.4847C9.27262 13.9989 7.98022 14.1326 6.74023 13.8666C5.50023 13.6005 4.37644 12.9484 3.53018 12.0038Z', fill: 'currentColor' })] })));
Icon.Unsupported = (props) => (_jsx(Svg, Object.assign({ viewBox: '0 0 16 16', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, props, { children: _jsx("path", { fillRule: 'evenodd', clipRule: 'evenodd', d: 'M14 8C14 11.3137 11.3137 14 8 14C6.52267 14 5.17004 13.4661 4.12456 12.5807L12.5807 4.12456C13.4661 5.17004 14 6.52267 14 8ZM3.41761 11.8734L11.8734 3.41761C10.8282 2.53323 9.47637 2 8 2C4.68629 2 2 4.68629 2 8C2 9.47637 2.53323 10.8282 3.41761 11.8734ZM15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z', fill: 'currentColor' }) })));