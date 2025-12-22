// src/pages/Admin/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        navigate('/admin/menu'); // 成功したらメニュー管理画面へ
      } else {
        const data = await res.json();
        setError(data.message || 'ログインに失敗しました');
      }
    } catch (err) {
      setError('通信エラーが発生しました');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>管理者ログイン</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>ユーザー名</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary-btn">ログイン</button>
      </form>
    </div>
  );
}