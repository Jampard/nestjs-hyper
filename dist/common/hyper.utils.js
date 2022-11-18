"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateString = exports.handleRetry = exports.getPoolToken = exports.getPoolName = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const operators_1 = require("rxjs/operators");
const hyper_constants_1 = require("../hyper.constants");
const logger = new common_1.Logger('HyperModule');
function getPoolName(options) {
    return options && options.name ? options.name : hyper_constants_1.DEFAULT_POOL_NAME;
}
exports.getPoolName = getPoolName;
function getPoolToken(options = hyper_constants_1.DEFAULT_POOL_NAME) {
    const name = typeof options === 'string' ? options : getPoolName(options);
    return `${name}HyperPool`;
}
exports.getPoolToken = getPoolToken;
function handleRetry(retryAttempts = 9, retryDelay = 3000, poolName = hyper_constants_1.DEFAULT_POOL_NAME, verboseRetryLog = false, toRetry) {
    return (source) => source.pipe((0, operators_1.retryWhen)((e) => e.pipe((0, operators_1.scan)((errorCount, error) => {
        if (toRetry && !toRetry(error)) {
            throw error;
        }
        const poolInfo = poolName === hyper_constants_1.DEFAULT_POOL_NAME ? '' : ` (${poolName})`;
        const verboseMessage = verboseRetryLog
            ? ` Message: ${error.message}.`
            : '';
        logger.error(`Unable to connect to the database${poolInfo}.${verboseMessage} Retrying (${errorCount + 1})...`, error.stack);
        if (errorCount + 1 >= retryAttempts) {
            throw error;
        }
        return errorCount + 1;
    }, 0), (0, operators_1.delay)(retryDelay))));
}
exports.handleRetry = handleRetry;
const generateString = () => (0, uuid_1.v4)();
exports.generateString = generateString;
