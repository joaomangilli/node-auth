import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';
import { Authenticator } from '@fastify/passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as SessionsController from './controllers/auth/sessionsController.js';
import * as RegistrationController from './controllers/auth/registrationsController.js';
import { UserModel } from '../database/models/UserModel.js';

declare module 'fastify' {
  interface PassportUser extends UserModel {}
}

const auth: FastifyPluginAsync = plugin(async (server, _) => {
  const authenticator = new Authenticator();

  server.register(authenticator.initialize());
  server.register(authenticator.secureSession());

  server.addHook('preHandler', (request, reply, done) => {
    reply.locals = reply.locals || {};
    reply.locals.currentUser = request.user || null;
    done();
  });

  authenticator.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        UserModel.authenticate({ email, password })
          .then((maybeUser) => {
            if (maybeUser) {
              return done(null, maybeUser);
            }

            return done(null, false);
          })
          .catch(done);
      },
    ),
  );

  authenticator.registerUserDeserializer<number, UserModel>(async (id) =>
    UserModel.query().findById(id).throwIfNotFound(),
  );

  authenticator.registerUserSerializer<UserModel, number>(async (user) => user.id);

  server.get('/signup', RegistrationController.create);
  server.post('/signup', RegistrationController.store);

  server.get('/signout', SessionsController.destroy);
  server.get('/signin', SessionsController.create);
  server.post(
    '/signin',
    authenticator.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
    }),
  );
});

export { auth };
