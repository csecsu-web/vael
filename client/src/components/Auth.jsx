import React, { useState } from 'react';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      onLogin(data);
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <div className="auth-box">
      <h1 className="title">Personal Reflection</h1>
      
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
          minLength={8}
        />
        
        <button type="submit" className="button">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
        }}
        className="link-button"
      >
        {mode === 'login' ? 'Need an account?' : 'Have an account?'}
      </button>

      <p className="disclaimer">
        This system is a reflective tool. It does not provide medical, psychological, 
        or therapeutic services and does not replace professional care.
      </p>
    </div>
  );
}

export default Auth;
