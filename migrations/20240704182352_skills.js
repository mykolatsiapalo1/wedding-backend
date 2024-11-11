exports.up = async function (knex) {
  return knex.schema.createTable('skills', function (table) {
    table.increments('id').primary()
    table.string('name_skill', 32).notNullable()
    table.text('icon_url').notNullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('skills')
}
