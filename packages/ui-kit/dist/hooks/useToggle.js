import { useState, useCallback } from 'react';
export function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const close = useCallback(() => setValue(false), []);
    const open = useCallback(() => setValue(true), []);
    return {
        value,
        open,
        close,
    };
}
