import React, { useState, useEffect } from 'react';

function Month({ onBack }) {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [data, setData] = useState({
    pattern: '',
    draining: '',
    stabilizing: '',
    direction: '',
    lesson: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthData();
  }, []);

  const loadMonthData = async () => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      // Load daily entries
      const entriesResponse = await fetch(`/api/entries/monthly/${yearMonth}/entries`, {
        credentials: 'include'
      });
      
      if (entriesResponse.ok) {
        const entries = await entriesResponse.json();
        setDailyEntries(entries);
      }

      // Load monthly reflection
      const reflectionResponse = await fetch(`/api/entries/monthly/${yearMonth}`, {
        credentials: 'include'
      });
      
      if (reflectionResponse.ok) {
        const reflection = await reflectionResponse.json();
        if (reflection) {
          setData({
            pattern: reflection.pattern || '',
            draining: reflection.draining || '',
            stabilizing: reflection.stabilizing || '',
            direction: reflection.direction || '',
            lesson: reflection.lesson || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to load month data:', err);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    try {
      const response = await fetch('/api/entries/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          monthKey,
          ...data
        }),
      });

      if (response.ok) {
        onBack();
      } else {
        alert('Failed to save reflection');
      }
    } catch (err) {
      alert('Connection failed');
    }
  };

  if (loading) {
    return <div className="content"></div>;
  }

  return (
    <div className="content">
      <button onClick={onBack} className="back-button">← Home</button>
      <h2 className="heading">This Month</h2>
      
      <div className="month-section">
        <h3 className="subheading">Daily Entries</h3>
        {dailyEntries.length === 0 ? (
          <p className="empty-text">No entries this month</p>
        ) : (
          dailyEntries.map((entry) => (
            <div key={entry.id} className="entry-box">
              <p className="entry-date">{entry.date}</p>
              <p className="entry-text">{entry.moment}</p>
            </div>
          ))
        )}
      </div>

      <div className="field">
        <label className="label">What pattern do I see now that I couldn't see daily?</label>
        <textarea
          value={data.pattern}
          onChange={(e) => setData({ ...data, pattern: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What is slowly draining me?</label>
        <textarea
          value={data.draining}
          onChange={(e) => setData({ ...data, draining: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What stabilizes me without effort?</label>
        <textarea
          value={data.stabilizing}
          onChange={(e) => setData({ ...data, stabilizing: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What direction does my life seem to be drifting?</label>
        <textarea
          value={data.direction}
          onChange={(e) => setData({ ...data, direction: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What this month taught me</label>
        <textarea
          value={data.lesson}
          onChange={(e) => setData({ ...data, lesson: e.target.value })}
          className="textarea"
          style={{ minHeight: '150px' }}
        />
      </div>

      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
}

export default Month;
