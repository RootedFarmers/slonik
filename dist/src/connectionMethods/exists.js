"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const query_1 = require("./query");
const exists = async (log, connection, clientConfiguration, rawSql, values, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, utilities_1.createQueryId)();
    const { rows, } = await (0, query_1.query)(log, connection, clientConfiguration, 'SELECT EXISTS(' + rawSql + ')', values, queryId);
    if (rows.length !== 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError();
    }
    return Boolean(rows[0].exists);
};
exports.exists = exists;
//# sourceMappingURL=exists.js.map