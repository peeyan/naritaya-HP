import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cuisine from './pages/Cuisine';
import Rooms from './pages/Rooms';
import Info from './pages/Info';
import Login from './pages/Admin/Login';
import MenuManager from './pages/Admin/MenuManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cuisine" element={<Cuisine />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="info" element={<Info />} />
          <Route path="*" element={<div>ページが見つかりません</div>} />

          {/* 管理画面（レイアウトなし） */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/menu" element={<MenuManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;