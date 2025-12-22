// src/components/Layout/index.tsx
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [subMessage, setSubMessage] = useState('');

  // ページ遷移時にメニューを閉じる
  const closeMenu = () => setIsMenuOpen(false);

  // 現在のページがリンク先と一致するか判定するヘルパー
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  // メルマガ登録処理
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubMessage(data.message);
      setEmail('');
    } catch (err) {
      setSubMessage('エラーが発生しました');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>成田屋 高屋店</Link>
        </div>

        {/* ハンバーガーアイコン */}
        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニューを開閉する"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* ナビゲーションメニュー */}
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="/cuisine" className={isActive('/cuisine')} onClick={closeMenu}>
                <span className="en">Cuisine</span>
                <span className="jp">お料理</span>
              </Link>
            </li>
            <li>
              <Link to="/rooms" className={isActive('/rooms')} onClick={closeMenu}>
                <span className="en">Rooms</span>
                <span className="jp">お部屋</span>
              </Link>
            </li>
            <li>
              <Link to="/info" className={isActive('/info')} onClick={closeMenu}>
                <span className="en">Info</span>
                <span className="jp">ご案内</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* メニューが開いている時の背景オーバーレイ */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        {/* メルマガ登録フォーム */}
        <div className="newsletter-section">
          <p className="newsletter-title">最新の献立をお届けします</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">登録</button>
          </form>
          {subMessage && <p className="newsletter-msg">{subMessage}</p>}
        </div>
        <p>
          &copy; {new Date().getFullYear()} Naritaya. All rights reserved
          {/* ここに隠しリンクを配置（ただのドットに見せかける） */}
          <Link to="/admin/login" className="secret-link">.　　</Link>
        </p>
      </footer>
    </div>
  );
}