"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOracleNotifyEvent = exports.getBlockConfirmations = exports.hexToBytes = exports.bytesToHex = exports.slicePayload = exports.decodeParameters = exports.encodeParameters = exports.extractLZMessageFromEtherLog = exports.extractRelayerParams = exports.ADAPTER_PARAMS_SLICE_INDEXES = exports.PACKET_PARAMS_ENCODING = exports.RELAYER_PARAMS_ENCODING = exports.LAYERZERO_PACKET_SIGNATURE = exports.RELAYER_PARAMS_SIGNATURE = exports.PACKET_NONCE_HEX_WIDTH = void 0;
const ui_ethers_1 = require("@layerzerolabs/ui-ethers");
const ethers_1 = require("ethers");
const uln_1 = require("./uln");
exports.PACKET_NONCE_HEX_WIDTH = 8;
exports.RELAYER_PARAMS_SIGNATURE = '0xb8a7262132db1f61626604a31c3de81dc1a5bb0f1511dfa70d626ab1b88b52c2';
exports.LAYERZERO_PACKET_SIGNATURE = '0xe8d23d927749ec8e512eb885679c2977d57068839d8cca1a85685dbbea0648f6';
exports.RELAYER_PARAMS_ENCODING = [
    {
        indexed: false,
        internalType: 'uint16',
        name: 'chainId',
        type: 'uint16',
    },
    {
        indexed: false,
        internalType: 'uint64',
        name: 'nonce',
        type: 'uint64',
    },
    {
        indexed: false,
        internalType: 'uint16',
        name: 'outboundProofType',
        type: 'uint16',
    },
    {
        indexed: false,
        internalType: 'bytes',
        name: 'adapterParams',
        type: 'bytes',
    },
];
exports.PACKET_PARAMS_ENCODING = [
    {
        indexed: false,
        internalType: 'uint16',
        name: 'chainId',
        type: 'uint16',
    },
    {
        indexed: false,
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
    },
];
const ADAPTER_PARAMS_VERSION_SIZE = 2;
const ADAPTER_PARAMS_EXTRA_GAS_SIZE = 32;
const ADAPTER_PARAMS_DESTINATION_NATIVE_GAS_TRANSFER_SIZE = 32;
exports.ADAPTER_PARAMS_SLICE_INDEXES = [
    ADAPTER_PARAMS_VERSION_SIZE,
    ADAPTER_PARAMS_EXTRA_GAS_SIZE,
    ADAPTER_PARAMS_DESTINATION_NATIVE_GAS_TRANSFER_SIZE,
];
async function extractRelayerParams(message, providerFactory) {
    const api = new uln_1.UltraLightNode__api(providerFactory);
    const srcUltraLightNode = api.forChainId(message.srcChainId);
    const srcProvider = (0, ui_ethers_1.getProvider)(message.srcChainId);
    const receipt = await srcProvider.getTransactionReceipt(message.srcTxHash);
    if (!receipt) {
        throw new Error('cannot find transaction receipt');
    }
    let lzMessageLogIndex;
    for (let logIndex = receipt.logs.length - 1; logIndex >= 0; logIndex--) {
        const log = receipt.logs[logIndex];
        if (!log || !log.topics || !log.topics[0]) {
            continue;
        }
        // We first find the packet event
        if (log.topics[0].toLowerCase() === exports.LAYERZERO_PACKET_SIGNATURE) {
            const lzMessageFromLog = await (0, exports.extractLZMessageFromEtherLog)(message.srcChainId, log);
            if (lzMessageFromLog.srcUA.toLowerCase() === message.srcUA.toLowerCase() &&
                lzMessageFromLog.dstChainId === message.dstChainId &&
                lzMessageFromLog.srcOutboundNonce === message.srcOutboundNonce) {
                lzMessageLogIndex = logIndex;
            }
        }
        // Once packet event have been found, there is no way to correctly identify
        // the relayer param event between two packets with same nonce and different ua address.
        // Therefore the only way to do it with certainty is to find the closest relayer event
        // to the packet event
        if (lzMessageLogIndex && log.topics[0].toLowerCase() === exports.RELAYER_PARAMS_SIGNATURE) {
            const rawRelayerParams = decodeParameters(exports.RELAYER_PARAMS_ENCODING, log.data);
            const rawAdapterParam = rawRelayerParams.adapterParams != '0x'
                ? rawRelayerParams.adapterParams
                : await srcUltraLightNode.defaultAdapterParams(message.dstChainId, rawRelayerParams.outboundProofType);
            const adapterParams = await getAdapterParams(rawAdapterParam);
            const relayerParams = {
                chainId: rawRelayerParams.chainId,
                nonce: rawRelayerParams.nonce.toNumber(),
                outboundProofType: rawRelayerParams.outboundProofType,
                adapterParams,
            };
            return {
                relayerParams,
                logIndex: lzMessageLogIndex,
            };
        }
    }
    throw new Error('NoMatchingAdapterParamsError');
}
exports.extractRelayerParams = extractRelayerParams;
const extractLZMessageFromEtherLog = async (srcChainId, ethersLog) => {
    const rawPacket = decodeParameters(exports.PACKET_PARAMS_ENCODING, ethersLog.data);
    const rawMessage = await extractLZMessageFromRawPayload(rawPacket.payload, srcChainId, rawPacket.chainId);
    const lzMessage = Object.assign({ srcChainId, dstChainId: rawPacket.chainId, payload: rawPacket.payload, srcBlockHash: ethersLog.blockHash, srcBlockNumber: ethersLog.blockNumber, srcTxHash: ethersLog.transactionHash }, rawMessage);
    return lzMessage;
};
exports.extractLZMessageFromEtherLog = extractLZMessageFromEtherLog;
const extractLZMessageFromRawPayload = async (payload, srcChainId, dstChainId) => {
    const decodedRawPayload = await decodeRawPayload(payload, srcChainId, dstChainId);
    return {
        srcOutboundNonce: ethers_1.BigNumber.from(decodedRawPayload[0]).toNumber(),
        srcUA: decodedRawPayload[1],
        dstUA: decodedRawPayload[2],
        uaPayload: decodedRawPayload[3],
    };
};
async function getChainInfo(chainId) {
    //todo: implement
    return {
        addressSizeInBytes: 20,
    };
}
const decodeRawPayload = async (payload, srcChainId, dstChainId) => {
    const srcChain = await getChainInfo(srcChainId);
    const dstChain = await getChainInfo(dstChainId);
    return (0, exports.slicePayload)(payload, [
        exports.PACKET_NONCE_HEX_WIDTH,
        srcChain.addressSizeInBytes,
        dstChain.addressSizeInBytes,
    ]);
};
const getAdapterParams = async (rawAdapterParam) => {
    const slicedPayload = (0, exports.slicePayload)(rawAdapterParam, exports.ADAPTER_PARAMS_SLICE_INDEXES);
    const adapterParams = {
        version: ethers_1.BigNumber.from(slicedPayload[0]).toString(),
        dstGasLimit: ethers_1.BigNumber.from(slicedPayload[1]).toString(),
    };
    if (adapterParams.version == '2') {
        adapterParams.dstNativeAmount = ethers_1.BigNumber.from(slicedPayload[2]).toString();
        const raw = ethers_1.BigNumber.from(slicedPayload[3]).toHexString();
        adapterParams.dstNativeAddress = '0x' + raw.padStart(40, '0');
    }
    return adapterParams;
};
/**
 * Encodes parameters for smart contract call.
 * @param types Input types.
 * @param values Input values.
 */
function encodeParameters(types, values) {
    return ethers_1.utils.defaultAbiCoder.encode(types, values);
}
exports.encodeParameters = encodeParameters;
/**
 * Decodes parameters from smart contract return.
 * @param types Output types.
 * @param data Output data.
 */
function decodeParameters(types, data) {
    return ethers_1.utils.defaultAbiCoder.decode(types, data);
}
exports.decodeParameters = decodeParameters;
const slicePayload = (payload, sliceIndexes) => {
    ethers_1.utils;
    const payloadBytes = hexToBytes(payload);
    let startIndex = 0;
    // Slice for each slice indexes
    const slicedPayload = sliceIndexes.map((nextValueSize) => {
        const nextIndex = startIndex + nextValueSize;
        const hexValue = (0, exports.bytesToHex)(payloadBytes.slice(startIndex, nextIndex));
        startIndex = nextIndex;
        return hexValue;
    });
    // We slice the rest of the payload if any
    slicedPayload.push((0, exports.bytesToHex)(payloadBytes.slice(startIndex)));
    return slicedPayload;
};
exports.slicePayload = slicePayload;
exports.bytesToHex = ethers_1.utils.hexlify;
function hexToBytes(hex) {
    hex = hex.toString(16).replace(/^0x/i, '');
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}
exports.hexToBytes = hexToBytes;
const getBlockConfirmations = async (chainId, txHash) => {
    const provider = (0, ui_ethers_1.getProvider)(chainId);
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt.confirmations;
};
exports.getBlockConfirmations = getBlockConfirmations;
const getOracleNotifyEvent = async (message) => {
    const abi = [
        'event OracleNotified(uint16 dstChainId, uint16 outboundProofType, uint256 blockConfirmations)',
    ];
    const iface = new ethers_1.utils.Interface(abi);
    const topicHash = iface.getEventTopic('OracleNotified');
    const provider = (0, ui_ethers_1.getProvider)(message.srcChainId);
    const receipt = await provider.getTransactionReceipt(message.srcTxHash);
    const decodedLogs = receipt.logs
        .filter((log) => log.topics[0] === topicHash)
        .map((log) => iface.parseLog(log));
    const oracleNotifiedEvent = decodedLogs.filter((e) => e.args.dstChainId === message.dstChainId);
    return oracleNotifiedEvent;
};
exports.getOracleNotifyEvent = getOracleNotifyEvent;
