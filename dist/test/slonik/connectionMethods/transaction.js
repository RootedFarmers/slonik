"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sinon_1 = __importDefault(require("sinon"));
const createClientConfiguration_1 = require("../../helpers/createClientConfiguration");
const createErrorWithCode_1 = require("../../helpers/createErrorWithCode");
const createPool_1 = require("../../helpers/createPool");
(0, ava_1.default)('commits successful transaction', async (t) => {
    const pool = (0, createPool_1.createPool)();
    await pool.transaction(async () => { });
    t.is(pool.querySpy.getCall(0).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(1).args[0], 'COMMIT');
});
(0, ava_1.default)('rollbacks unsuccessful transaction', async (t) => {
    const pool = (0, createPool_1.createPool)();
    await t.throwsAsync(pool.transaction(async () => {
        return Promise.reject(new Error('foo'));
    }));
    t.is(pool.querySpy.getCall(0).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(1).args[0], 'ROLLBACK');
});
(0, ava_1.default)('retries a transaction that failed due to a transaction error', async (t) => {
    const pool = (0, createPool_1.createPool)((0, createClientConfiguration_1.createClientConfiguration)());
    const handlerStub = sinon_1.default.stub();
    handlerStub.onFirstCall()
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
    const result = await pool.transaction(handlerStub);
    t.is(handlerStub.callCount, 2);
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
(0, ava_1.default)('commits successful transaction with retries', async (t) => {
    const pool = (0, createPool_1.createPool)((0, createClientConfiguration_1.createClientConfiguration)());
    const handlerStub = sinon_1.default.stub();
    handlerStub.onFirstCall()
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
    await pool.transaction(handlerStub);
    t.is(pool.querySpy.getCall(0).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(1).args[0], 'ROLLBACK');
    t.is(pool.querySpy.getCall(2).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(3).args[0], 'COMMIT');
});
(0, ava_1.default)('returns the thrown transaction error if the retry limit is reached', async (t) => {
    const pool = (0, createPool_1.createPool)((0, createClientConfiguration_1.createClientConfiguration)());
    const handlerStub = sinon_1.default.stub();
    handlerStub.onFirstCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'))
        .onSecondCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'));
    const error = await t.throwsAsync(pool.transaction(handlerStub, 1));
    t.is(handlerStub.callCount, 2);
    t.true(error instanceof Error);
    t.is(error.code, '40P01');
});
(0, ava_1.default)('rollbacks unsuccessful transaction with retries', async (t) => {
    const pool = (0, createPool_1.createPool)((0, createClientConfiguration_1.createClientConfiguration)());
    const handlerStub = sinon_1.default.stub();
    handlerStub.onFirstCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'))
        .onSecondCall()
        .rejects((0, createErrorWithCode_1.createErrorWithCode)('40P01'));
    await t.throwsAsync(pool.transaction(handlerStub, 1));
    t.is(pool.querySpy.getCall(0).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(1).args[0], 'ROLLBACK');
    t.is(pool.querySpy.getCall(2).args[0], 'START TRANSACTION');
    t.is(pool.querySpy.getCall(3).args[0], 'ROLLBACK');
});
//# sourceMappingURL=transaction.js.map