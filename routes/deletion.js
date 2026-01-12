router.post('/delete-all', (req, res) => {
  db.exec(`
    DELETE FROM daily_entry;
    DELETE FROM weekly_reflection;
    DELETE FROM monthly_reflection;
    DELETE FROM lifeos;
  `);
  res.destroy();
});
const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/delete-all', (req, res) => {
  db.exec(`
    DELETE FROM daily_entry;
    DELETE FROM weekly_reflection;
    DELETE FROM monthly_reflection;
    DELETE FROM lifeos;
    DELETE FROM user;
  `);

  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
