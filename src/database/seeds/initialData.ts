import { Knex } from 'knex';
import { BaseModel } from '../models/BaseModel.js';
import { UserModel } from '../models/UserModel.js';

export async function seed(knex: Knex): Promise<void> {
  BaseModel.knex(knex);

  try {
    console.log('CREATING ADMIN USER');

    await UserModel.query().insert({
      email: 'admin@mail.com',
      password: 'admin',
      role: 'admin',
    });

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    await knex.destroy();
  }
}
