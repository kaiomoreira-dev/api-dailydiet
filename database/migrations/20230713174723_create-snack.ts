/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary(),
    table.uuid('idUser').notNullable(),
    table.string('name').notNullable(),
    table.string('description').notNullable(),
    table.timestamp('date').notNullable(),
    table.timestamp('time').notNullable(),
    table.boolean('isDiet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('snacks')
}
