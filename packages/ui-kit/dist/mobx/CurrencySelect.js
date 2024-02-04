import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { getNetwork, isCurrency } from '@layerzerolabs/ui-core';
import { fiatStore, getWalletBalance } from '@layerzerolabs/ui-mobx';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useToggle } from '../hooks/useToggle';
import { CurrencyIcon } from '../ui/CurrencyIcon';
import { ListItem as ModalListItem } from '../ui/ListItem';
import { Modal } from '../ui/Modal';
import { SearchBar } from '../ui/SearchBar';
import { SelectButton } from '../ui/SelectButton';
const ListItem = observer(ModalListItem);
function getFiatBalance(currency) {
    const balance = getWalletBalance(currency);
    const fiatBalance = fiatStore.toFiatAmount(balance);
    return fiatBalance === null || fiatBalance === void 0 ? void 0 : fiatBalance.value;
}
export const CurrencySelect = observer(({ icon: withIcon = true, title = 'Token', value, options = [], onSelect, sx, renderOption, readonly = !onSelect, }) => {
    const modal = useToggle();
    const [search, setSearch] = useState('');
    const filtered = options.map(toOption).filter((option) => matchSearch(option.currency, search));
    const sorted = filtered
        .sort((a, b) => {
        let aBalance = getFiatBalance(a.currency);
        let bBalance = getFiatBalance(b.currency);
        if (aBalance === undefined)
            aBalance = -1;
        if (bBalance === undefined)
            bBalance = -1;
        return aBalance - bBalance;
    })
        .sort((a) => (a.disabled ? 1 : -1));
    const icon = withIcon ? _jsx(CurrencyIcon, { currency: value, size: 40 }) : null;
    function close() {
        modal.close();
        setSearch('');
    }
    return (_jsxs(_Fragment, { children: [_jsx(SelectButton, { sx: sx, title: title, chevron: !readonly, onClick: readonly ? undefined : modal.value ? close : modal.open, icon: icon, value: value === null || value === void 0 ? void 0 : value.symbol, readonly: readonly }), _jsx(Modal, Object.assign({ overlay: true, title: title, topAdornment: _jsx(SearchBar, { value: search, onChange: (e) => setSearch(e.target.value) }), open: readonly ? false : modal.value, onClose: close }, { children: sorted.map((option, index) => {
                    var _a;
                    const onClick = () => {
                        if (option.disabled)
                            return;
                        onSelect === null || onSelect === void 0 ? void 0 : onSelect(option.currency);
                        close();
                    };
                    if (renderOption) {
                        return React.cloneElement(renderOption(option, index), { onClick, key: index });
                    }
                    const { currency } = option;
                    const network = getNetwork(currency.chainId);
                    const key = index;
                    const balance = getWalletBalance(currency);
                    const fiatBalance = fiatStore.toFiatAmount(balance);
                    return (_jsx(ListItem, { disabled: option.disabled, overlay: option.overlay, startAdornment: _jsx(CurrencyIcon, { size: 32, currency: currency }), bottomLeft: currency.symbol, topLeft: network.name, topRight: (_a = balance === null || balance === void 0 ? void 0 : balance.toExact()) !== null && _a !== void 0 ? _a : '-', bottomRight: fiatBalance ? '$' + fiatBalance.value.toFixed(2) : '-', onClick: onClick }, key));
                }) }))] }));
});
function matchSearch(currency, query) {
    if (!query)
        return true;
    const text = query.toLowerCase();
    return currency.symbol.toLowerCase().includes(text);
}
function toOption(option) {
    if (isCurrency(option)) {
        return {
            currency: option,
        };
    }
    return option;
}
