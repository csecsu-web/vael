import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Home from './components/Home';
import Today from './components/Today';
import Week from './components/Week';
import Month from './components/Month';
import LifeOS from './components/LifeOS';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      // Not authenticated
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
    setView('home');
  };

  if (loading) {
    return <div className="container"></div>;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      {view === 'home' && <Home onNavigate={setView} onLogout={handleLogout} />}
      {view === 'today' && <Today onBack={() => setView('home')} />}
      {view === 'week' && <Week onBack={() => setView('home')} />}
      {view === 'month' && <Month onBack={() => setView('home')} />}
      {view === 'lifeos' && <LifeOS onBack={() => setView('home')} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
