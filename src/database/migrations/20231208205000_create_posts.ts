import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (t) => {
    t.increments('id');
    t.string('title').notNullable();
    t.string('content').notNullable();

    t.integer('userId').unsigned().notNullable().references('id').inTable('users');

    t.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts');
}
