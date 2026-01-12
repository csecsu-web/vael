const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/export-md', (req, res) => {
  let out = `# Personal Reflection Export\n\n`;

  const daily = db.prepare(
    `SELECT * FROM daily_entry ORDER BY date`
  ).all();

  out += `## Daily Entries\n\n`;
  daily.forEach(d => {
    out += `### ${d.date}\n`;
    out += `- Energy: ${d.energy_direction}\n`;
    if (d.pressure_source)
      out += `- Pressure: ${d.pressure_source}\n`;
    if (d.body_state)
      out += `- Body: ${d.body_state}\n`;
    out += `\n${d.moment}\n\n`;
  });

  const weekly = db.prepare(
    `SELECT * FROM weekly_reflection ORDER BY week`
  ).all();

  out += `## Weekly Reflections\n\n`;
  weekly.forEach(w => {
    out += `### ${w.week}\n\n`;
    if (w.repeated) out += `**Repeated:** ${w.repeated}\n\n`;
    if (w.misaligned) out += `**Misaligned:** ${w.misaligned}\n\n`;
    if (w.stable) out += `**Stable:** ${w.stable}\n\n`;
    if (w.override) out += `**Override:** ${w.override}\n\n`;
    if (w.summary) out += `**Summary:** ${w.summary}\n\n`;
  });

  const monthly = db.prepare(
    `SELECT * FROM monthly_reflection ORDER BY month`
  ).all();

  out += `## Monthly Reflections\n\n`;
  monthly.forEach(m => {
    out += `### ${m.month}\n\n`;
    if (m.patterns) out += `**Patterns:** ${m.patterns}\n\n`;
    if (m.draining) out += `**Draining:** ${m.draining}\n\n`;
    if (m.stabilizing) out += `**Stabilizing:** ${m.stabilizing}\n\n`;
    if (m.drifting) out += `**Drifting:** ${m.drifting}\n\n`;
    if (m.lesson) out += `**Lesson:**\n${m.lesson}\n\n`;
  });

  const lifeos = db.prepare(
    `SELECT * FROM lifeos WHERE id = 1`
  ).get();

  if (lifeos) {
    out += `## LifeOS\n\n`;
    out += `**Refuse to trade:**\n${lifeos.refuse || ''}\n\n`;
    out += `**Allowed to be bad at:**\n${lifeos.allowed_bad || ''}\n\n`;
    out += `**Slow down signals:**\n${lifeos.slow_down || ''}\n\n`;
  }

  res.setHeader(
    'Content-Disposition',
    'attachment; filename="reflection.md"'
  );
  res.type('text/markdown');
  res.send(out);
});

module.exports = router;
