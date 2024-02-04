import { liveTimeStamp } from '../types';
export function getTxProgress(tx) {
    if (!tx.submittedDate || !tx.expectedDate)
        return 0;
    if (tx.error)
        return 0;
    const now = liveTimeStamp();
    const elapsed = Math.max(now - tx.submittedDate, 0);
    const duration = Math.max(tx.expectedDate - tx.submittedDate, 0);
    const progress = elapsed / duration;
    if (!isFinite(progress))
        return 0;
    return Math.min(progress, 1);
}
export function getTxRemainingTime(tx) {
    if (!tx.expectedDate)
        return undefined;
    const now = liveTimeStamp();
    const remaining = tx.expectedDate - now;
    if (!Number.isFinite(remaining))
        return undefined;
    return Math.max(remaining, 0);
}
