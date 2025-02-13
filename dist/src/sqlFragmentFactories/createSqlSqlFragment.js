"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSqlSqlFragment = void 0;
const errors_1 = require("../errors");
const createSqlSqlFragment = (token, greatestParameterPosition) => {
    let sql = '';
    let leastMatchedParameterPosition = Number.POSITIVE_INFINITY;
    let greatestMatchedParameterPosition = 0;
    sql += token.sql.replace(/\$(\d+)/g, (match, g1) => {
        const parameterPosition = Number.parseInt(g1, 10);
        if (parameterPosition > greatestMatchedParameterPosition) {
            greatestMatchedParameterPosition = parameterPosition;
        }
        if (parameterPosition < leastMatchedParameterPosition) {
            leastMatchedParameterPosition = parameterPosition;
        }
        return '$' + String(parameterPosition + greatestParameterPosition);
    });
    if (greatestMatchedParameterPosition > token.values.length) {
        throw new errors_1.UnexpectedStateError('The greatest parameter position is greater than the number of parameter values.');
    }
    if (leastMatchedParameterPosition !== Number.POSITIVE_INFINITY && leastMatchedParameterPosition !== 1) {
        throw new errors_1.UnexpectedStateError('Parameter position must start at 1.');
    }
    return {
        sql,
        values: token.values,
    };
};
exports.createSqlSqlFragment = createSqlSqlFragment;
//# sourceMappingURL=createSqlSqlFragment.js.map