import type { QueryResultRowType, SqlTaggedTemplateType } from '../types';
export declare const createSqlTag: <T extends QueryResultRowType = QueryResultRowType>() => SqlTaggedTemplateType<T>;
