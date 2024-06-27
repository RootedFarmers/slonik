import type { PoolConfig } from 'pg';
import type { ClientConfigurationType } from '../types';
export declare const createPoolConfiguration: (dsn: string, clientConfiguration: ClientConfigurationType) => PoolConfig;
