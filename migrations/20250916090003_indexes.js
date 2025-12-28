exports.up = (pgm) => {
  // Create indexes on orders table
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `);

  pgm.sql(`
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  `);
};

exports.down = (pgm) => {
  // Drop indexes in case of rollback
  pgm.sql(`DROP INDEX IF EXISTS idx_orders_user;`);
  pgm.sql(`DROP INDEX IF EXISTS idx_orders_status;`);
  pgm.sql(`DROP INDEX IF EXISTS idx_orders_created;`);
};
