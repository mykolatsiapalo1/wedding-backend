exports.up = async function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('user_name', 32).notNullable()
    table.string('email', 40).unique().notNullable()
    table.string('password', 100).notNullable()
    table.boolean('is_verified').notNullable()
    table.boolean('is_admin').notNullable()
    table.json('purchased_courses_id').notNullable()
    table.json('favourite_courses_id').notNullable()
    table.json('comleted_lessons_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('users')
}
