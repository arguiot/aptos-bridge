"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosManagedCoinRegisterService = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const assert_1 = __importDefault(require("assert"));
class AptosManagedCoinRegisterService {
    constructor(aptosClient, resourceProvider) {
        this.aptosClient = aptosClient;
        this.resourceProvider = resourceProvider;
    }
    async isRegistered(resource, address) {
        const resources = await this.resourceProvider.getAccountResources(address);
        const type = getResourceType(resource);
        return resources.some((other) => other.type === type);
    }
    async registerCoin(token) {
        const { aptosClient } = this;
        (0, assert_1.default)((0, ui_core_1.isToken)(token));
        (0, assert_1.default)(aptosClient);
        const coinType = token.address;
        const payload = {
            function: `0x1::managed_coin::register`,
            type_arguments: [coinType],
            arguments: [],
        };
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await signer.signAndSubmitTransaction(payload);
                return {
                    txHash: response.hash,
                    async wait() {
                        const result = await aptosClient.waitForTransactionWithResult(response.hash, {
                            checkSuccess: true,
                        });
                        return {
                            txHash: result.hash,
                        };
                    },
                };
            },
            async estimateGas(signer) {
                // can't call client.simulateTransaction()
                // because no publicKey is available in the wallet adapter (yet)
                // using value from this tx
                // https://explorer.aptoslabs.com/txn/0xddb86441811bdd9fe6968a9932cfb41be62afe3a27f73c1fd4b361ebaa7847c3?network=testnet
                const gasUnits = 658;
                return BigInt(gasUnits);
            },
            async estimateNative(signer) {
                const { gas_estimate: gasPrice } = await aptosClient.estimateGasPrice();
                const gasUnits = await tx.estimateGas(signer);
                const estimate = Number(gasUnits) * gasPrice * 4;
                const native = (0, ui_core_1.getNativeCurrency)(token.chainId);
                return ui_core_1.CurrencyAmount.fromRawAmount(native, estimate);
            },
        };
        return tx;
    }
}
exports.AptosManagedCoinRegisterService = AptosManagedCoinRegisterService;
function getResourceType(currency) {
    if ((0, ui_core_1.isToken)(currency)) {
        const type = `0x1::coin::CoinStore<${currency.address}>`;
        return type;
    }
    return undefined;
}
