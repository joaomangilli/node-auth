import { JSONSchema, ModelObject, RelationMappings } from 'objection';
import { BaseModel } from './BaseModel.js';
import { UserModel, UserSchema } from './UserModel.js';

class PostModel extends BaseModel {
  static tableName = 'posts';

  id!: number;
  title!: string;
  content!: string;

  userId!: number;
  user!: UserSchema;

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'posts.userId',
          to: 'users.id',
        },
      },
    };
  }

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['title', 'content', 'userId'],
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      content: { type: 'string' },
      userId: { type: 'integer' },
    },
  };
}

export { PostModel };
export type PostSchema = ModelObject<PostModel>;
