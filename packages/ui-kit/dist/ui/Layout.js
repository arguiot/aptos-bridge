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
import { jsxs as _jsxs } from "react/jsx-runtime";
import { styled } from '@mui/system';
const LayoutRoot = styled('div', { name: 'Layout' })(({ theme }) => ({
    minHeight: '100vh',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    overflow: 'auto',
    // @ts-ignore
    fontFamily: theme.typography.fontFamily,
}));
const Main = styled('main', { name: 'LayoutMain', shouldForwardProp: (prop) => prop !== 'centered' })((_a) => {
    var props = __rest(_a, []);
    return ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: props.centered ? 'center' : 'flex-start',
        justifyContent: props.centered ? 'center' : 'flex-start',
        flex: 1,
        position: 'relative',
    });
});
export const Layout = (props) => {
    const { children, centered, header, footer, mainBackground } = props;
    return (_jsxs(LayoutRoot, { children: [header, _jsxs(Main, Object.assign({ centered: centered }, { children: [mainBackground, children] })), footer] }));
};
export const MobileOnly = styled('div')((_a) => {
    var _b;
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        display: (_b = props.display) !== null && _b !== void 0 ? _b : 'block',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    });
});
export const DesktopOnly = styled('div')((_a) => {
    var _b;
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: (_b = props.display) !== null && _b !== void 0 ? _b : 'block',
        },
    });
});
