import 'dotenv/config';

import { Env, EnvType } from './_lib/env.js';

const env = Env.string('NODE_ENV', 'development') as EnvType;

const http = {
  port: Env.number('PORT', 3000),
};

const db = {
  development: {
    client: 'postgresql',
    connection: {
      database: Env.string('DATABASE_DB', 'auth_passport_dev'),
      port: Env.number('DATABASE_PORT', 5432),
      user: Env.string('DATABASE_USER', 'postgres'),
      password: Env.string('DATABASE_PASSWORD', 'postgres'),
      host: Env.string('DATABASE_HOST', '127.0.0.1'),
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: Env.string('TEST_DATABASE_DB', 'auth_passport_test'),
      port: Env.number('TEST_DATABASE_PORT', 5432),
      user: Env.string('TEST_DATABASE_USER', 'postgres'),
      password: Env.string('TEST_DATABASE_PASSWORD', 'postgres'),
      host: Env.string('TEST_DATABASE_HOST', '127.0.0.1'),
    },
  },
} as const;

const secret = { sessionSecret: Env.string('SESSION_SECRET', '69DB95EA161AC342B1AC7D45EAB22456') };

const config = { env, http, db, secret };

type Config = typeof config;

export { config };
export type { Config };
