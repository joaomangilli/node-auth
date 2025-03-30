import plugin from 'fastify-plugin';
import * as PostController from './controllers/postController.js';

const router = plugin(async (server, _) => {
  server.get('/', PostController.index);

  server.get('/posts', PostController.index);
  server.get('/posts/:id', PostController.show);
  server.get('/posts/create', PostController.create);
  server.post('/posts', PostController.store);
  server.get('/posts/:id/edit', PostController.edit);
  server.post('/posts/:id', PostController.update);
  server.get('/posts/:id/delete', PostController.destroy);
});

export { router };
