import { jwtAuthenticatedHandler } from '../../../_lib/http/jwtAuth.js';
import { PostModel } from '../../../database/models/PostModel.js';

const index = jwtAuthenticatedHandler(async (request, reply) => {
  const posts = await PostModel.query();

  return reply.code(200).send({ posts });
});

export { index };
