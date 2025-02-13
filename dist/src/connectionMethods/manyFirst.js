"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manyFirst = void 0;
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const many_1 = require("./many");
const manyFirst = async (log, connection, clientConfigurationType, rawSql, values, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : (0, utilities_1.createQueryId)();
    const rows = await (0, many_1.many)(log, connection, clientConfigurationType, rawSql, values, queryId);
    if (rows.length === 0) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError();
    }
    const keys = Object.keys(rows[0]);
    if (keys.length !== 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError();
    }
    const firstColumnName = keys[0];
    return rows.map((row) => {
        return row[firstColumnName];
    });
};
exports.manyFirst = manyFirst;
//# sourceMappingURL=manyFirst.js.map