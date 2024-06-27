"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const roarr_1 = require("roarr");
const sinon_1 = __importDefault(require("sinon"));
const errors_1 = require("../../../src/errors");
const executeQuery_1 = require("../../../src/routines/executeQuery");
const createClientConfiguration_1 = require("../../helpers/createClientConfiguration");
const createErrorWithCode_1 = require("../../helpers/createErrorWithCode");
const test = ava_1.default;
const beforeEach = test.beforeEach;
const createConnectionStub = () => {
    return {
        connection: {
            slonik: {
                terminated: null,
            },
        },
        off() { },
        on() { },
    };
};
beforeEach((t) => {
    t.context.logger = roarr_1.Roarr;
    t.context.connection = createConnectionStub();
    t.context.executionRoutine = () => { };
});
test('throws a descriptive error if query is empty', async (t) => {
    const error = await t.throwsAsync(() => {
        return (0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, (0, createClientConfiguration_1.createClientConfiguration)(), '', [], 'foo', t.context.executionRoutine);
    });
    t.true(error instanceof errors_1.InvalidInputError);
    t.is(error === null || error === void 0 ? void 0 : error.message, 'Unexpected SQL input. Query cannot be empty.');
});
test('throws a descriptive error if the entire query is a value binding', async (t) => {
    const error = await t.throwsAsync(() => {
        return (0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, (0, createClientConfiguration_1.createClientConfiguration)(), '$1', [], 'foo', t.context.executionRoutine);
    });
    t.true(error instanceof errors_1.InvalidInputError);
    t.is(error === null || error === void 0 ? void 0 : error.message, 'Unexpected SQL input. Query cannot be empty. Found only value binding.');
});
test('retries an implicit query that failed due to a transaction error', async (t) => {
    const executionRoutineStub = sinon_1.default.stub();
    executionRoutineStub.onFirstCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'))
        .onSecondCall()
        .resolves({
        command: 'SELECT',
        fields: [],
        notices: [],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
    });
    const result = await (0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, (0, createClientConfiguration_1.createClientConfiguration)(), 'SELECT 1 AS foo', [], 'foo', executionRoutineStub);
    t.is(executionRoutineStub.callCount, 2);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [],
        notices: [],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
    });
});
test('returns the thrown transaction error if the retry limit is reached', async (t) => {
    const executionRoutineStub = sinon_1.default.stub();
    executionRoutineStub.onFirstCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'))
        .onSecondCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'));
    const clientConfiguration = (0, createClientConfiguration_1.createClientConfiguration)();
    const error = await t.throwsAsync((0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, {
        ...clientConfiguration,
        queryRetryLimit: 1,
    }, 'SELECT 1 AS foo', [], 'foo', executionRoutineStub));
    t.is(executionRoutineStub.callCount, 2);
    t.true(error instanceof Error);
    t.is(error.code, '40P01');
});
test('transaction errors are not handled if the function was called by a transaction', async (t) => {
    const executionRoutineStub = sinon_1.default.stub();
    executionRoutineStub.onFirstCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'));
    t.context.connection.connection.slonik.transactionId = 'foobar';
    const clientConfiguration = (0, createClientConfiguration_1.createClientConfiguration)();
    const error = await t.throwsAsync((0, executeQuery_1.executeQuery)(t.context.logger, t.context.connection, {
        ...clientConfiguration,
        queryRetryLimit: 1,
    }, 'SELECT 1 AS foo', [], 'foo', executionRoutineStub));
    t.is(executionRoutineStub.callCount, 1);
    t.true(error instanceof Error);
    t.is(error.code, '40P01');
});
//# sourceMappingURL=executeQuery.js.map