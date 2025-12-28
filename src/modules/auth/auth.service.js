const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const message = require('../../utils/messages');
const env = require('../../config/env.js')

exports.register = async (body) => {
  const { name, email, password } = body;

  if (!name) throw new Error(message.User_name_is_required);
  if (!email) throw new Error(message.User_email_is_required);
  if (!password) throw new Error(message.User_password_is_required);

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error(message.Email_is_already_registered);
  }

  const hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'USER')
     RETURNING id, name, email, role`,
    [name, email, hash]
  );

  return rows[0];
};

exports.login = async (body) => {
  const { email, password } = body;
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (!rows.length) throw new Error(message.Invalid_credentials);

  const ok = await bcrypt.compare(password, rows[0].password);

  if (!ok) throw new Error(message.Invalid_credentials);

  const token = jwt.sign(
    { id: rows[0].id, role: rows[0].role },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { token }
};
