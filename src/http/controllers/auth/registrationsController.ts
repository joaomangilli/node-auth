import { handler } from '../../../_lib/http/handler.js';
import { UserModel } from '../../../database/models/UserModel.js';

const create = handler(async (_, reply) => {
  return reply.view('auth/registrations/create');
});

const store = handler<{
  Body: { email: string; password: string; passwordConfirmation: string };
}>(async (request, reply) => {
  const { password, passwordConfirmation, email } = request.body;

  if (password !== passwordConfirmation) {
    request.flash('error', "Password and password confirmation don't match");
    reply.redirect('/signup');
  }

  try {
    const user = await UserModel.query().insert({ email, password, role: 'publisher' });
    await request.login(user);
    reply.redirect('/');
  } catch (error) {
    console.error(error);
    request.flash('error', 'User failed to be created');
    reply.redirect('/signup');
  }
});

export { create, store };
