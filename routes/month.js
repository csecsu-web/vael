const express = require('express');
const db = require('../db');
const router = express.Router();

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

router.get('/month', (req, res) => {
  const month = currentMonth();

  const daily = db.prepare(
    `SELECT * FROM daily_entry WHERE date LIKE ? ORDER BY date`
  ).all(`${month}%`);

  const weekly = db.prepare(
    `SELECT * FROM weekly_reflection WHERE week LIKE ?`
  ).all(`${month.slice(0,4)}%`);

  const monthly = db.prepare(
    `SELECT * FROM monthly_reflection WHERE month = ?`
  ).get(month) || {};

  res.render('month.html', { daily, weekly, monthly });
});

router.post('/month', (req, res) => {
  const month = currentMonth();
  const {
    patterns,
    draining,
    stabilizing,
    drifting,
    lesson
  } = req.body;

  db.prepare(`
    INSERT OR REPLACE INTO monthly_reflection
    (month, patterns, draining, stabilizing, drifting, lesson)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(month, patterns, draining, stabilizing, drifting, lesson);

  res.redirect('/home');
});

module.exports = router;
