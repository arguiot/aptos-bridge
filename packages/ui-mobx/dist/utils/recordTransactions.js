import { applySnapshot, getSnapshot, onSnapshot } from 'mobx-state-tree';
import { cloneDeepWith } from 'lodash';
import { transactionStore } from '../transactionStore';
import { tryParseCurrencyAmount, Token, Coin, CurrencyAmount, } from '@layerzerolabs/ui-core';
import { waitForMessageReceived } from './waitForMessageReceived';
function tryParse(unknown) {
    try {
        if (unknown !== null && typeof unknown === 'object') {
            if (unknown['$type'] === 'Token') {
                const token = unknown;
                return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name);
            }
            if (unknown['$type'] === 'Coin') {
                const coin = unknown;
                return new Coin(coin.chainId, coin.decimals, coin.symbol, coin.name);
            }
            if (unknown['$type'] === 'CurrencyAmount') {
                const amount = unknown;
                const currency = tryParse(amount.currency);
                return tryParseCurrencyAmount(currency, amount.value);
            }
        }
    }
    catch (e) {
        console.log('tryParse', e);
    }
}
function trySerialize(unknown) {
    try {
        if (unknown !== null && typeof unknown === 'object') {
            if (unknown instanceof Coin) {
                return Object.assign({ $type: 'Coin' }, unknown);
            }
            if (unknown instanceof Token) {
                return Object.assign({ $type: 'Token' }, unknown);
            }
            if (unknown instanceof CurrencyAmount) {
                return {
                    $type: 'CurrencyAmount',
                    currency: trySerialize(unknown.currency),
                    value: unknown.toExact(),
                };
            }
        }
    }
    catch (e) {
        console.error('trySerialize', e);
    }
}
function serialize(obj) {
    return cloneDeepWith(obj, trySerialize);
}
function parse(obj) {
    return cloneDeepWith(obj, tryParse);
}
function saveSnapshot() {
    if (typeof localStorage === 'undefined')
        return;
    try {
        const snapshot = getSnapshot(transactionStore.transactions);
        localStorage.setItem('transactions', JSON.stringify(serialize(snapshot)));
    }
    catch (_a) {
        //
    }
}
function restoreSnapshot() {
    if (typeof localStorage === 'undefined')
        return;
    try {
        const snapshot = JSON.parse(localStorage.getItem('transactions'));
        if (snapshot === null || snapshot === void 0 ? void 0 : snapshot.length) {
            applySnapshot(transactionStore.transactions, parse(snapshot));
            // todo update pending
            transactionStore.transactions
                .filter((tx) => isCrossChainTx(tx) && !tx.completed && !tx.error)
                .forEach((tx) => {
                if (!tx.txHash)
                    return;
                waitForMessageReceived(tx.chainId, tx.txHash, 5000).then((message) => {
                    tx.update({
                        completed: true,
                        confirmation: {
                            chainId: message.dstChainId,
                            txHash: message.dstTxHash,
                        },
                    });
                }, (error) => {
                    tx.update({ error });
                });
            });
        }
    }
    catch (e) {
        console.error(e);
        //
    }
}
function isCrossChainTx(tx) {
    const input = tx.input;
    if (input === null || input === void 0 ? void 0 : input.dstChainId)
        return true;
    return false;
}
export function recordTransactions() {
    if (typeof window === 'undefined')
        return;
    restoreSnapshot();
    onSnapshot(transactionStore.transactions, () => {
        saveSnapshot();
    });
}
