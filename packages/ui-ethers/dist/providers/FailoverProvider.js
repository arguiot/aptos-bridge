"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailoverProvider = void 0;
const providers_1 = require("@ethersproject/providers");
const logger_1 = require("@ethersproject/logger");
const logger = new logger_1.Logger('0.0.1');
class FailoverProvider extends providers_1.BaseProvider {
    constructor(providers, network) {
        super(Promise.resolve(network));
        this.maxAttempts = 3;
        const providerConfigs = providers.map((providerOrConfig) => {
            if (providers_1.Provider.isProvider(providerOrConfig)) {
                const config = {
                    provider: providerOrConfig,
                };
                return config;
            }
            const config = {
                provider: providerOrConfig.provider,
            };
            return config;
        });
        const providerEntries = new Map();
        providerConfigs.forEach((config) => {
            const entry = {
                provider: config.provider,
                errors: [],
            };
            providerEntries.set(config.provider, entry);
        });
        this.providerConfigs = providerConfigs;
        this.providerEntries = providerEntries;
        this.orderedProviderEntries = Array.from(providerEntries.values());
    }
    async detectNetwork() {
        return this.network;
    }
    async perform(method, params) {
        let attempt = 0;
        while (++attempt <= this.maxAttempts) {
            const provider = this.getProvider();
            if (attempt > 1) {
                logger.warn(`Attempt ${attempt}`, { provider });
            }
            try {
                return await provider.perform(method, params);
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.code) === 'UNPREDICTABLE_GAS_LIMIT') {
                    // most likely smart contract error
                    throw error;
                }
                logger.warn(`Attempt ${attempt} failed`, error);
                this.handleError(provider, error);
                if (attempt >= this.maxAttempts) {
                    throw error;
                }
            }
        }
    }
    getProvider() {
        return this.orderedProviderEntries[0].provider;
    }
    handleError(provider, error) {
        const entry = this.getEntry(provider);
        entry.errors.push(error);
        this.updateOrder();
    }
    getEntry(provider) {
        return this.providerEntries.get(provider);
    }
    updateOrder() {
        const currentProvider = this.getProvider();
        // sort by least errors
        this.orderedProviderEntries.sort((a, b) => a.errors.length - b.errors.length);
        const nextProvider = this.getProvider();
        if (nextProvider !== currentProvider) {
            logger.warn(`Next provider`, { currentProvider, nextProvider });
        }
    }
}
exports.FailoverProvider = FailoverProvider;
