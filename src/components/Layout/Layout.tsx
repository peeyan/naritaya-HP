// src/components/Layout.tsx
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <Link to="/">成田屋</Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/cuisine">お料理</Link></li>
            <li><Link to="/rooms">設え</Link></li>
            <li><Link to="/info">ご案内</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Naritaya. All rights reserved.</p>
      </footer>
    </div>
  );
}