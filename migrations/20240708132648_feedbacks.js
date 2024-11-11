exports.up = async function (knex) {
  return knex.schema.createTable('feedbacks', function (table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.integer('lesson_id').references('lesson.id').notNullable()
    table.integer('rating').notNullable()
    table.text('feedback_name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('feedbacks')
}
