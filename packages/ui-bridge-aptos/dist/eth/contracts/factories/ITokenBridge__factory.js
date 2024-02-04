"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITokenBridge__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_layerZeroEndpoint',
                type: 'address',
            },
            {
                internalType: 'uint16',
                name: '_aptosChainId',
                type: 'uint16',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bool',
                name: 'enabled',
                type: 'bool',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'unlockTime',
                type: 'uint256',
            },
        ],
        name: 'EnableEmergencyWithdraw',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: '_nonce',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_payload',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_reason',
                type: 'bytes',
            },
        ],
        name: 'MessageFailed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountLD',
                type: 'uint256',
            },
        ],
        name: 'Receive',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'RegisterToken',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: '_nonce',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: '_payloadHash',
                type: 'bytes32',
            },
        ],
        name: 'RetryMessageSuccess',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'to',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountLD',
                type: 'uint256',
            },
        ],
        name: 'Send',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: 'aptosChainId',
                type: 'uint16',
            },
        ],
        name: 'SetAptosChainId',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'bridgeFeeBP',
                type: 'uint256',
            },
        ],
        name: 'SetBridgeBP',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bool',
                name: 'paused',
                type: 'bool',
            },
        ],
        name: 'SetGlobalPause',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: 'localChainId',
                type: 'uint16',
            },
        ],
        name: 'SetLocalChainId',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: '_dstChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: '_type',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_minDstGas',
                type: 'uint256',
            },
        ],
        name: 'SetMinDstGas',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'precrime',
                type: 'address',
            },
        ],
        name: 'SetPrecrime',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'paused',
                type: 'bool',
            },
        ],
        name: 'SetTokenPause',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: '_remoteChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_path',
                type: 'bytes',
            },
        ],
        name: 'SetTrustedRemote',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: '_remoteChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: '_remoteAddress',
                type: 'bytes',
            },
        ],
        name: 'SetTrustedRemoteAddress',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bool',
                name: 'useCustomAdapterParams',
                type: 'bool',
            },
        ],
        name: 'SetUseCustomAdapterParams',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'weth',
                type: 'address',
            },
        ],
        name: 'SetWETH',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountLD',
                type: 'uint256',
            },
        ],
        name: 'WithdrawFee',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountLD',
                type: 'uint256',
            },
        ],
        name: 'WithdrawTVL',
        type: 'event',
    },
    {
        inputs: [],
        name: 'BP_DENOMINATOR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'SHARED_DECIMALS',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
        ],
        name: 'accruedFeeLD',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'aptosChainId',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'bridgeFeeBP',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'emergencyWithdrawEnabled',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'emergencyWithdrawTime',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: 'enabled',
                type: 'bool',
            },
        ],
        name: 'enableEmergencyWithdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        name: 'failedMessages',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
        ],
        name: 'forceResumeReceive',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_version',
                type: 'uint16',
            },
            {
                internalType: 'uint16',
                name: '_chainId',
                type: 'uint16',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_configType',
                type: 'uint256',
            },
        ],
        name: 'getConfig',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_remoteChainId',
                type: 'uint16',
            },
        ],
        name: 'getTrustedRemoteAddress',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'globalPaused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
        ],
        name: 'isTrustedRemote',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'ld2sdRates',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lzEndpoint',
        outputs: [
            {
                internalType: 'contract ILayerZeroEndpoint',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_nonce',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: '_payload',
                type: 'bytes',
            },
        ],
        name: 'lzReceive',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        name: 'minDstGasLookup',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_nonce',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: '_payload',
                type: 'bytes',
            },
        ],
        name: 'nonblockingLzReceive',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'pausedTokens',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'precrime',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address payable',
                        name: 'refundAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'zroPaymentAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct LzLib.CallParams',
                name: '_callParams',
                type: 'tuple',
            },
            {
                internalType: 'bytes',
                name: '_adapterParams',
                type: 'bytes',
            },
        ],
        name: 'quoteForSend',
        outputs: [
            {
                internalType: 'uint256',
                name: 'nativeFee',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'zroFee',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
        ],
        name: 'registerToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_srcAddress',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_nonce',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: '_payload',
                type: 'bytes',
            },
        ],
        name: 'retryMessage',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '_toAddress',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: '_amountLD',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'address payable',
                        name: 'refundAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'zroPaymentAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct LzLib.CallParams',
                name: '_callParams',
                type: 'tuple',
            },
            {
                internalType: 'bytes',
                name: '_adapterParams',
                type: 'bytes',
            },
        ],
        name: 'sendETHToAptos',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: '_toAddress',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: '_amountLD',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'address payable',
                        name: 'refundAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'zroPaymentAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct LzLib.CallParams',
                name: '_callParams',
                type: 'tuple',
            },
            {
                internalType: 'bytes',
                name: '_adapterParams',
                type: 'bytes',
            },
        ],
        name: 'sendToAptos',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_aptosChainId',
                type: 'uint16',
            },
        ],
        name: 'setAptosChainId',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_bridgeFeeBP',
                type: 'uint256',
            },
        ],
        name: 'setBridgeFeeBP',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_version',
                type: 'uint16',
            },
            {
                internalType: 'uint16',
                name: '_chainId',
                type: 'uint16',
            },
            {
                internalType: 'uint256',
                name: '_configType',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_config',
                type: 'bytes',
            },
        ],
        name: 'setConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: '_paused',
                type: 'bool',
            },
        ],
        name: 'setGlobalPause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_dstChainId',
                type: 'uint16',
            },
            {
                internalType: 'uint16',
                name: '_packetType',
                type: 'uint16',
            },
            {
                internalType: 'uint256',
                name: '_minGas',
                type: 'uint256',
            },
        ],
        name: 'setMinDstGas',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_precrime',
                type: 'address',
            },
        ],
        name: 'setPrecrime',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_version',
                type: 'uint16',
            },
        ],
        name: 'setReceiveVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_version',
                type: 'uint16',
            },
        ],
        name: 'setSendVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '_paused',
                type: 'bool',
            },
        ],
        name: 'setTokenPause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_srcChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_path',
                type: 'bytes',
            },
        ],
        name: 'setTrustedRemote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '_remoteChainId',
                type: 'uint16',
            },
            {
                internalType: 'bytes',
                name: '_remoteAddress',
                type: 'bytes',
            },
        ],
        name: 'setTrustedRemoteAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: '_useCustomAdapterParams',
                type: 'bool',
            },
        ],
        name: 'setUseCustomAdapterParams',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_weth',
                type: 'address',
            },
        ],
        name: 'setWETH',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'supportedTokens',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        name: 'trustedRemoteLookup',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'tvlSDs',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'useCustomAdapterParams',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'weth',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
        ],
        name: 'withdrawEmergency',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amountLD',
                type: 'uint256',
            },
        ],
        name: 'withdrawFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_amountSD',
                type: 'uint64',
            },
        ],
        name: 'withdrawTVL',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];
class ITokenBridge__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.ITokenBridge__factory = ITokenBridge__factory;
ITokenBridge__factory.abi = _abi;
