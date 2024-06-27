"use strict";
// @flow
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommentedOutBindings = void 0;
const pg_minify_1 = __importDefault(require("pg-minify"));
const matchAllBindings = (sql) => {
    return Array
        .from(sql.matchAll(/(\$\d+)/g))
        .map((match) => {
        return Number(match[0].slice(1));
    })
        .sort((a, b) => {
        return a - b;
    });
};
const removeCommentedOutBindings = (query) => {
    const minifiedSql = (0, pg_minify_1.default)(query.sql);
    const originalBindings = matchAllBindings(query.sql);
    const actualBindings = matchAllBindings(minifiedSql);
    let finalSql = minifiedSql;
    const finalValues = [];
    let lastFoundBinding = 0;
    for (const originalBinding of originalBindings) {
        if (actualBindings.includes(originalBinding)) {
            lastFoundBinding = originalBinding;
            finalValues.push(query.values[originalBinding - 1]);
            continue;
        }
        const greatestBounding = lastFoundBinding;
        finalSql = finalSql.replace(/(\$\d+)/g, (match) => {
            const matchedBinding = Number(match.slice(1));
            if (matchedBinding > greatestBounding) {
                return '$' + String(matchedBinding - 1);
            }
            else {
                return match;
            }
        });
    }
    return {
        sql: finalSql,
        values: finalValues,
    };
};
exports.removeCommentedOutBindings = removeCommentedOutBindings;
//# sourceMappingURL=removeCommentedOutBindings.js.map