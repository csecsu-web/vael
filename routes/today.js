const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/today', (req, res) => {
  res.sendFile('views/today.html', { root: '.' });
});

router.post('/today', (req, res) => {
  const { energy, moment, pressure, body } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT OR REPLACE INTO daily_entry
    (date, energy_direction, moment, pressure_source, body_state)
    VALUES (?, ?, ?, ?, ?)
  `).run(date, energy, moment, pressure || null, body || null);

  res.redirect('/home');
});

module.exports = router;
