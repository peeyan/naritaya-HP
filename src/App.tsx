import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cuisine from './pages/Cuisine';
// import Rooms from './pages/Rooms'; // 作成したらコメントアウトを外す
// import Info from './pages/Info';   // 作成したらコメントアウトを外す

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cuisine" element={<Cuisine />} />
          {/* <Route path="rooms" element={<Rooms />} /> */}
          {/* <Route path="info" element={<Info />} /> */}
          <Route path="*" element={<div>ページが見つかりません</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;