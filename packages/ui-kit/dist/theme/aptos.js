import { createTheme } from '@mui/system';
import { defaultBreakpoints } from './breakpoints';
export const themeAptos = createTheme({
    breakpoints: defaultBreakpoints,
    palette: {
        mode: 'dark',
        primary: {
            main: '#2DD8A7',
            light: '#4ADDB3',
            contrastText: '#000000',
        },
        secondary: {
            main: '#2E3231',
            light: '#363A39',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#2ed8a7',
        },
        success: {
            main: '#2DD8A7',
        },
        error: {
            main: '#F44336',
        },
        warning: {
            main: '#ED8B00',
        },
        text: {
            primary: '#FAFAFA',
            secondary: '#999A9A',
            // disabled: '#9A9A9A',
        },
        divider: 'rgba(250, 250, 250, 0.12)',
        background: {
            paper: '#1A1E1D',
            default: '#121615',
        },
    },
    shape: {
        borderRadius: 0,
    },
    typography: {
        fontFamily: '"lft-etica-mono", "Roboto Mono", monospace',
        button: {
            textTransform: 'none',
        },
    },
});
