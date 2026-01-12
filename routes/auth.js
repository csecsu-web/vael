const express = require('express');
const { authenticate, createUser } = require('../auth');
const db = require('../db');
const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile('views/login.html', { root: '.' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const userExists = db.prepare(
    `SELECT 1 FROM user WHERE email = ?`
  ).get(email);

  if (!userExists) {
    createUser(email, password);
  }

  const ok = authenticate(email, password);
  if (!ok) return res.redirect('/login');

  req.session.user = email;
  res.redirect('/home');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
