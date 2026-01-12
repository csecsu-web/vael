const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/lifeos', (req, res) => {
  const data = db.prepare(`SELECT * FROM lifeos WHERE id = 1`).get() || {};
  res.render('lifeos.html', { data });
});

router.post('/lifeos', (req, res) => {
  const { refuse, allowed_bad, slow_down } = req.body;

  db.prepare(`
    INSERT OR REPLACE INTO lifeos
    (id, refuse, allowed_bad, slow_down)
    VALUES (1, ?, ?, ?)
  `).run(refuse, allowed_bad, slow_down);

  res.redirect('/home');
});

module.exports = router;
