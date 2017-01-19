
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('posts', function(table) {
            table.string('id').primary();
            table.string('messageId');
            table.string('requestId');
            table.timestamps();
        })
    ])
};

exports.down = function(knex, Promise) {
      return Promise.all([
        knex.schema.dropTable('posts')
    ])
};
