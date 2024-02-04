var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { http } from '@layerzerolabs/ui-core';
import { flow, types } from 'mobx-state-tree';
export var FiatSymbol;
(function (FiatSymbol) {
    FiatSymbol["USD"] = "USD";
    FiatSymbol["EUR"] = "EUR";
})(FiatSymbol || (FiatSymbol = {}));
export const DEFAULT_FIAT_SYMBOL = FiatSymbol.USD;
export const FiatStoreModel = types
    .model({
    items: types.map(types.frozen()),
})
    .actions((store) => {
    const actions = {
        afterCreate() {
            if (typeof window === 'undefined')
                return;
            actions.fetch();
        },
        fetch: flow(function* () {
            try {
                const symbols = Object.keys(FiatSymbol);
                const items = yield getFiatQuotas(symbols);
                store.items.replace(items);
            }
            catch (e) {
                console.error(e);
                throw e;
            }
        }),
    };
    return actions;
})
    .views((store) => {
    const views = {
        pickFiatPrice(currency, fiatSymbol = DEFAULT_FIAT_SYMBOL) {
            const quotas = store.items.get(fiatSymbol);
            if (!quotas)
                return;
            const price = quotas[toKnownSymbol(currency.symbol)];
            if (!price)
                return;
            return {
                value: price,
                currency: fiatSymbol,
            };
        },
        toFiatAmount(amount, fiatSymbol = DEFAULT_FIAT_SYMBOL) {
            if (amount) {
                if (amount.equalTo(0)) {
                    return { value: 0, currency: fiatSymbol };
                }
                const price = views.pickFiatPrice(amount.currency, fiatSymbol);
                if (!price)
                    return undefined;
                const value = parseFloat(amount.toExact()) * price.value;
                return {
                    value,
                    currency: fiatSymbol,
                };
            }
            return undefined;
        },
        sum(amounts, fiatSymbol = DEFAULT_FIAT_SYMBOL) {
            if (amounts) {
                let result = 0;
                for (let i = 0; i < amounts.length; i++) {
                    const amount = views.toFiatAmount(amounts[i], fiatSymbol);
                    if (!amount) {
                        return undefined;
                    }
                    result += amount.value;
                }
                return {
                    value: result,
                    currency: fiatSymbol,
                };
            }
            return undefined;
        },
    };
    return views;
});
function toKnownSymbol(symbol) {
    symbol = symbol.toUpperCase();
    if (symbol === 'WETH')
        return 'ETH';
    if (symbol === 'BTC.B')
        return 'BTC';
    return symbol;
}
export const getFiatQuotas = (fiatSymbols) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield http.get('https://stargate.finance/.netlify/functions/fiat', {
        params: {
            symbol: fiatSymbols.join(','),
        },
    });
    return data;
});
export const fiatStore = FiatStoreModel.create();
export function toFiat(amount, symbol) {
    return fiatStore.toFiatAmount(amount, symbol);
}
