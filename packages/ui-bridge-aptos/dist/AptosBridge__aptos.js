"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosBridge__aptos = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const bridge_1 = require("@layerzerolabs/lz-aptos/dist/modules/apps/bridge");
const coin_1 = require("@layerzerolabs/lz-aptos/dist/modules/apps/coin");
const assert_1 = __importDefault(require("assert"));
const aptos_1 = require("aptos");
const promise_obj_1 = __importDefault(require("promise.obj"));
const removeDust_1 = require("./removeDust");
const p_memoize_1 = __importDefault(require("p-memoize"));
const getBridgeAddress_1 = require("./eth/getBridgeAddress");
const contracts_1 = require("./eth/contracts");
class AptosBridge__aptos {
    constructor(aptosClient, bridgeModule, config, aptosSdk, aptosManagedCoinRegisterService, providerFactory) {
        this.aptosClient = aptosClient;
        this.bridgeModule = bridgeModule;
        this.config = config;
        this.aptosSdk = aptosSdk;
        this.aptosManagedCoinRegisterService = aptosManagedCoinRegisterService;
        this.providerFactory = providerFactory;
        this.BP_DENOMINATOR = 10000;
        this.getBridgeFeeBp = (0, p_memoize_1.default)(async (dstChainId) => {
            (0, assert_1.default)((0, ui_core_1.isEvmChainId)(dstChainId), 'Not EVM');
            const bridgeFeeBP = await this.getEvmBridgeContract(dstChainId).bridgeFeeBP();
            return bridgeFeeBP.toNumber();
        });
    }
    async isApproved(amount, address) {
        return true;
    }
    approve(amount) {
        throw new Error('Method not supported.');
    }
    supports(srcCurrency, dstCurrency) {
        if (!(0, ui_core_1.isAptosChainId)(srcCurrency.chainId))
            return false;
        if (!this.config.tokens.some((token) => token.equals(srcCurrency)))
            return false;
        if (dstCurrency) {
            if (!(0, ui_core_1.isEvmChainId)(dstCurrency.chainId))
                return false;
            if (!this.config.tokens.some((token) => token.equals(dstCurrency)))
                return false;
        }
        return true;
    }
    isRegistered(currency, address) {
        return this.aptosManagedCoinRegisterService.isRegistered(currency, address);
    }
    async getUnclaimed(currency, address) {
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const coinType = getBridgeCoinType(currency);
        const balance = await this.bridgeModule.getClaimableCoin(coinType, address);
        return (0, ui_core_1.toCurrencyAmount)(currency, balance);
    }
    async claim(currency) {
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const { aptosClient } = this;
        const coinType = getBridgeCoinType(currency);
        const payload = this.bridgeModule.claimCoinPayload(coinType);
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
                // https://explorer.aptoslabs.com/txn/0x2de11ed5f2ef195831129ecb80637edc684d9db311105a32662e20b5d1e7a684
                const gasUnits = 1301;
                return BigInt(gasUnits);
            },
            async estimateNative(signer) {
                const gasUnits = await tx.estimateGas(signer);
                const { gas_estimate: gasPrice } = await aptosClient.estimateGasPrice();
                const estimate = Number(gasUnits) * gasPrice * 4;
                const native = (0, ui_core_1.getNativeCurrency)(currency.chainId);
                return ui_core_1.CurrencyAmount.fromRawAmount(native, estimate);
            },
        };
        return tx;
    }
    register(currency) {
        return this.aptosManagedCoinRegisterService.registerCoin(currency);
    }
    async transfer(input) {
        const { aptosClient } = this;
        const coinType = getBridgeCoinType(input.srcCurrency);
        const amountLD = (0, ui_core_1.toBigInt)(input.amount);
        const nativeFee = (0, ui_core_1.toBigInt)(input.fee.nativeFee);
        const zroFee = 0;
        const unwrap = (0, ui_core_1.isCoin)(input.dstCurrency);
        const adapterParams = this.buildAdapterParamsStruct(input.adapterParams);
        const dstAddress = aptos_1.BCS.bcsToBytes(aptos_1.TxnBuilderTypes.AccountAddress.fromHex(input.dstAddress));
        const option = new Uint8Array(0);
        const payload = this.bridgeModule.sendCoinPayload(coinType, input.dstChainId, 
        // @ts-ignore
        Array.from(dstAddress), amountLD, nativeFee, zroFee, unwrap, Array.from(adapterParams), Array.from(option));
        const options = {
        // max_gas_amount: 20_000,
        // sender: Address;
        // sequence_number: U64;
        // max_gas_amount: U64;
        // gas_unit_price: U64;
        // expiration_timestamp_secs: U64;
        // payload: TransactionPayload;
        // signature: TransactionSignature;
        };
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await signer.signAndSubmitTransaction(payload, options);
                const result = {
                    txHash: response.hash,
                    wait: async () => {
                        const receipt = await aptosClient.waitForTransactionWithResult(response.hash, {
                            checkSuccess: true,
                        });
                        return {
                            txHash: receipt.hash,
                        };
                    },
                };
                return result;
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
    async getExtraGas(srcChainId, dstChainId) {
        const extraGas = await this.bridgeModule.getMinDstGas(dstChainId, BigInt(bridge_1.PacketType.SEND));
        return Number(extraGas);
    }
    async getMessageFee(srcChainId, dstChainId, adapterParams) {
        const native = (0, ui_core_1.getNativeCurrency)(srcChainId);
        const adapterParamsStruct = this.buildAdapterParamsStruct(adapterParams);
        const amount = await this.aptosSdk.LayerzeroModule.Endpoint.quoteFee(this.bridgeModule.address, dstChainId, adapterParamsStruct, this.bridgeModule.SEND_PAYLOAD_LENGTH);
        const fee = {
            zroFee: ui_core_1.CurrencyAmount.fromRawAmount(native, 0),
            nativeFee: ui_core_1.CurrencyAmount.fromRawAmount(native, amount),
        };
        return fee;
    }
    async getOutput(inputAmount, dstCurrency) {
        inputAmount = (0, removeDust_1.removeDust)(inputAmount);
        const dstChainId = dstCurrency.chainId;
        const bridgeFeeBP = await this.getBridgeFeeBp(dstChainId);
        const inputAmountRD = (0, ui_core_1.castCurrencyAmountUnsafe)(inputAmount, dstCurrency);
        // fee is collected on remote
        const feeRD = inputAmountRD.multiply(bridgeFeeBP).divide(this.BP_DENOMINATOR);
        const outputAmountRD = inputAmountRD.subtract(feeRD);
        return {
            amount: outputAmountRD,
            fee: feeRD,
        };
    }
    async getLimit(srcCurrency, dstCurrency) {
        const coinType = getBridgeCoinType(srcCurrency);
        const { limit, tvl } = await (0, promise_obj_1.default)({
            limit: this.bridgeModule.getLimitedAmount(coinType),
            tvl: this.bridgeModule.getRemoteCoin(coinType, dstCurrency.chainId),
        });
        const tvlLimit = toLD(srcCurrency, tvl.tvlSD);
        if (limit.limited) {
            const windowLimit = toLD(srcCurrency, limit.amount);
            if (windowLimit.lessThan(tvlLimit))
                return windowLimit;
        }
        return tvlLimit;
    }
    buildAdapterParamsStruct(adapterParams) {
        var _a;
        if ((_a = adapterParams.dstNativeAmount) === null || _a === void 0 ? void 0 : _a.greaterThan(0)) {
            (0, assert_1.default)(adapterParams.dstNativeAddress, 'dstNativeAddress');
            // const dstNativeAddress = HexString.ensure(adapterParams.dstNativeAddress).toUint8Array();
            return this.aptosSdk.LayerzeroModule.Executor.buildAirdropAdapterParams(adapterParams.extraGas, (0, ui_core_1.toBigInt)(adapterParams.dstNativeAmount), adapterParams.dstNativeAddress);
        }
        else {
            return this.aptosSdk.LayerzeroModule.Executor.buildDefaultAdapterParams(adapterParams.extraGas);
        }
    }
    getEvmBridgeContract(chainId) {
        const provider = this.providerFactory(chainId);
        const address = this.getEvmBridgeAddress(chainId);
        const contract = contracts_1.ITokenBridge__factory.connect(address, provider);
        return contract;
    }
    getEvmBridgeAddress(srcChainId) {
        return (0, getBridgeAddress_1.getBridgeAddress)(srcChainId);
    }
}
exports.AptosBridge__aptos = AptosBridge__aptos;
function getBridgeCoinType(currency) {
    (0, assert_1.default)((0, ui_core_1.isAptosChainId)(currency.chainId));
    const symbol = currency.symbol;
    const coinType = coin_1.CoinType[symbol];
    if (!coinType)
        throw new Error(`No BridgeCoinType for ${symbol} `);
    return coinType;
}
// todo: check decimals tvlSD
function toLD(currency, amountSD, SD = 6) {
    const amount = ui_core_1.CurrencyAmount.fromRawAmount(currency, amountSD);
    if (currency.decimals === SD)
        return amount;
    return (amount
        //
        .multiply(10 ** currency.decimals)
        .divide(10 ** SD));
}
