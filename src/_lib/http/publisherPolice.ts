import { RouteGenericInterface, preValidationAsyncHookHandler } from 'fastify';
import { Handler } from './handler.js';
import { preValidation as auth } from './auth.js';

const preValidation: preValidationAsyncHookHandler = async (request, reply) => {
  const currentUser = request.user!;

  if (!currentUser.isPublisher()) {
    request.flash('alert', 'You are not authorized to access this resource!');
    return reply.redirect('/');
  }
};

const publisherHandler = <ReqOptions extends RouteGenericInterface>(handler: Handler<ReqOptions>) => ({
  preValidation: [auth, preValidation],
  handler,
});

export { publisherHandler };
