import { RouteGenericInterface, preValidationAsyncHookHandler } from 'fastify';
import { Handler } from './handler.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { UserModel } from '../../database/models/UserModel.js';

const preValidation: preValidationAsyncHookHandler = async (request, reply) => {
  const token = request.headers.authorization?.split(' ')[1] as string;

  try {
    const { userId } = jwt.verify(token, config.secret.sessionSecret) as { userId: string };
    const user = await UserModel.query().findById(userId).throwIfNotFound();
    request.currentUser = user;
  } catch (error) {
    console.error(error);
    return reply.code(401).send({ message: 'Unauthorized' });
  }
};

const jwtAuthenticatedHandler = <ReqOptions extends RouteGenericInterface>(handler: Handler<ReqOptions>) => ({
  preValidation,
  handler,
});

export { preValidation, jwtAuthenticatedHandler };
