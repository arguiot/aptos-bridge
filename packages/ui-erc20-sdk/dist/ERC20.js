"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC20__api = exports.ERC20 = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const ERC20__factory_1 = require("./contracts/factories/ERC20__factory");
const p_memoize_1 = __importDefault(require("p-memoize"));
const assert_1 = __importDefault(require("assert"));
const lodash_1 = require("lodash");
class ERC20 {
    constructor(token, contract) {
        this.token = token;
        this.contract = contract;
    }
    async balanceOf(account) {
        const balance = await this.contract.balanceOf(account);
        return (0, ui_core_1.toCurrencyAmount)(await this.token, balance);
    }
    async allowance(owner, spender) {
        const amount = await this.contract.allowance(owner, spender);
        return (0, ui_core_1.toCurrencyAmount)(await this.token, amount);
    }
    async isApproved(amount, owner, spender) {
        (0, assert_1.default)(amount.currency.equals(this.token));
        const allowance = await this.allowance(owner, spender);
        if (allowance.lessThan(amount))
            return false;
        return true;
    }
    async approve(amount, spender) {
        (0, assert_1.default)(amount.currency.equals(this.token), 'token');
        const { contract } = this;
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await contract.connect(signer).approve(spender, (0, ui_core_1.toBigNumber)(amount));
                return {
                    txHash: response.hash,
                    async wait() {
                        const receipt = await response.wait();
                        return {
                            txHash: receipt.transactionHash,
                        };
                    },
                };
            },
            estimateGas: function (signer) {
                throw new Error('Function not implemented.');
            },
            estimateNative: function (signer) {
                throw new Error('Function not implemented.');
            },
        };
        return tx;
    }
}
exports.ERC20 = ERC20;
async function getToken(chainId, address, provider) {
    const erc20 = ERC20__factory_1.ERC20__factory.connect(address, provider);
    const [symbol, decimals, name] = await Promise.all([
        erc20.symbol(),
        erc20.decimals(),
        erc20.name(),
    ]);
    return new ui_core_1.Token(chainId, address, decimals, symbol, name);
}
class ERC20__api {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
        this.getToken = (0, p_memoize_1.default)(({ chainId, address }) => {
            return getToken(chainId, address, this.providerFactory(chainId));
        }, {
            cacheKey: ([{ chainId, address }]) => chainId + ':' + address.toLowerCase(),
        });
    }
    forToken(currency) {
        (0, assert_1.default)((0, ui_core_1.isToken)(currency), 'token');
        const provider = this.providerFactory(currency.chainId);
        const contract = ERC20__factory_1.ERC20__factory.connect(currency.address, provider);
        return new ERC20(currency, contract);
    }
    async getTransferEvents(chainId, txHash) {
        const provider = this.providerFactory(chainId);
        const receipt = await provider.getTransactionReceipt(txHash);
        const events = await Promise.all(receipt.logs.map((log) => this.tryParseTransferEvent(chainId, log)));
        return (0, lodash_1.compact)(events);
    }
    async tryParseTransferEvent(chainId, log) {
        const iface = ERC20__factory_1.ERC20__factory.createInterface();
        const event = iface.getEvent('Transfer');
        const topicHash = iface.getEventTopic(event);
        if (log.topics[0] !== topicHash)
            return undefined;
        try {
            const description = iface.parseLog(log);
            const tokenAddress = log.address;
            const token = await this.getToken({ chainId, address: tokenAddress });
            const value = (0, ui_core_1.toCurrencyAmount)(token, description.args.value);
            return {
                event: {
                    name: event.name,
                    namespace: 'ERC20',
                },
                args: {
                    from: description.args.from,
                    to: description.args.to,
                    value,
                },
                address: tokenAddress,
                chainId,
            };
        }
        catch (_a) {
            // not ERC20
        }
    }
}
exports.ERC20__api = ERC20__api;
