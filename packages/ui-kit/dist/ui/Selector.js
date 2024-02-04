import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, styled } from '@mui/system';
import React from 'react';
const SelectorRoot = styled(Box)(() => ({
    position: 'relative',
    width: '100%',
}));
const BgBar = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius,
    height: 32,
}));
const Buttons = styled('div')(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
}));
const Button = styled('button')(({ itemWidth, active, theme }) => ({
    color: active ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: theme.shape.borderRadius,
    width: `${itemWidth}%`,
    height: '100%',
    fontSize: 12,
    lineHeight: '16px',
    textTransform: 'uppercase',
    outline: 0,
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)',
        opacity: 0.7,
        cursor: 'pointer',
    },
}));
const SelectionBox = styled('div')(({ position = 0, itemWidth, theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    width: `${itemWidth}%`,
    height: 32,
    position: 'absolute',
    top: 0,
    transform: `translateX(${position * 100}%)`,
    transition: 'transform 100ms ease-out',
}));
export const Selector = (props) => {
    const { selection } = props;
    const childrenArray = React.Children.toArray(props.children);
    const activeChildIdx = childrenArray.findIndex((child) => child.props.value === selection);
    const selectionPosition = Math.max(activeChildIdx, 0);
    const itemWidth = 100 / childrenArray.length;
    return (_jsxs(SelectorRoot, { children: [_jsx(BgBar, {}), activeChildIdx > -1 && _jsx(SelectionBox, { position: selectionPosition, itemWidth: itemWidth }), _jsx(Buttons, { children: React.Children.map(childrenArray, ({ props: { value, onClick, children } }) => (_jsx(Button, Object.assign({ onClick: onClick, itemWidth: itemWidth, active: selection === value }, { children: children })))) })] }));
};
Selector.Option = (_props) => {
    return null;
};
