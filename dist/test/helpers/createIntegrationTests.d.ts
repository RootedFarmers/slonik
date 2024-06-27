import type { TestFn } from 'ava';
import type { PgClientType } from '../../src';
type TestContextType = {
    dsn: string;
    testDatabaseName: string;
};
export declare const createTestRunner: (pgClient: PgClientType, name: string) => {
    test: TestFn<TestContextType>;
};
export declare const createIntegrationTests: (test: TestFn<TestContextType>, pgClient: PgClientType) => void;
export {};
