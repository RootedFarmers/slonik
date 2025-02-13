/* eslint-disable import/no-namespace */

import * as pgClient from 'pg';
import {
  createPool,
  sql,
} from '../../../src';
import {
  createTestRunner,
  createIntegrationTests,
} from '../../helpers/createIntegrationTests';

const {
  test,
} = createTestRunner(pgClient, 'pg');

createIntegrationTests(
  test,
  pgClient,
);

test('returns expected query result object (NOTICE)', async (t) => {
  const pool = createPool(t.context.dsn, {
    pgClient,
  });

  await pool.query(sql`
    CREATE OR REPLACE FUNCTION test_notice
      (
        v_test INTEGER
      ) RETURNS BOOLEAN
      LANGUAGE plpgsql
    AS
    $$
    BEGIN

      RAISE NOTICE '1. TEST NOTICE [%]',v_test;
      RAISE NOTICE '2. TEST NOTICE [%]',v_test;
      RAISE NOTICE '3. TEST NOTICE [%]',v_test;
      RAISE LOG '4. TEST LOG [%]',v_test;
      RAISE NOTICE '5. TEST NOTICE [%]',v_test;

      RETURN TRUE;
    END;
    $$;
  `);

  const result = await pool.query(sql`SELECT * FROM test_notice(${10});`);

  t.is(result.notices.length, 4);

  await pool.end();
});

test('streams rows', async (t) => {
  const pool = createPool(t.context.dsn);

  await pool.query(sql`
    INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
  `);

  const messages: Array<Record<string, unknown>> = [];

  await pool.stream(sql`
    SELECT name
    FROM person
  `, (stream) => {
    stream.on('data', (datum) => {
      messages.push(datum);
    });
  });

  t.deepEqual(messages, [
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'foo',
      },
    },
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'bar',
      },
    },
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'baz',
      },
    },
  ]);

  await pool.end();
});
test('applies type parsers to streamed rows', async (t) => {
  const pool = createPool(t.context.dsn, {
    typeParsers: [
      {
        name: 'date',
        parse: (value) => {
          return value === null ? value : new Date(value + ' 00:00').getFullYear();
        },
      },
    ],
  });

  await pool.query(sql`
    INSERT INTO person
      (name, birth_date)
    VALUES
      ('foo', '1990-01-01'),
      ('bar', '1991-01-01'),
      ('baz', '1992-01-01')
  `);

  const messages: Array<Record<string, unknown>> = [];

  await pool.stream(sql`
    SELECT birth_date
    FROM person
    ORDER BY birth_date ASC
  `, (stream) => {
    stream.on('data', (datum) => {
      messages.push(datum);
    });
  });

  t.deepEqual(messages, [
    {
      fields: [
        {
          dataTypeId: 1082,
          name: 'birth_date',
        },
      ],
      row: {
        birth_date: 1990,
      },
    },
    {
      fields: [
        {
          dataTypeId: 1082,
          name: 'birth_date',
        },
      ],
      row: {
        birth_date: 1991,
      },
    },
    {
      fields: [
        {
          dataTypeId: 1082,
          name: 'birth_date',
        },
      ],
      row: {
        birth_date: 1992,
      },
    },
  ]);

  await pool.end();
});
test('streams over a transaction', async (t) => {
  const pool = createPool(t.context.dsn);

  await pool.query(sql`
    INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
  `);

  const messages: Array<Record<string, unknown>> = [];

  await pool.transaction(async (trxn) => {
    await trxn.stream(sql`
      SELECT name
      FROM person
    `, (stream) => {
      stream.on('data', (datum) => {
        messages.push(datum);
      });
    });
  });

  t.deepEqual(messages, [
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'foo',
      },
    },
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'bar',
      },
    },
    {
      fields: [
        {
          dataTypeId: 25,
          name: 'name',
        },
      ],
      row: {
        name: 'baz',
      },
    },
  ]);

  await pool.end();
});
