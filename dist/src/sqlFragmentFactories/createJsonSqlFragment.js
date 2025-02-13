"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonSqlFragment = void 0;
const is_plain_object_1 = require("is-plain-object");
const serialize_error_1 = require("serialize-error");
const Logger_1 = require("../Logger");
const errors_1 = require("../errors");
const log = Logger_1.Logger.child({
    namespace: 'createJsonSqlFragment',
});
const createJsonSqlFragment = (token, greatestParameterPosition) => {
    let value;
    if (token.value === undefined) {
        throw new errors_1.InvalidInputError('JSON payload must not be undefined.');
    }
    else if (token.value === null) {
        value = token.value;
        // @todo Deep check Array.
    }
    else if (!(0, is_plain_object_1.isPlainObject)(token.value) && !Array.isArray(token.value) && !['number', 'string', 'boolean'].includes(typeof token.value)) {
        throw new errors_1.InvalidInputError('JSON payload must be a primitive value or a plain object.');
    }
    else {
        try {
            value = JSON.stringify(token.value);
        }
        catch (error) {
            log.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'payload cannot be stringified');
            throw new errors_1.InvalidInputError('JSON payload cannot be stringified.');
        }
        if (value === undefined) {
            throw new errors_1.InvalidInputError('JSON payload cannot be stringified. The resulting value is undefined.');
        }
    }
    // Do not add `::json` as it will fail if an attempt is made to insert to jsonb-type column.
    return {
        sql: '$' + String(greatestParameterPosition + 1),
        values: [
            value,
        ],
    };
};
exports.createJsonSqlFragment = createJsonSqlFragment;
//# sourceMappingURL=createJsonSqlFragment.js.map