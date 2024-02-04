import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { styled, Box } from '@mui/system';
const PanelRoot = styled(Box, { name: 'Panel' })(({ theme }) => ({
    width: '464px',
    maxWidth: '100%',
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: theme.palette.text.primary,
}));
const Title = styled('div', { name: 'PanelTitle' })(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.text.secondary,
    alignItems: 'center',
}));
const PanelContent = styled('div', { name: 'PanelContent' })(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '32px',
    flex: '1',
}));
const EndAdornment = styled('div', { name: 'PanelTitleEndAdornment' })(() => ({
    fontSize: '12px',
}));
export const Panel = (props) => {
    const { title, endAdornment, children, footer, sx } = props;
    return (_jsxs(PanelRoot, Object.assign({ sx: sx }, { children: [(title || endAdornment) && (_jsxs(Title, { children: [_jsx("div", { children: title }), _jsx(EndAdornment, { children: endAdornment })] })), _jsx(PanelContent, { children: children }), footer] })));
};
