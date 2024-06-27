"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const removeCommentedOutBindings_1 = require("../../../src/utilities/removeCommentedOutBindings");
(0, ava_1.default)('removes commented out bindings', (t) => {
    t.deepEqual((0, removeCommentedOutBindings_1.removeCommentedOutBindings)({
        sql: 'SELECT $1\n-- $2\n$3',
        values: [
            'foo',
            'bar',
            'baz',
        ],
    }), {
        sql: 'SELECT $1 $2',
        values: [
            'foo',
            'baz',
        ],
    });
});
(0, ava_1.default)('removes multiple commented out bindings', (t) => {
    t.deepEqual((0, removeCommentedOutBindings_1.removeCommentedOutBindings)({
        sql: 'SELECT $1\n-- $2\n$3\n-- $4\n$5',
        values: [
            'foo',
            'bar',
            'baz',
            'qux',
            'quux',
        ],
    }), {
        sql: 'SELECT $1 $2 $3',
        values: [
            'foo',
            'baz',
            'quux',
        ],
    });
});
(0, ava_1.default)('removes multiple bindings in the same comment', (t) => {
    t.deepEqual((0, removeCommentedOutBindings_1.removeCommentedOutBindings)({
        sql: 'SELECT $1\n-- $2 $3 $4\n$5',
        values: [
            'foo',
            'bar',
            'baz',
            'qux',
            'quux',
        ],
    }), {
        sql: 'SELECT $1 $2',
        values: [
            'foo',
            'quux',
        ],
    });
});
(0, ava_1.default)('removes multiple bindings in the same comment (block comment)', (t) => {
    t.deepEqual((0, removeCommentedOutBindings_1.removeCommentedOutBindings)({
        sql: 'SELECT $1 /* $2 $3 $4 */ $5',
        values: [
            'foo',
            'bar',
            'baz',
            'qux',
            'quux',
        ],
    }), {
        sql: 'SELECT $1 $2',
        values: [
            'foo',
            'quux',
        ],
    });
});
//# sourceMappingURL=removeCommentedOutBindings.js.map