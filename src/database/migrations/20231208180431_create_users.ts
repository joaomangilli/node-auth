import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (t) => {
    t.increments('id');
    t.string('email').notNullable().defaultTo('');
    t.string('encryptedPassword').notNullable().defaultTo('');
    t.string('role').notNullable().defaultTo('publisher');

    t.timestamps(true, true, true);

    t.unique('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
