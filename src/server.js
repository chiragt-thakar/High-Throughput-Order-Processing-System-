const app = require('./app');
const { PORT } = require('./config/env');
const runMigrations = require('./scripts/runMigrations');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



(async () => {
  try {
    console.log('Running database migrations...');
    await runMigrations();
    console.log('Migrations finished. Starting server...');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Bull Board available at http://localhost:3000/bull_admin/queues`);
    });
  } catch (err) {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  }
})();