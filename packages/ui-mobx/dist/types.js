import { Coin, CurrencyAmount, Token } from '@layerzerolabs/ui-core';
import { onSnapshot, types } from 'mobx-state-tree';
import { now } from 'mobx-utils';
export function onChange(target, callback) {
    let previous = undefined;
    return onSnapshot(target, (snapshot) => {
        if (previous !== undefined) {
            callback(snapshot, previous);
        }
        previous = snapshot;
    });
}
export const CurrencyAmountType = types.custom({
    name: 'CurrencyAmount',
    fromSnapshot({ currency, rawAmount }) {
        return CurrencyAmount.fromRawAmount(currency.address
            ? new Token(currency.chainId, currency.address, currency.decimals, currency.symbol, currency.name)
            : new Coin(currency.chainId, currency.decimals, currency.symbol, currency.name), rawAmount);
    },
    toSnapshot(value) {
        const currency = Object.assign({}, value.currency);
        return {
            currency,
            rawAmount: value.quotient.toString(),
        };
    },
    // tslint:disable-next-line:no-any
    isTargetType(v) {
        return v instanceof CurrencyAmount;
    },
    // tslint:disable-next-line:no-any
    getValidationMessage(v) {
        if (!(v instanceof CurrencyAmount)) {
            return 'Invalid moment object';
        }
        return '';
    },
});
export const DateType = types.custom({
    name: 'Date',
    fromSnapshot(isoString) {
        return new Date(isoString);
    },
    toSnapshot(value) {
        return value.toISOString();
    },
    // tslint:disable-next-line:no-any
    isTargetType(v) {
        return v instanceof Date;
    },
    // tslint:disable-next-line:no-any
    getValidationMessage(v) {
        if (!(v instanceof Date) && !(typeof v === 'string')) {
            return 'Invalid date object';
        }
        return '';
    },
});
export function liveTimeStamp() {
    return Math.floor(now() / 1000);
}
export function timeStamp(nowMs = Date.now()) {
    return Math.floor(nowMs / 1000);
}
