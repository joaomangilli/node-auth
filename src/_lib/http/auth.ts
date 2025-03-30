import { RouteGenericInterface, preValidationAsyncHookHandler } from 'fastify';
import { Handler } from './handler.js';

const preValidation: preValidationAsyncHookHandler = async (request, reply) => {
  if (!request?.isAuthenticated()) {
    return reply.redirect('/signin');
  }
};

const authenticatedHandler = <ReqOptions extends RouteGenericInterface>(handler: Handler<ReqOptions>) => ({
  preValidation,
  handler,
});

export { preValidation, authenticatedHandler };
