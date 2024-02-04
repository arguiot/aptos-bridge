import { timeStamp } from '@layerzerolabs/ui-core';
export function reportEvent(eventName, args) {
    if (typeof window === 'undefined')
        return;
    try {
        const { dataLayer } = window;
        if (typeof dataLayer === 'undefined')
            return;
        dataLayer.push(Object.assign({ event: eventName, timeStamp: timeStamp() }, args));
    }
    catch (e) {
        console.error(e);
    }
}
