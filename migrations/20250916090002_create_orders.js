exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      product_name TEXT NOT NULL,
      amount NUMERIC,
      status VARCHAR(20) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT NOW(),
      processed_at TIMESTAMP
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE orders;`);
};
