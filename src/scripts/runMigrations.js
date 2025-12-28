const { exec } = require('child_process');

function runMigrations() {
  return new Promise((resolve, reject) => {
    exec('npx node-pg-migrate up', (err, stdout, stderr) => {
      if (err) {
        console.error('Migration error:', stderr);
        return reject(err);
      }
      console.log(stdout);
      resolve();
    });
  });
}

module.exports = runMigrations;
