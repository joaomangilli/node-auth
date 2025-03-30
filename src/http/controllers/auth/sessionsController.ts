import { Handler } from '../../../_lib/http/handler.js';

const create: Handler = async (_, reply) => {
  return reply.view('auth/sessions/create');
};

const destroy: Handler = async (request, reply) => {
  await request.logout();
  return reply.redirect('/');
};

export { create, destroy };
