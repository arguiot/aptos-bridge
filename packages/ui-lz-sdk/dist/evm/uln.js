"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraLightNode = exports.UltraLightNode__api = exports.getUltraLightNodeAddress = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const ui_core_1 = require("@layerzerolabs/ui-core");
const ethers_1 = require("ethers");
const contracts_1 = require("./contracts");
const CONFIG_TYPE = {
    INBOUND_PROOF_LIBRARY_VERSION: 1,
    INBOUND_BLOCK_CONFIRMATIONS: 2,
    RELAYER: 3,
    OUTBOUND_PROOF_TYPE: 4,
    OUTBOUND_BLOCK_CONFIRMATIONS: 5,
    ORACLE: 6,
};
function getUltraLightNodeAddress(chainId) {
    const key = (0, ui_core_1.getChainKey)(chainId);
    return lz_sdk_1.LZ_ULTRA_LIGHT_NODE_V1[key];
}
exports.getUltraLightNodeAddress = getUltraLightNodeAddress;
class UltraLightNode__api {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
    }
    forChainId(chainId) {
        const address = getUltraLightNodeAddress(chainId);
        const contract = contracts_1.UltraLightNode__factory.connect(address, this.providerFactory(chainId));
        return new UltraLightNode(contract, chainId);
    }
}
exports.UltraLightNode__api = UltraLightNode__api;
class UltraLightNode {
    constructor(contract, chainId) {
        this.contract = contract;
        this.chainId = chainId;
    }
    getConfig(chainId, userApplicationAddress, configType) {
        return this.contract.getConfig(chainId, userApplicationAddress, configType);
    }
    getInboundProofLibraryAddress(remoteChainId, libraryId) {
        return this.contract.inboundProofLibrary(remoteChainId, libraryId);
    }
    async getConfiguredInboundProofLibrary(remoteChainId, userApplicationContractAddress) {
        const encodedBL = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.INBOUND_PROOF_LIBRARY_VERSION);
        const decoded = ethers_1.utils.defaultAbiCoder.decode(['uint16'], encodedBL)[0];
        return decoded;
    }
    async getConfiguredInboundProofLibraryAddress(remoteChainId, userApplicationContractAddress) {
        const version = await this.getConfiguredInboundProofLibrary(remoteChainId, userApplicationContractAddress);
        return this.getInboundProofLibraryAddress(remoteChainId, version);
    }
    async getConfiguredInboundBlockConfirmations(remoteChainId, userApplicationContractAddress) {
        const encodedBL = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.INBOUND_BLOCK_CONFIRMATIONS);
        const decoded = ethers_1.utils.defaultAbiCoder.decode(['uint64'], encodedBL)[0];
        return decoded.toNumber();
    }
    async getConfiguredRelayer(remoteChainId, userApplicationContractAddress) {
        const encodedRelayer = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.RELAYER);
        return ethers_1.utils.getAddress(ethers_1.utils.defaultAbiCoder.decode(['address'], encodedRelayer)[0]);
    }
    async getConfiguredOutboundProofType(remoteChainId, userApplicationContractAddress) {
        const encodedBL = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.OUTBOUND_PROOF_TYPE);
        const decoded = ethers_1.utils.defaultAbiCoder.decode(['uint16'], encodedBL)[0];
        return decoded;
    }
    async getConfiguredBlockConfirmations(remoteChainId, userApplicationContractAddress) {
        const encodedBL = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.OUTBOUND_BLOCK_CONFIRMATIONS);
        const decoded = ethers_1.utils.defaultAbiCoder.decode(['uint64'], encodedBL)[0];
        return decoded.toNumber();
    }
    async getConfiguredOracle(remoteChainId, userApplicationContractAddress) {
        const encodedOracle = await this.getConfig(remoteChainId, userApplicationContractAddress, CONFIG_TYPE.ORACLE);
        return ethers_1.utils.getAddress(ethers_1.utils.defaultAbiCoder.decode(['address'], encodedOracle)[0]);
    }
    async defaultAdapterParams(dstChainId, transactionProofVersion) {
        return this.contract.defaultAdapterParams(dstChainId, transactionProofVersion);
    }
}
exports.UltraLightNode = UltraLightNode;
