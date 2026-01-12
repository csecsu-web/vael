router.get('/export', (req, res) => {
  const data = {
    daily: db.prepare(`SELECT * FROM daily_entry`).all(),
    weekly: db.prepare(`SELECT * FROM weekly_reflection`).all(),
    monthly: db.prepare(`SELECT * FROM monthly_reflection`).all(),
    lifeos: db.prepare(`SELECT * FROM lifeos`).get()
  };
  res.json(data);
});
