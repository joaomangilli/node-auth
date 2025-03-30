import bcrypt from 'bcryptjs';
import { JSONSchema, ModelObject, ModelOptions, Pojo } from 'objection';
import { BaseModel } from './BaseModel.js';

class UserModel extends BaseModel {
  static tableName = 'users';

  id!: number;
  email!: string;
  encryptedPassword!: string;
  password!: string;
  role!: string;

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['email', 'role'],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
    },
  };

  static async authenticate({ email, password }: AuthParams): Promise<UserModel | null> {
    return UserModel.query()
      .findOne({ email })
      .then(async (user) => {
        const passwordIsCorrect = Boolean(await user?.passwordIs(password));

        if (!user || !passwordIsCorrect) {
          return null;
        }

        return user;
      });
  }

  $parseJson(json: Pojo, options?: ModelOptions | undefined): Pojo {
    const { password, ...actualJson } = json;

    const parsedJson = {
      ...super.$parseJson(actualJson, options),
      encryptedPassword: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : null,
    };

    return parsedJson;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isPublisher() {
    return this.role === 'publisher';
  }

  private passwordIs(password: string) {
    return bcrypt.compare(password, this.encryptedPassword);
  }
}

type AuthParams = {
  email: string;
  password: string;
};

export { UserModel };
export type UserSchema = ModelObject<UserModel>;
