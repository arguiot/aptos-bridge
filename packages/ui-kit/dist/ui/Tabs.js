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
import * as React from 'react';
import { styled, Box } from '@mui/system';
const STabs = styled(Box, { name: 'Tabs' })(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));
const STabsBar = styled('div', { name: 'TabsBar' })(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: 24,
    position: 'relative',
}));
const STab = styled('button', { name: 'Tab', shouldForwardProp: (props) => props !== 'active' })((_a) => {
    var { theme } = _a, props = __rest(_a, ["theme"]);
    return ({
        border: 0,
        backgroundColor: 'transparent',
        outline: 'none',
        cursor: 'pointer',
        paddingBottom: 16,
        color: props.active ? theme.palette.text.primary : theme.palette.text.secondary,
        paddingLeft: 0,
        paddingRight: 0,
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '-0.02em',
        textAlign: 'left',
        marginRight: 12,
        borderBottom: props.active ? `1px solid ${theme.palette.text.primary}` : '1px solid transparent',
        '&:only-child': {
            borderBottom: '1px solid transparent',
        },
        '&:hover': {
            color: theme.palette.text.primary,
        },
        '&:not(:first-of-type)': {
            marginLeft: 12,
        },
    });
});
const TabContent = styled('div', { name: 'TabContent' })(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}));
export const Tabs = (props) => {
    const { children, activeTab, setActiveTab, sx } = props;
    const childrenArray = React.Children.toArray(children);
    const activeChild = childrenArray.find((child) => child.props.title === activeTab);
    const activeIdx = childrenArray.indexOf(activeChild);
    const styles = {};
    return (_jsxs(STabs, Object.assign({ sx: sx }, { children: [_jsx(STabsBar, { children: React.Children.map(childrenArray, ({ props: { title } }) => (_jsx(STab, Object.assign({ onClick: () => setActiveTab(title), active: title === activeTab }, { children: title })))) }), _jsx(TabContent, { children: activeChild === null || activeChild === void 0 ? void 0 : activeChild.props.children })] })));
};
const Tab = (_props) => {
    return null;
};
Tabs.Tab = Tab;
