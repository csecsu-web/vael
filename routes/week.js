const express = require('express');
const db = require('../db');
const router = express.Router();

function currentWeek() {
  const d = new Date();
  const year = d.getFullYear();
  const week = Math.ceil(
    (((d - new Date(year, 0, 1)) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7
  );
  return `${year}-W${week}`;
}

router.get('/week', (req, res) => {
  res.sendFile('views/week.html', { root: '.' });
});

router.post('/week', (req, res) => {
  const week = currentWeek();
  const {
    repeated,
    misaligned,
    stable,
    override,
    summary
  } = req.body;

  db.prepare(`
    INSERT OR REPLACE INTO weekly_reflection
    (week, repeated, misaligned, stable, override, summary)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(week, repeated, misaligned, stable, override, summary);

  res.redirect('/home');
});

module.exports = router;
