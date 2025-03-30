import plugin from 'fastify-plugin';
import * as AuthController from './controllers/api/authController.js';
import * as PostController from './controllers/api/postController.js';

const api = plugin(async (server, _) => {
  server.post('/api/signin', AuthController.create);

  server.get('/api/posts', PostController.index);
});

export { api };
