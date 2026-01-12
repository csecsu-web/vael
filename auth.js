const bcrypt = require('bcrypt');
const db = require('./db');

function createUser(email, password) {
  const hash = bcrypt.hashSync(password, 12);
  db.prepare(
    `INSERT INTO user (email, password_hash) VALUES (?, ?)`
  ).run(email, hash);
}

function authenticate(email, password) {
  const user = db.prepare(
    `SELECT * FROM user WHERE email = ?`
  ).get(email);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

module.exports = { createUser, authenticate };
