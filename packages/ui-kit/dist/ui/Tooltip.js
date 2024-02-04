import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled } from '@mui/system';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
const Content = styled(TooltipPrimitive.Content)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    padding: 12,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.secondary.contrastText,
    fontSize: 12,
    lineHeight: '16px',
}));
const Arrow = styled(TooltipPrimitive.Arrow)(({ theme }) => ({
    fill: theme.palette.secondary.light,
}));
export const WithTooltip = (props) => {
    const { children, text, open, defaultOpen, onOpenChange } = props;
    return (_jsx(TooltipPrimitive.Provider, Object.assign({ delayDuration: 100 }, { children: _jsxs(TooltipPrimitive.Root, Object.assign({ open: open, defaultOpen: defaultOpen, onOpenChange: onOpenChange }, { children: [_jsx(TooltipPrimitive.Trigger, Object.assign({ asChild: true }, { children: children })), _jsxs(Content, Object.assign({ side: 'top', align: 'center' }, props, { children: [text, _jsx(Arrow, { width: 14, height: 7 })] }))] })) })));
};
