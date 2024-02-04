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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { getNetwork } from '@layerzerolabs/ui-core';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useToggle } from '../hooks/useToggle';
import { ListItem as ModalListItem } from '../ui/ListItem';
import { Modal } from '../ui/Modal';
import { NetworkIcon } from '../ui/NetworkIcon';
import { SearchBar } from '../ui/SearchBar';
import { SelectButton } from '../ui/SelectButton';
const ListItem = observer(ModalListItem);
export const NetworkSelect = observer((_a) => {
    var { icon: withIcon = true, title = 'Network', value, options = [], overlay = true, onSelect, renderOption, component, withSearch = true, readonly = !onSelect } = _a, props = __rest(_a, ["icon", "title", "value", "options", "overlay", "onSelect", "renderOption", "component", "withSearch", "readonly"]);
    const modal = useToggle();
    const [search, setSearch] = useState('');
    const filtered = options.map(toOption).filter((option) => matchSearch(option.chainId, search));
    const icon = withIcon ? _jsx(NetworkIcon, { chainId: value, size: 40 }) : null;
    const network = value ? getNetwork(value) : undefined;
    const sorted = filtered.sort((a) => {
        return a.disabled ? 1 : -1;
    });
    function close() {
        modal.close();
        setSearch('');
    }
    const SelectComponent = component !== null && component !== void 0 ? component : SelectButton;
    return (_jsxs(_Fragment, { children: [_jsx(SelectComponent, Object.assign({}, props, { title: title, onClick: readonly ? undefined : modal.value ? close : modal.open, chevron: !readonly, icon: icon, value: network === null || network === void 0 ? void 0 : network.name, readonly: readonly })), _jsx(Modal, Object.assign({ overlay: overlay, topAdornment: withSearch ? (_jsx(SearchBar, { value: search, onChange: (e) => setSearch(e.target.value) })) : null, title: title, open: readonly ? false : modal.value, onClose: close }, { children: sorted.map((option, index) => {
                    const { chainId } = option;
                    const network = getNetwork(chainId);
                    const onClick = () => {
                        if (option.disabled)
                            return;
                        onSelect === null || onSelect === void 0 ? void 0 : onSelect(chainId);
                        close();
                    };
                    if (renderOption) {
                        return React.cloneElement(renderOption(option, index), { onClick, key: index });
                    }
                    return (_jsx(ListItem, { disabled: option.disabled, overlay: option.overlay, startAdornment: _jsx(NetworkIcon, { chainId: chainId, size: 32 }), topLeft: network.name, bottomLeft: network.symbol, onClick: onClick }, index));
                }) }))] }));
});
function matchSearch(chainId, query) {
    if (!query)
        return true;
    const text = query.toLowerCase();
    const network = getNetwork(chainId);
    return network.name.toLowerCase().includes(text) || network.symbol.includes(text);
}
function toOption(option) {
    if (typeof option === 'number') {
        return {
            chainId: option,
        };
    }
    return option;
}
