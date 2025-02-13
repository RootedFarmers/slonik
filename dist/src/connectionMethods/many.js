"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.many = void 0;
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const query_1 = require("./query");
/**
 * Makes a query and expects at least 1 result.
 *
 * @throws NotFoundError If query returns no rows.
 */
const many = async (log, connection, clientConfiguration, rawSql, values, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, utilities_1.createQueryId)();
    const { rows, } = await (0, query_1.query)(log, connection, clientConfiguration, rawSql, values, queryId);
    if (rows.length === 0) {
        log.error({
            queryId,
        }, 'NotFoundError');
        throw new errors_1.NotFoundError();
    }
    return rows;
};
exports.many = many;
//# sourceMappingURL=many.js.map