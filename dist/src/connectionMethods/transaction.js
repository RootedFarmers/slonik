"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = void 0;
const serialize_error_1 = require("serialize-error");
const binders_1 = require("../binders");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const execTransaction = async (parentLog, connection, clientConfiguration, handler) => {
    if (connection.connection.slonik.mock === false) {
        await connection.query('START TRANSACTION');
    }
    try {
        const result = await handler((0, binders_1.bindTransactionConnection)(parentLog, connection, clientConfiguration, connection.connection.slonik.transactionDepth));
        if (connection.connection.slonik.terminated) {
            throw new errors_1.BackendTerminatedError(connection.connection.slonik.terminated);
        }
        if (connection.connection.slonik.mock === false) {
            await connection.query('COMMIT');
        }
        return result;
    }
    catch (error) {
        if (!connection.connection.slonik.terminated) {
            if (connection.connection.slonik.mock === false) {
                await connection.query('ROLLBACK');
            }
            parentLog.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'rolling back transaction due to an error');
        }
        throw error;
    }
};
const retryTransaction = async (parentLog, connection, clientConfiguration, handler, transactionRetryLimit) => {
    let remainingRetries = transactionRetryLimit !== null && transactionRetryLimit !== void 0 ? transactionRetryLimit : clientConfiguration.transactionRetryLimit;
    let attempt = 0;
    let result;
    while (remainingRetries-- > 0) {
        attempt++;
        try {
            parentLog.trace({
                attempt,
                transactionId: connection.connection.slonik.transactionId,
            }, 'retrying transaction');
            result = await execTransaction(parentLog, connection, clientConfiguration, handler);
            // If the attempt succeeded break out of the loop
            break;
        }
        catch (error) {
            if (typeof error.code === 'string' && error.code.startsWith(constants_1.TRANSACTION_ROLLBACK_ERROR_PREFIX) && remainingRetries > 0) {
                continue;
            }
            throw error;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result;
};
const transaction = async (parentLog, connection, clientConfiguration, handler, transactionRetryLimit) => {
    if (connection.connection.slonik.transactionDepth !== null) {
        throw new errors_1.UnexpectedStateError('Cannot use the same connection to start a new transaction before completing the last transaction.');
    }
    connection.connection.slonik.transactionDepth = 0;
    connection.connection.slonik.transactionId = (0, utilities_1.createUid)();
    const log = parentLog.child({
        transactionId: connection.connection.slonik.transactionId,
    });
    try {
        return await execTransaction(log, connection, clientConfiguration, handler);
    }
    catch (error) {
        const transactionRetryLimitToUse = transactionRetryLimit !== null && transactionRetryLimit !== void 0 ? transactionRetryLimit : clientConfiguration.transactionRetryLimit;
        const shouldRetry = typeof error.code === 'string' && error.code.startsWith(constants_1.TRANSACTION_ROLLBACK_ERROR_PREFIX) && transactionRetryLimitToUse > 0;
        if (shouldRetry) {
            return await retryTransaction(log, connection, clientConfiguration, handler, transactionRetryLimit);
        }
        else {
            throw error;
        }
    }
    finally {
        connection.connection.slonik.transactionDepth = null;
        connection.connection.slonik.transactionId = null;
    }
};
exports.transaction = transaction;
//# sourceMappingURL=transaction.js.map