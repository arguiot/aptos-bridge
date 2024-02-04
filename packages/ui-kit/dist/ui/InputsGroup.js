import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from '@mui/system';
const Group = styled('div', { name: 'InputsGroup' })(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    '& [class*=SelectButton]': {
        borderRadius: 0,
    },
    '& [class*=Input]': {
        border: 0,
        borderRadius: 0,
    },
}));
export const InputsGroup = (props) => {
    const { children } = props;
    return _jsx(Group, { children: children });
};
const Top = styled('div', { name: 'InputsGroupTop' })(({ theme }) => ({
    display: 'flex',
    '& > *:not(:first-child)': {
        marginLeft: 1,
    },
}));
const InputsGroupTop = (props) => {
    const { children } = props;
    return _jsx(Top, { children: children });
};
const InputsGroupBottom = (props) => {
    const { children } = props;
    return _jsx("div", { children: children });
};
InputsGroup.Top = InputsGroupTop;
InputsGroup.Bottom = InputsGroupBottom;
