"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosResourceProvider = void 0;
const assert_1 = __importDefault(require("assert"));
const isAptosAddress_1 = require("./utils/isAptosAddress");
const errors_1 = require("./utils/errors");
const p_memoize_1 = __importDefault(require("p-memoize"));
const expiry_map_1 = __importDefault(require("expiry-map"));
class AptosResourceProvider {
    constructor(aptosClient, cacheMs = 1000) {
        this.aptosClient = aptosClient;
        this.cacheMs = cacheMs;
        this.getAccountResources = (0, p_memoize_1.default)(async (address) => {
            try {
                (0, assert_1.default)((0, isAptosAddress_1.isAptosAddress)(address));
                const resources = await this.aptosClient.getAccountResources(address);
                return resources;
            }
            catch (e) {
                if ((0, errors_1.isErrorOfAccountNotFound)(e))
                    return [];
                throw e;
            }
        }, { cacheKey: ([address]) => address, cache: new expiry_map_1.default(this.cacheMs) });
    }
}
exports.AptosResourceProvider = AptosResourceProvider;
