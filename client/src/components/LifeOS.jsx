import React, { useState, useEffect } from 'react';

function LifeOS({ onBack, onLogout }) {
  const [data, setData] = useState({
    refuse: ['', '', ''],
    badAt: ['', '', ''],
    slowDown: ['', '', '']
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLifeOS();
  }, []);

  const loadLifeOS = async () => {
    try {
      const response = await fetch('/api/entries/lifeos', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const lifeos = await response.json();
        if (lifeos) {
          setData(lifeos);
        }
      }
    } catch (err) {
      console.error('Failed to load LifeOS:', err);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/entries/lifeos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onBack();
      } else {
        alert('Failed to save LifeOS');
      }
    } catch (err) {
      alert('Connection failed');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This will permanently delete all your data. This cannot be undone. Continue?'
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/entries/delete-account', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        onLogout();
      } else {
        alert('Failed to delete account');
      }
    } catch (err) {
      alert('Connection failed');
    }
  };

  const updateField = (category, index, value) => {
    const newData = { ...data };
    newData[category][index] = value;
    setData(newData);
  };

  if (loading) {
    return <div className="content"></div>;
  }

  return (
    <div className="content">
      <button onClick={onBack} className="back-button">← Home</button>
      <h2 className="heading">LifeOS</h2>
      
      <div className="lifeos-section">
        <h3 className="subheading">3 Things I Refuse to Trade</h3>
        {data.refuse.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => updateField('refuse', index, e.target.value)}
            className="input"
            style={{ marginBottom: '10px' }}
          />
        ))}
      </div>

      <div className="lifeos-section">
        <h3 className="subheading">3 Things I'm Allowed to Be Bad At</h3>
        {data.badAt.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => updateField('badAt', index, e.target.value)}
            className="input"
            style={{ marginBottom: '10px' }}
          />
        ))}
      </div>

      <div className="lifeos-section">
        <h3 className="subheading">3 Signals That Mean I Should Slow Down</h3>
        {data.slowDown.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => updateField('slowDown', index, e.target.value)}
            className="input"
            style={{ marginBottom: '10px' }}
          />
        ))}
      </div>

      <button onClick={handleSave} className="save-button">Save</button>
      
      <div className="danger-zone">
        <button onClick={handleDeleteAccount} className="delete-button">
          Delete All Data
        </button>
      </div>
    </div>
  );
}

export default LifeOS;
