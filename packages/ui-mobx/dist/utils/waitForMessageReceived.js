var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from '@layerzerolabs/scan-client';
export function waitForMessageReceived(srcChainId, srcTxHash, pollInterval = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        const env = srcChainId < 10000 ? 'mainnet' : srcChainId < 20000 ? 'testnet' : 'sandbox';
        const client = createClient(env);
        while (true) {
            try {
                const { messages } = yield client.getMessagesBySrcTxHash(srcTxHash);
                const message = messages[0];
                if (messages.length > 1) {
                    return Promise.reject(new Error(`More than one message`));
                }
                else if ((message === null || message === void 0 ? void 0 : message.status) === 'FAILED') {
                    return Promise.reject(new Error(`Message failed ${message.dstTxError}`));
                }
                else if ((message === null || message === void 0 ? void 0 : message.status) === 'DELIVERED') {
                    return message;
                }
            }
            catch (_a) {
                // http error
            }
            yield sleep(pollInterval);
        }
    });
}
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
