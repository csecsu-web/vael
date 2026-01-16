import React, { useState, useEffect } from 'react';

function Week({ onBack }) {
  const [data, setData] = useState({
    repeated: '',
    misaligned: '',
    stable: '',
    override: '',
    summary: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeekData();
  }, []);

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const loadWeekData = async () => {
    const now = new Date();
    const weekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    
    try {
      const response = await fetch(`/api/entries/weekly/${weekKey}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const reflection = await response.json();
        if (reflection) {
          setData({
            repeated: reflection.repeated || '',
            misaligned: reflection.misaligned || '',
            stable: reflection.stable || '',
            override: reflection.override || '',
            summary: reflection.summary || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to load reflection:', err);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    const now = new Date();
    const weekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;

    try {
      const response = await fetch('/api/entries/weekly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          weekKey,
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
      <h2 className="heading">This Week</h2>
      
      <div className="field">
        <label className="label">What repeated itself this week?</label>
        <textarea
          value={data.repeated}
          onChange={(e) => setData({ ...data, repeated: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What felt misaligned?</label>
        <textarea
          value={data.misaligned}
          onChange={(e) => setData({ ...data, misaligned: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">What felt stable?</label>
        <textarea
          value={data.stable}
          onChange={(e) => setData({ ...data, stable: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">Where did I override myself?</label>
        <textarea
          value={data.override}
          onChange={(e) => setData({ ...data, override: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">One sentence summary of the week</label>
        <input
          type="text"
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          className="input"
        />
      </div>

      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
}

export default Week;
