"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorOfApiError = exports.isErrorOfAccountNotFound = exports.isErrorOfTableItemNotFound = exports.isErrorOfResourceNotFound = void 0;
function isErrorOfResourceNotFound(e) {
    return hasErrorCode(e, 'resource_not_found');
}
exports.isErrorOfResourceNotFound = isErrorOfResourceNotFound;
function isErrorOfTableItemNotFound(e) {
    return hasErrorCode(e, 'table_item_not_found');
}
exports.isErrorOfTableItemNotFound = isErrorOfTableItemNotFound;
function isErrorOfAccountNotFound(e) {
    return hasErrorCode(e, 'account_not_found');
}
exports.isErrorOfAccountNotFound = isErrorOfAccountNotFound;
function isErrorOfApiError(e, status) {
    if (e instanceof Error) {
        const err = e;
        if (err.status === status) {
            return true;
        }
    }
    return false;
}
exports.isErrorOfApiError = isErrorOfApiError;
function hasErrorCode(e, errorCode) {
    if (!e)
        return false;
    // todo: SDK is not stable - this is a workaround
    if (e.error_code === errorCode)
        return true;
    if (e.errorCode === errorCode)
        return true;
    const body = e.body;
    if (!body)
        return false;
    if (body.error_code === errorCode)
        return true;
    if (body.errorCode === errorCode)
        return true;
    return false;
}
