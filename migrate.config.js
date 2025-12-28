require('dotenv').config();

module.exports = {
  migrationsTable: 'pgmigrations', // tracks applied migrations
  direction: 'up',
  log: console.log,
  databaseUrl: process.env.DATABASE_URL // we will define in .env
};
