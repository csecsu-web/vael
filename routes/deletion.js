router.post('/delete-all', (req, res) => {
  db.exec(`
    DELETE FROM daily_entry;
    DELETE FROM weekly_reflection;
    DELETE FROM monthly_reflection;
    DELETE FROM lifeos;
  `);
  res.destroy();
});
