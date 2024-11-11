exports.up = async function (knex) {
  return knex.schema.createTable('course', function (table) {
    table.increments('id').primary()
    table.integer('views').defaultTo(0)
    table.json('data').nullable()
    table.boolean('is_active').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('course')
}
