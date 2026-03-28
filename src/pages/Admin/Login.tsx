// src/pages/Admin/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // パスワードリセット用のState
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

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

  // パスワードリセット処理
  const handleResetPassword = async (e:any) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, recoveryKey, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('パスワードをリセットしました。');
        setIsResetMode(false); // ログイン画面に戻す
        setPassword('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('エラーが発生しました。');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>管理者ログイン</h2>
      {error && <p className="error-msg">{error}</p>}
      {message && <p className="message">{message}</p>}

      {!isResetMode ? (
        // --- 通常のログインフォーム ---
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
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button type="button" onClick={() => setIsResetMode(true)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
              パスワードを忘れた場合はこちら
            </button>
          </div>
        </form>
      ) : (
        // --- パスワードリセットフォーム ---
        <form onSubmit={handleResetPassword}>
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
            <label>リセットキー</label>
            <input
              type="password"
              className="form-input"
              value={recoveryKey}
              onChange={(e) => setRecoveryKey(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>新しいパスワード</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-btn">パスワードをリセットする</button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setMessage('');
              }}
              style={{ background: 'none', border: 'none', color: 'gray', textDecoration: 'underline', cursor: 'pointer' }}
            >
              ログイン画面に戻る
            </button>
          </div>
        </form>
      )}
    </div>
  );
}