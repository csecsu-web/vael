const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/lifeos', (req, res) => {
  const d = db.prepare(`SELECT * FROM lifeos WHERE id = 1`).get() || {};

  res.send(`
    <!doctype html>
    <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <form method="post">

        <label>3 Things I Refuse to Trade</label>
        <textarea name="refuse">${d.refuse || ''}</textarea>

        <label>3 Things I’m Allowed to Be Bad At</label>
        <textarea name="allowed_bad">${d.allowed_bad || ''}</textarea>

        <label>3 Signals That Mean I Should Slow Down</label>
        <textarea name="slow_down">${d.slow_down || ''}</textarea>

        <button type="submit">Save</button>
      </form>
    </body>
    </html>
  `);
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
