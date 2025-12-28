
exports.up = (pgm) => {
    pgm.sql(`-- Enable trigram extension for fast ILIKE search
CREATE EXTENSION IF NOT EXISTS pg_trgm;


CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc
ON orders (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders (status);

CREATE INDEX IF NOT EXISTS idx_orders_product_name_trgm
ON orders USING GIN (product_name gin_trgm_ops);


CREATE INDEX IF NOT EXISTS idx_users_name_trgm
ON users USING GIN (name gin_trgm_ops);
`)
};


exports.down = (pgm) => {
    pgm.query(`DROP INDEX IF EXISTS idx_orders_created_at_desc;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_product_name_trgm;
DROP INDEX IF EXISTS idx_users_name_trgm;`)
};
