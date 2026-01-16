import React from 'react';

function Home({ onNavigate, onLogout }) {
  return (
    <div className="content">
      <nav className="nav">
        <button onClick={() => onNavigate('today')} className="nav-link">
          Today
        </button>
        
        <button onClick={() => onNavigate('week')} className="nav-link">
          This Week
        </button>
        
        <button onClick={() => onNavigate('month')} className="nav-link">
          This Month
        </button>
        
        <button onClick={() => onNavigate('lifeos')} className="nav-link">
          LifeOS
        </button>
        
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Home;
