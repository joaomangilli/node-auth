import { authenticatedHandler } from '../../_lib/http/auth.js';
import { handler } from '../../_lib/http/handler.js';
import { adminHandler } from '../../_lib/http/adminPolice.js';
import { PostModel } from '../../database/models/PostModel.js';
import { publisherHandler } from '../../_lib/http/publisherPolice.js';

const index = handler(async (request, reply) => {
  const posts = await PostModel.query();

  return reply.view('posts/index', { posts });
});

const show = authenticatedHandler<{ Params: { id: string } }>(async (request, reply) => {
  const post = await PostModel.query().findById(request.params.id).throwIfNotFound();

  return reply.view('posts/show', { post });
});

const create = publisherHandler(async (request, reply) => {
  return reply.view('posts/create', { post: new PostModel() });
});

const store = publisherHandler<{
  Body: { title: string, content: string };
}>(async (request, reply) => {
  const currentUser = request.user!;

  try {
    const { title, content } = request.body;

    await PostModel.query().insert({
      title,
      content,
      userId: currentUser.id,
    });

    request.flash('notice', 'Your post was created successfully');
    return reply.redirect(`/posts`);
  } catch (error) {
    console.error(error);
    request.flash('alert', 'Unable to create your post!');
    return reply.view('posts/create', { post: new PostModel() });
  }
});

const edit = publisherHandler<{ Params: { id: string } }>(async (request, reply) => {
  const currentUser = request.user!;
  const post = await PostModel.query().where({ userId: currentUser.id }).findById(request.params.id).throwIfNotFound();

  return reply.view('posts/update', { post });
});

const update = publisherHandler<{
  Params: { id: string };
  Body: { title: string, content: string };
}>(async (request, reply) => {
  const currentUser = request.user!;
  const post = await PostModel.query().where({ userId: currentUser.id }).findById(request.params.id).throwIfNotFound();

  try {
    const { title, content } = request.body;

    await PostModel.query().where({ userId: currentUser.id, id: request.params.id }).update({
      title,
      content,
      userId: currentUser.id,
    });

    request.flash('notice', 'Your post was updated successfully');
    return reply.redirect(`/posts`);
  } catch (error) {
    console.error(error);
    request.flash('alert', 'Unable to update your post!');
    return reply.view('posts/update', { post });
  }
});

const destroy = adminHandler<{ Params: { id: string } }>(async (request, reply) => {
  try {
    await PostModel.query().findById(request.params.id).throwIfNotFound().delete();

    request.flash('notice', 'The post was deleted successfully');
    return reply.redirect(`/posts`);
  } catch (error) {
    console.error(error);
    request.flash('alert', 'Unable to delete the post!');
    return reply.redirect('/posts');
  }
});

export { index, show, create, store, edit, update, destroy };
