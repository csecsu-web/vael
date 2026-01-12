const express = require('express');
const db = require('../db');
const router = express.Router();

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

router.get('/month', (req, res) => {
  const month = currentMonth();

  const daily = db.prepare(
    `SELECT date, energy_direction, moment FROM daily_entry
     WHERE date LIKE ? ORDER BY date`
  ).all(`${month}%`);

  const weekly = db.prepare(
    `SELECT week, summary FROM weekly_reflection
     WHERE week LIKE ?`
  ).all(`${month.slice(0,4)}%`);

  const m = db.prepare(
    `SELECT * FROM monthly_reflection WHERE month = ?`
  ).get(month) || {};

  let html = `
  <!doctype html>
  <html>
  <head>
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>

  <h2>Daily entries</h2>
  <pre>${daily.map(d =>
    `${d.date} — ${d.energy_direction}\n${d.moment}\n`
  ).join('\n')}</pre>

  <h2>Weekly reflections</h2>
  <pre>${weekly.map(w =>
    `${w.week}\n${w.summary || ''}\n`
  ).join('\n')}</pre>

  <form method="post">
    <label>What pattern do I see now that I couldn’t see daily?</label>
    <textarea name="patterns">${m.patterns || ''}</textarea>

    <label>What is slowly draining me?</label>
    <textarea name="draining">${m.draining || ''}</textarea>

    <label>What stabilizes me without effort?</label>
    <textarea name="stabilizing">${m.stabilizing || ''}</textarea>

    <label>What direction does my life seem to be drifting?</label>
    <textarea name="drifting">${m.drifting || ''}</textarea>

    <label>What this month taught me</label>
    <textarea name="lesson">${m.lesson || ''}</textarea>

    <button type="submit">Save</button>
  </form>

  </body>
  </html>
  `;

  res.send(html);
});

router.post('/month', (req, res) => {
  const month = currentMonth();
  const { patterns, draining, stabilizing, drifting, lesson } = req.body;

  db.prepare(`
    INSERT OR REPLACE INTO monthly_reflection
    (month, patterns, draining, stabilizing, drifting, lesson)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(month, patterns, draining, stabilizing, drifting, lesson);

  res.redirect('/home');
});

module.exports = router;
