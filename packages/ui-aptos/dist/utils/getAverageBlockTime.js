"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aptos_1 = require("aptos");
/**
 * @returns seconds
 */
const getAverageBlockTime = async (blockWindow, client = new aptos_1.AptosClient('https://fullnode.mainnet.aptoslabs.com/v1')) => {
    const ledgerInfo = await client.getLedgerInfo();
    const latestBlockNumber = Number(ledgerInfo.block_height);
    const previousBlock = await client.getBlockByHeight(latestBlockNumber - blockWindow, false);
    // aptos timestamp is microseconds
    const timeElapsedSec = Number(ledgerInfo.ledger_timestamp) / 1000000 -
        Number(previousBlock.block_timestamp) / 1000000;
    const averageBlockTimeSec = timeElapsedSec / blockWindow;
    return averageBlockTimeSec;
};
