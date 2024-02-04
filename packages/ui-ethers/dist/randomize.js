"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomWeighted = exports.randomizeOrder = void 0;
const lodash_1 = require("lodash");
function randomizeOrder(items) {
    let remaining = items.slice();
    const result = [];
    while (remaining.length > 1) {
        const item = randomWeighted(remaining);
        result.push(item);
        remaining = (0, lodash_1.without)(remaining, item);
    }
    result.push(...remaining);
    return result;
}
exports.randomizeOrder = randomizeOrder;
function randomWeighted(objects, defaultWeight = 1) {
    var _a;
    const totalWeight = objects.reduce((agg, object) => { var _a; return agg + ((_a = object.weight) !== null && _a !== void 0 ? _a : defaultWeight); }, 0);
    const randomNumber = Math.random() * totalWeight;
    let weightSum = 0;
    for (let object of objects) {
        weightSum += (_a = object.weight) !== null && _a !== void 0 ? _a : defaultWeight;
        if (randomNumber <= weightSum)
            return object;
    }
    return undefined;
}
exports.randomWeighted = randomWeighted;
