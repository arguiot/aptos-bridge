"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = exports.getEndpointAddress = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const contracts_1 = require("./contracts");
const ui_ethers_1 = require("@layerzerolabs/ui-ethers");
const ui_core_1 = require("@layerzerolabs/ui-core");
function getEndpointAddress(chainId) {
    const key = (0, ui_core_1.getChainKey)(chainId);
    const address = lz_sdk_1.LZ_ADDRESS[key];
    if (!address)
        throw new Error(`No Endpoint address for ${chainId}`);
    return address;
}
exports.getEndpointAddress = getEndpointAddress;
class Endpoint {
    constructor(contract, chainId) {
        this.contract = contract;
        this.chainId = chainId;
    }
    static forChainId(chainId) {
        const address = getEndpointAddress(chainId);
        const contract = contracts_1.Endpoint__factory.connect(address, (0, ui_ethers_1.getProvider)(chainId));
        return new Endpoint(contract, chainId);
    }
    async getInboundNonce(srcChainId, srcAddress) {
        const nonce = await this.contract.getInboundNonce(srcChainId, srcAddress);
        return nonce.toNumber();
    }
    async getOutboundNonce(dstChainID, srcAddress) {
        const nonce = await this.contract.getOutboundNonce(dstChainID, srcAddress);
        return nonce.toNumber();
    }
    async getSendVersion(userApplication) {
        return this.contract.getSendVersion(userApplication);
    }
    async getReceiveVersion(userApplication) {
        return this.contract.getReceiveVersion(userApplication);
    }
    async hasStoredPayload(srcChainId, srcAddress) {
        return this.contract.hasStoredPayload(srcChainId, srcAddress);
    }
    async getStoredPayload(srcChainId, srcAddress) {
        const iface = this.contract.interface;
        const provider = this.contract.provider;
        // Use only the primary RPC Provider, as eth_getLogs RPC call is expensive.
        const logs = await provider.getLogs({
            fromBlock: 'earliest',
            toBlock: 'latest',
            address: this.contract.address,
            topics: [iface.getEventTopic('PayloadStored')],
        });
        for (let log of logs) {
            const parsedLog = iface.parseLog(log);
            if (parsedLog.args.srcChainId.toString() === srcChainId.toString() &&
                parsedLog.args.srcAddress === srcAddress) {
                return parsedLog.args.payload;
            }
        }
    }
}
exports.Endpoint = Endpoint;
