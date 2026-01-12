const express = require('express');
const { db } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Daily Entry - Save
router.post('/daily', (req, res) => {
  const { date, energyDirection, moment, pressureSource, bodyState } = req.body;
  const userId = req.user.userId;

  if (!date || !energyDirection || !moment) {
    return res.status(400).json({ error: 'Date, energy direction, and moment are required' });
  }

  try {
    const id = `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO daily_entries (id, user_id, date, energy_direction, moment, pressure_source, body_state)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
        energy_direction = excluded.energy_direction,
        moment = excluded.moment,
        pressure_source = excluded.pressure_source,
        body_state = excluded.body_state
    `);
    stmt.run(id, userId, date, energyDirection, moment, pressureSource || null, bodyState || null);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// Daily Entry - Get
router.get('/daily/:date', (req, res) => {
  const { date } = req.params;
  const userId = req.user.userId;

  try {
    const stmt = db.prepare('SELECT * FROM daily_entries WHERE user_id = ? AND date = ?');
    const entry = stmt.get(userId, date);
    
    res.json(entry || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// Weekly Reflection - Save
router.post('/weekly', (req, res) => {
  const { weekKey, repeated, misaligned, stable, override, summary } = req.body;
  const userId = req.user.userId;

  if (!weekKey) {
    return res.status(400).json({ error: 'Week key is required' });
  }

  try {
    const id = `weekly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO weekly_reflections (id, user_id, week_key, repeated, misaligned, stable, override, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, week_key) DO UPDATE SET
        repeated = excluded.repeated,
        misaligned = excluded.misaligned,
        stable = excluded.stable,
        override = excluded.override,
        summary = excluded.summary
    `);
    stmt.run(id, userId, weekKey, repeated, misaligned, stable, override, summary);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reflection' });
  }
});

// Weekly Reflection - Get
router.get('/weekly/:week', (req, res) => {
  const { week } = req.params;
  const userId = req.user.userId;

  try {
    const stmt = db.prepare('SELECT * FROM weekly_reflections WHERE user_id = ? AND week_key = ?');
    const reflection = stmt.get(userId, week);
    
    res.json(reflection || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reflection' });
  }
});

// Monthly Reflection - Save
router.post('/monthly', (req, res) => {
  const { monthKey, pattern, draining, stabilizing, direction, lesson } = req.body;
  const userId = req.user.userId;

  if (!monthKey) {
    return res.status(400).json({ error: 'Month key is required' });
  }

  try {
    const id = `monthly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO monthly_reflections (id, user_id, month_key, pattern, draining, stabilizing, direction, lesson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, month_key) DO UPDATE SET
        pattern = excluded.pattern,
        draining = excluded.draining,
        stabilizing = excluded.stabilizing,
        direction = excluded.direction,
        lesson = excluded.lesson
    `);
    stmt.run(id, userId, monthKey, pattern, draining, stabilizing, direction, lesson);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reflection' });
  }
});

// Monthly Reflection - Get
router.get('/monthly/:month', (req, res) => {
  const { month } = req.params;
  const userId = req.user.userId;

  try {
    const stmt = db.prepare('SELECT * FROM monthly_reflections WHERE user_id = ? AND month_key = ?');
    const reflection = stmt.get(userId, month);
    
    res.json(reflection || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reflection' });
  }
});

// Get all daily entries for a month
router.get('/monthly/:month/entries', (req, res) => {
  const { month } = req.params;
  const userId = req.user.userId;

  try {
    const stmt = db.prepare(`
      SELECT * FROM daily_entries 
      WHERE user_id = ? AND date LIKE ? 
      ORDER BY date ASC
    `);
    const entries = stmt.all(userId, `${month}%`);
    
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// LifeOS - Save
router.post('/lifeos', (req, res) => {
  const { refuse, badAt, slowDown } = req.body;
  const userId = req.user.userId;

  try {
    const stmt = db.prepare(`
      INSERT INTO lifeos (
        user_id, refuse_1, refuse_2, refuse_3,
        bad_at_1, bad_at_2, bad_at_3,
        slow_down_1, slow_down_2, slow_down_3,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        refuse_1 = excluded.refuse_1,
        refuse_2 = excluded.refuse_2,
        refuse_3 = excluded.refuse_3,
        bad_at_1 = excluded.bad_at_1,
        bad_at_2 = excluded.bad_at_2,
        bad_at_3 = excluded.bad_at_3,
        slow_down_1 = excluded.slow_down_1,
        slow_down_2 = excluded.slow_down_2,
        slow_down_3 = excluded.slow_down_3,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(
      userId,
      refuse[0], refuse[1], refuse[2],
      badAt[0], badAt[1], badAt[2],
      slowDown[0], slowDown[1], slowDown[2]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save LifeOS' });
  }
});

// LifeOS - Get
router.get('/lifeos', (req, res) => {
  const userId = req.user.userId;

  try {
    const stmt = db.prepare('SELECT * FROM lifeos WHERE user_id = ?');
    const lifeos = stmt.get(userId);
    
    if (lifeos) {
      res.json({
        refuse: [lifeos.refuse_1, lifeos.refuse_2, lifeos.refuse_3],
        badAt: [lifeos.bad_at_1, lifeos.bad_at_2, lifeos.bad_at_3],
        slowDown: [lifeos.slow_down_1, lifeos.slow_down_2, lifeos.slow_down_3]
      });
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch LifeOS' });
  }
});

// Export all data
router.get('/export', (req, res) => {
  const userId = req.user.userId;

  try {
    const dailyStmt = db.prepare('SELECT * FROM daily_entries WHERE user_id = ? ORDER BY date');
    const weeklyStmt = db.prepare('SELECT * FROM weekly_reflections WHERE user_id = ? ORDER BY week_key');
    const monthlyStmt = db.prepare('SELECT * FROM monthly_reflections WHERE user_id = ? ORDER BY month_key');
    const lifeosStmt = db.prepare('SELECT * FROM lifeos WHERE user_id = ?');

    const data = {
      daily: dailyStmt.all(userId),
      weekly: weeklyStmt.all(userId),
      monthly: monthlyStmt.all(userId),
      lifeos: lifeosStmt.get(userId)
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Delete all user data
router.delete('/delete-account', (req, res) => {
  const userId = req.user.userId;

  try {
    db.prepare('DELETE FROM daily_entries WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM weekly_reflections WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM monthly_reflections WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM lifeos WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    res.clearCookie('token');
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
