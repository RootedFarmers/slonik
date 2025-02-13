"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSqlToken = void 0;
const tokens_1 = require("../tokens");
const Tokens = [
    tokens_1.ArrayToken,
    tokens_1.BinaryToken,
    tokens_1.ComparisonPredicateToken,
    tokens_1.IdentifierToken,
    tokens_1.JsonToken,
    tokens_1.ListToken,
    tokens_1.SqlToken,
    tokens_1.UnnestToken,
];
const isSqlToken = (subject) => {
    if (typeof subject !== 'object' || subject === null) {
        return false;
    }
    return Tokens.includes(subject.type);
};
exports.isSqlToken = isSqlToken;
//# sourceMappingURL=isSqlToken.js.map