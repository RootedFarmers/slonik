"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleMovedToAnotherPartitionError = exports.UniqueIntegrityConstraintViolationError = exports.UnexpectedStateError = exports.StatementTimeoutError = exports.StatementCancelledError = exports.SlonikError = exports.NotNullIntegrityConstraintViolationError = exports.NotFoundError = exports.InvalidInputError = exports.InvalidConfigurationError = exports.IntegrityConstraintViolationError = exports.ForeignKeyIntegrityConstraintViolationError = exports.DataIntegrityError = exports.ConnectionError = exports.CheckIntegrityConstraintViolationError = exports.BackendTerminatedError = exports.stringifyDsn = exports.parseDsn = exports.isSqlToken = exports.createTypeParserPreset = exports.createSqlTokenSqlFragment = exports.createSqlTag = exports.createPool = exports.createMockQueryResult = exports.createMockPool = exports.sql = void 0;
const factories_1 = require("./factories");
exports.sql = (0, factories_1.createSqlTag)();
var factories_2 = require("./factories");
Object.defineProperty(exports, "createMockPool", { enumerable: true, get: function () { return factories_2.createMockPool; } });
Object.defineProperty(exports, "createMockQueryResult", { enumerable: true, get: function () { return factories_2.createMockQueryResult; } });
Object.defineProperty(exports, "createPool", { enumerable: true, get: function () { return factories_2.createPool; } });
Object.defineProperty(exports, "createSqlTag", { enumerable: true, get: function () { return factories_2.createSqlTag; } });
Object.defineProperty(exports, "createSqlTokenSqlFragment", { enumerable: true, get: function () { return factories_2.createSqlTokenSqlFragment; } });
Object.defineProperty(exports, "createTypeParserPreset", { enumerable: true, get: function () { return factories_2.createTypeParserPreset; } });
var utilities_1 = require("./utilities");
Object.defineProperty(exports, "isSqlToken", { enumerable: true, get: function () { return utilities_1.isSqlToken; } });
Object.defineProperty(exports, "parseDsn", { enumerable: true, get: function () { return utilities_1.parseDsn; } });
Object.defineProperty(exports, "stringifyDsn", { enumerable: true, get: function () { return utilities_1.stringifyDsn; } });
__exportStar(require("./factories/typeParsers"), exports);
var errors_1 = require("./errors");
Object.defineProperty(exports, "BackendTerminatedError", { enumerable: true, get: function () { return errors_1.BackendTerminatedError; } });
Object.defineProperty(exports, "CheckIntegrityConstraintViolationError", { enumerable: true, get: function () { return errors_1.CheckIntegrityConstraintViolationError; } });
Object.defineProperty(exports, "ConnectionError", { enumerable: true, get: function () { return errors_1.ConnectionError; } });
Object.defineProperty(exports, "DataIntegrityError", { enumerable: true, get: function () { return errors_1.DataIntegrityError; } });
Object.defineProperty(exports, "ForeignKeyIntegrityConstraintViolationError", { enumerable: true, get: function () { return errors_1.ForeignKeyIntegrityConstraintViolationError; } });
Object.defineProperty(exports, "IntegrityConstraintViolationError", { enumerable: true, get: function () { return errors_1.IntegrityConstraintViolationError; } });
Object.defineProperty(exports, "InvalidConfigurationError", { enumerable: true, get: function () { return errors_1.InvalidConfigurationError; } });
Object.defineProperty(exports, "InvalidInputError", { enumerable: true, get: function () { return errors_1.InvalidInputError; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return errors_1.NotFoundError; } });
Object.defineProperty(exports, "NotNullIntegrityConstraintViolationError", { enumerable: true, get: function () { return errors_1.NotNullIntegrityConstraintViolationError; } });
Object.defineProperty(exports, "SlonikError", { enumerable: true, get: function () { return errors_1.SlonikError; } });
Object.defineProperty(exports, "StatementCancelledError", { enumerable: true, get: function () { return errors_1.StatementCancelledError; } });
Object.defineProperty(exports, "StatementTimeoutError", { enumerable: true, get: function () { return errors_1.StatementTimeoutError; } });
Object.defineProperty(exports, "UnexpectedStateError", { enumerable: true, get: function () { return errors_1.UnexpectedStateError; } });
Object.defineProperty(exports, "UniqueIntegrityConstraintViolationError", { enumerable: true, get: function () { return errors_1.UniqueIntegrityConstraintViolationError; } });
Object.defineProperty(exports, "TupleMovedToAnotherPartitionError", { enumerable: true, get: function () { return errors_1.TupleMovedToAnotherPartitionError; } });
//# sourceMappingURL=index.js.map