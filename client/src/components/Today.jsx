import React, { useState, useEffect } from 'react';

function Today({ onBack }) {
  const [data, setData] = useState({
    energyDirection: '',
    moment: '',
    pressureSource: '',
    bodyState: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const response = await fetch(`/api/entries/daily/${today}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const entry = await response.json();
        if (entry) {
          setData({
            energyDirection: entry.energy_direction || '',
            moment: entry.moment || '',
            pressureSource: entry.pressure_source || '',
            bodyState: entry.body_state || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to load entry:', err);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data.energyDirection || !data.moment) {
      alert('Energy Direction and One Moment are required');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('/api/entries/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: today,
          energyDirection: data.energyDirection,
          moment: data.moment,
          pressureSource: data.pressureSource,
          bodyState: data.bodyState
        }),
      });

      if (response.ok) {
        onBack();
      } else {
        alert('Failed to save entry');
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
      <h2 className="heading">Today</h2>
      
      <div className="field">
        <label className="label">Energy Direction *</label>
        <select
          value={data.energyDirection}
          onChange={(e) => setData({ ...data, energyDirection: e.target.value })}
          className="select"
        >
          <option value="">Select</option>
          <option value="gave">Gave energy</option>
          <option value="neutral">Neutral</option>
          <option value="drained">Drained energy</option>
        </select>
      </div>

      <div className="field">
        <label className="label">One Moment That Mattered *</label>
        <textarea
          value={data.moment}
          onChange={(e) => setData({ ...data, moment: e.target.value })}
          className="textarea"
        />
      </div>

      <div className="field">
        <label className="label">Pressure Source</label>
        <select
          value={data.pressureSource}
          onChange={(e) => setData({ ...data, pressureSource: e.target.value })}
          className="select"
        >
          <option value="">Select</option>
          <option value="external">External expectations</option>
          <option value="self">Self-expectations</option>
          <option value="uncertainty">Uncertainty</option>
          <option value="comparison">Comparison</option>
          <option value="time">Time pressure</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="field">
        <label className="label">Body State</label>
        <select
          value={data.bodyState}
          onChange={(e) => setData({ ...data, bodyState: e.target.value })}
          className="select"
        >
          <option value="">Select</option>
          <option value="grounded">Grounded</option>
          <option value="tense">Tense</option>
          <option value="numb">Numb</option>
          <option value="scattered">Scattered</option>
        </select>
      </div>

      <button onClick={handleSave} className="save-button">Save</button>
    </div>
  );
}

export default Today;
