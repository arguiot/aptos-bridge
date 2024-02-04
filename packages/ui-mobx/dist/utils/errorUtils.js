const handledErrors = new WeakSet();
function isHandled(e) {
    if (e && typeof e === 'object') {
        return handledErrors.has(e);
    }
    return undefined;
}
function markAsHandled(e) {
    if (e && typeof e === 'object') {
        handledErrors.add(e);
    }
}
/**
 * Ensures error is displayed only once
 */
export function displayError(e, displayErrorHandler) {
    if (isHandled(e))
        return;
    markAsHandled(e);
    displayErrorHandler();
}
