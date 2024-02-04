import { Box, styled } from '@mui/system';
const VARIANTS = {
    h1: { fontSize: 28, lineHeight: '36px' },
    h2: { fontSize: 24, lineHeight: '28px' },
    h3: { fontSize: 20, lineHeight: '24px' },
    p1: { fontSize: 16, lineHeight: '24px' },
    p2: { fontSize: 14, lineHeight: '20px', letterSpacing: '-0.02em' },
    p3: { fontSize: 12, lineHeight: '16px' },
    caption: { fontSize: 10, lineHeight: '16px', textTransform: 'uppercase' },
};
function getVariant(variant) {
    if (variant) {
        return VARIANTS[variant];
    }
    return {};
}
export const TextBase = styled(Box, {
    name: 'Text',
    shouldForwardProp: (prop) => prop !== 'bold',
})((props) => (Object.assign({ color: props.color || props.theme.palette.text.primary, fontSize: props.size || 14, display: 'inline', fontWeight: props.bold ? 500 : 400 }, getVariant(props.variant))));
export const TextLink = styled('a', { name: 'TextLink' })((props) => (Object.assign(Object.assign({ color: props.color || props.theme.palette.text.secondary, fontSize: props.size || 14, display: 'inline', fontWeight: props.bold ? 500 : 400 }, getVariant(props.variant)), { cursor: 'pointer', '&:hover': {
        color: props.theme.palette.text.primary,
    } })));
export const Text = Object.assign(TextBase, {
    Link: TextLink,
});
