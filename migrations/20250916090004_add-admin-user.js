exports.up = (pgm) => {

    //admin password is 'Admin@123'
  const adminPasswordHash = '$2b$10$6NxCAt5Hpjly1//9wCRni.nJj.Bg9lkLtpEXYxzX7OP8Dkgiu0m0S'; 

  pgm.sql(`
    INSERT INTO users (name, email, password, role)
    VALUES (
      'System Admin', 
      'admin@yopmail.com', 
      '${adminPasswordHash}', 
      'ADMIN'
    
    )
    ON CONFLICT (email) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE IF EXISTS users;');
};