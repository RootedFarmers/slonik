"use strict";
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable fp/no-class */
/* eslint-disable fp/no-this */
/* eslint-disable id-match */
/* eslint-disable promise/prefer-await-to-callbacks */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStream = void 0;
const stream_1 = require("stream");
const pg_cursor_1 = __importDefault(require("pg-cursor"));
/**
 * @see https://github.com/brianc/node-pg-query-stream
 * @see https://github.com/brianc/node-pg-query-stream/issues/51
 */
class QueryStream extends stream_1.Readable {
    // @ts-expect-error
    constructor(text, values, options) {
        super({
            objectMode: true,
            ...options,
        });
        this.cursor = new pg_cursor_1.default(text, values);
        this._reading = false;
        this._closed = false;
        this.batchSize = (options || {}).batchSize || 100;
        // delegate Submittable callbacks to cursor
        this.handleRowDescription = this.cursor.handleRowDescription.bind(this.cursor);
        this.handleDataRow = this.cursor.handleDataRow.bind(this.cursor);
        this.handlePortalSuspended = this.cursor.handlePortalSuspended.bind(this.cursor);
        this.handleCommandComplete = this.cursor.handleCommandComplete.bind(this.cursor);
        this.handleReadyForQuery = this.cursor.handleReadyForQuery.bind(this.cursor);
        this.handleError = this.cursor.handleError.bind(this.cursor);
        // pg client sets types via _result property
        this._result = this.cursor._result;
    }
    submit(connection) {
        this.cursor.submit(connection);
    }
    close(callback) {
        this._closed = true;
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const close = () => {
            this.emit('close');
        };
        this.cursor.close(callback || close);
    }
    _read(size) {
        if (this._reading || this._closed) {
            return;
        }
        this._reading = true;
        const readAmount = Math.max(size, this.batchSize);
        this.cursor.read(readAmount, (error, rows, result) => {
            if (this._closed) {
                return;
            }
            if (error) {
                this.emit('error', error);
                return;
            }
            if (!rows.length) {
                this._closed = true;
                setImmediate(() => {
                    this.emit('close');
                });
                this.push(null);
                return;
            }
            // push each row into the stream
            this._reading = false;
            for (const row of rows) {
                this.push({
                    fields: (result.fields || []).map((field) => {
                        return {
                            dataTypeId: field.dataTypeID,
                            name: field.name,
                        };
                    }),
                    row,
                });
            }
        });
    }
}
exports.QueryStream = QueryStream;
//# sourceMappingURL=QueryStream.js.map