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
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { styled, useTheme } from '@mui/system';
import { Input } from './Input';
import { Icon } from './Icon';
const InputWrapper = styled('div', { name: 'SearchBarWrapper' })(({ theme }) => ({
    maxWidth: 'calc(100% - 32px)',
    margin: '0 auto',
    width: '100%',
}));
const SearchIcon = styled('span', { name: 'SearchBarIcon' })(({ theme }) => ({
    position: 'absolute',
    top: '0',
    left: '0',
    marginTop: '12px',
    marginLeft: '12px',
}));
export const SearchBar = (props) => {
    const theme = useTheme();
    const { value, onChange } = props, inputProps = __rest(props, ["value", "onChange"]);
    return (_jsx(InputWrapper, { children: _jsx(Input, Object.assign({ placeholder: 'Search', value: value, onChange: onChange, startAdornment: _jsx(Icon.Search, { size: 16, color: theme.palette.text.secondary }) }, inputProps)) }));
};
export function useSimpleSearch({ items, searchKey }) {
    const [query, setQuery] = React.useState('');
    const filteredItems = items.filter((item) => { var _a, _b; return (_b = (_a = item[searchKey]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(query); });
    return {
        filteredItems,
        query,
        setQuery,
    };
}
