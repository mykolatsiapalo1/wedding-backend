exports.up = async function (knex) {
  return knex.schema.createTable('chat', function (table) {
    table.increments('id').primary()
    table.json('data').nullable()
    table.integer('lesson_id').references('lesson.id').notNullable()
    table.integer('user_id').references('users.id').notNullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('chat')
}
