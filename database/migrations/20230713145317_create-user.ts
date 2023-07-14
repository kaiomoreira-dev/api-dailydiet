/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('idSession').notNullable(),
    table.string('name').notNullable(),
    table.string('email').notNullable().unique()
    table.integer('inSequency').defaultTo(0),
    table.integer('bestSequency').defaultTo(0),
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}
