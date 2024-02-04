import { jsx as _jsx } from "react/jsx-runtime";
import { getCurrencyIcon } from '@layerzerolabs/ui-core';
import { useState } from 'react';
import { Icon } from './Icon';
export const CurrencyIcon = (props) => {
    const [error, setError] = useState();
    if (!props.currency || error) {
        return _jsx(Icon.DefaultToken, { size: props.size });
    }
    return (_jsx("img", { src: getCurrencyIcon(props.currency.symbol), width: props.size, height: props.size, onError: setError }));
};
