import { handler } from '../../../_lib/http/handler.js';
import { config } from '../../../config.js';
import { UserModel } from '../../../database/models/UserModel.js';
import jwt from 'jsonwebtoken';

const create = handler<{ Body: { email: string, password: string } }>(async (request, reply) => {
  const { email, password } = request.body;
  const user = await UserModel.authenticate({ email, password });

  if (user) {
    const token = jwt.sign({ userId: user.id }, config.secret.sessionSecret);

    return reply.code(200).send({ token });
  }

  return reply.code(401).send({ message: 'Invalid email or password' });
});

export { create };
