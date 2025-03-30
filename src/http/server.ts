import { join } from 'path';
import { fileURLToPath } from 'url';
import Fastify, { FastifyReply } from 'fastify';
import FastifyView from '@fastify/view';
import EJS from 'ejs';
import { UserSchema } from '../database/models/UserModel.js';
import { router } from './router.js';
import { auth } from './auth.js';
import { fastifyCookie } from '@fastify/cookie';
import { fastifySession } from '@fastify/session';
import { fastifyFormbody } from '@fastify/formbody';
import { config } from '../config.js';
import { api } from './api.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

declare module 'fastify' {
  interface FastifyReply {
    locals: {
      currentUser: UserSchema | null;
      flash: { [k: string]: undefined | string[] };
    };
  }

  interface FastifyRequest {
    currentUser?: UserSchema | null;
  }
}

const makeServer = () => {
  const server = Fastify();

  server.register(FastifyView, {
    engine: {
      ejs: EJS,
    },
    includeViewExtension: true,
    root: join(__dirname, 'views'),
    layout: 'layouts/layout.ejs',
  });

  server.addHook('preHandler', (_, reply, done) => {
    reply.locals = reply.locals || {};
    reply.locals.flash = (reply.flash() || {}) as FastifyReply['locals']['flash'];
    done();
  });

  server.register(fastifyCookie);
  server.register(fastifySession, { secret: config.secret.sessionSecret, cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } });
  server.register(fastifyFormbody);

  server.register(auth);
  server.register(router);
  server.register(api);

  return server;
};

export { makeServer };
