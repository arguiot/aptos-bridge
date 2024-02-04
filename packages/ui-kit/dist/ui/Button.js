import { Box, styled } from '@mui/system';
var HEIGHT;
(function (HEIGHT) {
    HEIGHT[HEIGHT["xs"] = 26] = "xs";
    HEIGHT[HEIGHT["sm"] = 32] = "sm";
    HEIGHT[HEIGHT["md"] = 40] = "md";
    HEIGHT[HEIGHT["lg"] = 52] = "lg";
})(HEIGHT || (HEIGHT = {}));
var FONT_SIZE;
(function (FONT_SIZE) {
    FONT_SIZE[FONT_SIZE["xs"] = 12] = "xs";
    FONT_SIZE[FONT_SIZE["sm"] = 12] = "sm";
    FONT_SIZE[FONT_SIZE["md"] = 14] = "md";
    FONT_SIZE[FONT_SIZE["lg"] = 16] = "lg";
})(FONT_SIZE || (FONT_SIZE = {}));
const DEFAULT_SIZE = 'lg';
export const Button = styled('button', { name: 'LzButton', label: 'LzButton' })(({ theme, size = DEFAULT_SIZE, variant = 'secondary' }) => {
    var _a;
    return (Object.assign(Object.assign(Object.assign(Object.assign({ borderRadius: theme.shape.borderRadius, border: '0', height: HEIGHT[size], fontSize: FONT_SIZE[size], cursor: 'pointer', padding: '0px 16px', 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textTransform: (_a = theme.typography.button) === null || _a === void 0 ? void 0 : _a.textTransform, '&:disabled': {
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
                cursor: 'default',
            },
        } }, (variant === 'primary' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover:not(:disabled)': {
            backgroundColor: theme.palette.primary.light,
        },
        '&:focus': {
            outline: 0,
            backgroundColor: theme.palette.primary.light,
        },
    })), (variant === 'secondary' && {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover:not(:disabled)': {
            backgroundColor: theme.palette.secondary.light,
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.light,
            outline: 0,
        },
    })), (variant === 'tertiary' && {
        minHeight: 24,
        padding: '4px 9px',
        fontSize: 12,
        // not sure why that size ?
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover:not(:disabled)': {
            backgroundColor: theme.palette.secondary.light,
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.light,
            outline: 0,
        },
    })), (variant == 'incognito' && {
        background: 'transparent',
        padding: 0,
        color: theme.palette.primary.contrastText,
        height: 'auto',
        textTransform: 'none',
        '&:hover:not(:disabled)': {
            opacity: 0.7,
        },
    })));
});
export const ButtonGroup = styled(Box, { name: 'ButtonGroup' })(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '& > [class*=LzButton]:not(:first-of-type), & > *:first-of-type': {
        marginLeft: 1,
    },
    // Reset radii and only apply to first and last item
    '& > [class*=LzButton], & > *': {
        borderRadius: 0,
    },
    '& > [class*=LzButton]:first-of-type, & > *:first-of-type': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '& > [class*=LzButton]:last-of-type, & > *:last-of-type': {
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    },
}));
