"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTupleList = void 0;
const stream_1 = require("stream");
const concat_stream_1 = __importDefault(require("concat-stream"));
const pg_copy_streams_binary_1 = require("pg-copy-streams-binary");
const encodeTupleList = (tupleList, columnTypes) => {
    return new Promise((resolve, reject) => {
        const concatStream = (0, concat_stream_1.default)((payloadBuffer) => {
            resolve(payloadBuffer);
        });
        const encode = (0, pg_copy_streams_binary_1.rowWriter)();
        const tupleStream = new stream_1.Readable({
            objectMode: true,
        });
        tupleStream
            .pipe(encode)
            .pipe(concatStream)
            .on('error', (error) => {
            reject(error);
        });
        let lastTupleSize;
        for (const tuple of tupleList) {
            if (typeof lastTupleSize === 'number' && lastTupleSize !== tuple.length) {
                throw new Error('Each tuple in a list of tuples must have an equal number of members.');
            }
            if (tuple.length !== columnTypes.length) {
                throw new Error('Column types length must match tuple member length.');
            }
            lastTupleSize = tuple.length;
            const payload = new Array(lastTupleSize);
            let tupleColumnIndex = -1;
            while (tupleColumnIndex++ < lastTupleSize - 1) {
                payload[tupleColumnIndex] = {
                    type: columnTypes[tupleColumnIndex],
                    value: tuple[tupleColumnIndex],
                };
            }
            tupleStream.push(payload);
        }
        tupleStream.push(null);
    });
};
exports.encodeTupleList = encodeTupleList;
//# sourceMappingURL=encodeTupleList.js.map