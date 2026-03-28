// src/pages/Cuisine/index.tsx
import { useState, useEffect, useMemo } from 'react';
import './Cuisine.css';

// カテゴリ定義
type CategoryId = 'recommended' | 'all' | 'course' | 'sashimi' | 'grilled' | 'fried' | 'rice' | 'sake' | 'drink';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: CategoryId | string;
  is_recommended?: boolean;
  image?: string;
};

export default function Cuisine() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryId>('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // 読み込み中フラグ

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'recommended', label: '本日のおすすめ' },
    { id: 'course', label: '会席・コース' },
    { id: 'sashimi', label: '刺身・造り' },
    { id: 'grilled', label: '焼き物・煮物' },
    { id: 'fried', label: '揚げ物' },
    { id: 'rice', label: 'ご飯・麺' },
    { id: 'sake', label: '日本酒・焼酎' },
    { id: 'drink', label: 'お飲み物' },
    { id: 'all', label: 'すべて表示' },
  ];

  useEffect(() => {
    // APIからデータを取得する関数
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu'); // 作成したAPIを呼び出す
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('メニューの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      let categoryMatch = false;
      if (activeTab === 'all') {
        categoryMatch = true;
      } else if (activeTab === 'recommended') {
        // DBのカラム名(is_recommended)に合わせて判定
        // MySQLのBOOLEANは 1 or 0 で返ってくることがあるため !! で真偽値に変換
        categoryMatch = !!item.is_recommended;
      } else {
        categoryMatch = item.category === activeTab;
      }

      const searchMatch = item.name.includes(searchTerm) || (item.description && item.description.includes(searchTerm));
      return categoryMatch && searchMatch;
    });
  }, [items, activeTab, searchTerm]);

  if (loading) {
    return <div className="cuisine-page"><p className="intro-text">お品書きを読み込んでいます...</p></div>;
  }

  return (
    <div className="cuisine-page">
      <div className="cuisine-header">
        <h2 className="section-title">お品書き</h2>
        <p className="intro-text">
          数多の品々より、<br />
          今宵の一皿をお選びください。
        </p>
        <p className='understand-text'>
          季節や仕入れ状況により、<br />
          メニュー内容が変更される場合がございます。<br />
          予めご了承ください。
        </p>

        <div className="search-container">
          <input
            type="text"
            placeholder="お料理名や食材で探す..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <nav className="category-tabs">
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button 
                  className={`tab-button ${activeTab === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="menu-content">
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className={`menu-card ${item.is_recommended ? 'recommended' : ''}`}>
                {/* 写真があれば表示する */}
                {item.image && (
                  <img src={item.image} alt={item.name} className="menu-image" />
                )}
                <div className="menu-header">
                  <h4 className="menu-name">
                    {item.name}
                    {!!item.is_recommended && <span className="badge">おすすめ</span>}
                  </h4>
                  <div className="menu-price">
                    ¥{item.price.toLocaleString()}<span className="tax-label">（税込）</span>
                  </div>
                </div>
                <p className="menu-desc">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>該当するお料理が見つかりませんでした。</p>
          </div>
        )}
      </div>
    </div>
  );
}