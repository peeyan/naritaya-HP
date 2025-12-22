// src/components/Layout/index.tsx
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // ページ遷移時にメニューを閉じる
  const closeMenu = () => setIsMenuOpen(false);

  // 現在のページがリンク先と一致するか判定するヘルパー
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

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
                <span className="jp">設え</span>
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
        <p>
          &copy; {new Date().getFullYear()} Naritaya. All rights reserved
          {/* ここに隠しリンクを配置（ただのドットに見せかける） */}
          <Link to="/admin/login" className="secret-link">.</Link>
        </p>
      </footer>
    </div>
  );
}