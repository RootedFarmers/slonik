"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const pg_1 = require("pg");
const createIntegrationTests_1 = require("../../helpers/createIntegrationTests");
const { TEST_NATIVE_DRIVER, } = process.env;
if (TEST_NATIVE_DRIVER === 'true') {
    const testRunner = (0, createIntegrationTests_1.createTestRunner)(pg_1.native, 'pg_native');
    (0, createIntegrationTests_1.createIntegrationTests)(testRunner.test, pg_1.native);
}
else {
    ava_1.default.todo('pg-native integration tests are disabled; configure TEST_NATIVE_DRIVER=true to enable them');
}
//# sourceMappingURL=pg-native.js.map