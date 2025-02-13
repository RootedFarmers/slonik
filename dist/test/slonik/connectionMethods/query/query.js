"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const delay_1 = __importDefault(require("delay"));
const sinon_1 = __importDefault(require("sinon"));
const errors_1 = require("../../../../src/errors");
const createSqlTag_1 = require("../../../../src/factories/createSqlTag");
const createErrorWithCode_1 = require("../../../helpers/createErrorWithCode");
const createPool_1 = require("../../../helpers/createPool");
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('ends connection after promise is resolved (explicit connection)', async (t) => {
    const eventHandler = sinon_1.default.spy();
    process.on('warning', eventHandler);
    const pool = (0, createPool_1.createPool)();
    await pool.connect(async (connection) => {
        let queryCount = 20;
        const queries = [];
        while (queryCount-- > 0) {
            queries.push(connection.query(sql `SELECT 1`));
        }
        await Promise.all(queries);
    });
    // Not entirely clear why delay is needed here,
    // but event is not emitted straight after the transaction completes.
    await (0, delay_1.default)(100);
    t.false(eventHandler.called);
});
(0, ava_1.default)('executes the query and returns the result', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.returns({
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
    const result = await pool.query(sql `SELECT 1`);
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
(0, ava_1.default)('adds notices observed during the query execution to the query result object', async (t) => {
    const pool = (0, createPool_1.createPool)();
    let resolveQuery;
    pool.querySpy.reset();
    pool.querySpy.callsFake(() => {
        return new Promise((resolve) => {
            resolveQuery = resolve;
        });
    });
    const queryResultPromise = pool.query(sql `SELECT 1`);
    await (0, delay_1.default)(100);
    t.is(pool.querySpy.callCount, 1);
    pool.connection.emit('notice', 'foo');
    pool.connection.emit('notice', 'bar');
    if (!resolveQuery) {
        throw new Error('Unexpected state.');
    }
    resolveQuery({
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
    await (0, delay_1.default)(100);
    t.is(pool.querySpy.callCount, 1);
    t.deepEqual(await queryResultPromise, {
        command: 'SELECT',
        fields: [],
        notices: [
            'foo',
            'bar',
        ],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
    });
});
(0, ava_1.default)('maps 23514 error code to CheckIntegrityConstraintViolationError', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('23514'));
    const error = await t.throwsAsync(pool.query(sql `SELECT 1`));
    t.true(error instanceof errors_1.CheckIntegrityConstraintViolationError);
});
(0, ava_1.default)('maps 23503 error code to ForeignKeyIntegrityConstraintViolationError', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('23503'));
    const error = await t.throwsAsync(pool.query(sql `SELECT 1`));
    t.true(error instanceof errors_1.ForeignKeyIntegrityConstraintViolationError);
});
(0, ava_1.default)('maps 23502 error code to NotNullIntegrityConstraintViolationError', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('23502'));
    const error = await t.throwsAsync(pool.query(sql `SELECT 1`));
    t.true(error instanceof errors_1.NotNullIntegrityConstraintViolationError);
});
(0, ava_1.default)('maps 23505 error code to UniqueIntegrityConstraintViolationError', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('23505'));
    const error = await t.throwsAsync(pool.query(sql `SELECT 1`));
    t.true(error instanceof errors_1.UniqueIntegrityConstraintViolationError);
});
(0, ava_1.default)('57P01 error causes the connection to be rejected (IMPLICIT_QUERY connection)', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('57P01'));
    const error = await t.throwsAsync(pool.query(sql `SELECT 1`));
    t.true(error instanceof errors_1.BackendTerminatedError);
});
// @todo https://github.com/gajus/slonik/issues/39
// eslint-disable-next-line ava/no-skip-test
ava_1.default.skip('57P01 error causes the connection to be rejected (EXPLICIT connection)', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.rejects((0, createErrorWithCode_1.createErrorWithCode)('57P01'));
    const spy = sinon_1.default.spy();
    const error = await t.throwsAsync(pool.connect(async (connection) => {
        try {
            await connection.query(sql `SELECT 1`);
        }
        catch (_a) {
            //
        }
        spy();
    }));
    t.true(error instanceof errors_1.BackendTerminatedError);
    t.true(spy.called);
});
//# sourceMappingURL=query.js.map