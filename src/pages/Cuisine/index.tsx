// src/pages/Cuisine/index.tsx
import { useState, useEffect, useMemo } from 'react';
import './Cuisine.css';

// 1. 型定義に 'recommended' を追加
type CategoryId = 'recommended' | 'all' | 'course' | 'sashimi' | 'grilled' | 'fried' | 'rice' | 'sake' | 'drink';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: CategoryId | string; // recommended以外の本来のカテゴリも持てるようにstringも許容
  isRecommended?: boolean; // おすすめフラグ
};

export default function Cuisine() {
  const [items, setItems] = useState<MenuItem[]>([]);
  // 初期タブを 'recommended'（本日のおすすめ）にして、最初に一番見せたいものを表示します
  const [activeTab, setActiveTab] = useState<CategoryId>('recommended');
  const [searchTerm, setSearchTerm] = useState('');

  // 2. カテゴリ定義（先頭に「本日のおすすめ」を追加）
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
    // データ（isRecommended: true のものが「本日のおすすめ」タブに表示されます）
    setItems([
      { id: 1, name: "季節の会席「花鳥」", description: "旬の食材をふんだんに使った、目にも鮮やかなコースです。", price: 5500, category: 'course', isRecommended: true },
      { id: 2, name: "店主おまかせコース", description: "その日の特選素材で仕立てる、一期一会の味わい。", price: 8800, category: 'course' },
      { id: 3, name: "本日の特選お造り盛り合わせ", description: "市場直送、その日一番の鮮魚を五種盛りで。", price: 2200, category: 'sashimi', isRecommended: true },
      { id: 4, name: "のどぐろの塩焼き", description: "脂の乗った高級魚を、炭火で香ばしく。", price: 3200, category: 'grilled', isRecommended: true },
      { id: 5, name: "能登牛のたたき", description: "とろけるような食感と濃厚な旨味。", price: 2800, category: 'grilled' },
      { id: 6, name: "加賀野菜の天ぷら", description: "季節の野菜をサクサクの衣で。", price: 1200, category: 'fried' },
      { id: 7, name: "手打ち冷やしすだち蕎麦", description: "〆に最適。爽やかな香りと喉越し。", price: 950, category: 'rice' },
      { id: 8, name: "手取川 (大吟醸)", description: "華やかな香りとキレのある後味。", price: 1200, category: 'sake' },
      { id: 9, name: "菊姫 (山廃純米)", description: "濃厚な米の旨味と酸味。", price: 1000, category: 'sake' },
      { id: 10, name: "生ビール (琥珀エビス)", description: "芳醇なコク。", price: 750, category: 'drink' },
      // ... 他のメニュー
    ]);
  }, []);

  // 3. フィルタリング処理の修正
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // カテゴリ判定ロジック
      let categoryMatch = false;

      if (activeTab === 'all') {
        // 「すべて表示」なら全部OK
        categoryMatch = true;
      } else if (activeTab === 'recommended') {
        // 「本日のおすすめ」なら isRecommended フラグを見る
        categoryMatch = item.isRecommended === true;
      } else {
        // それ以外はカテゴリが一致するかどうか
        categoryMatch = item.category === activeTab;
      }

      // 検索ワード判定
      const searchMatch = item.name.includes(searchTerm) || item.description.includes(searchTerm);
      
      return categoryMatch && searchMatch;
    });
  }, [items, activeTab, searchTerm]);

  return (
    <div className="cuisine-page">
      <div className="cuisine-header">
        <h2 className="section-title">お品書き</h2>
        <p className="intro-text">
          百を超える品々より、<br />
          今宵の一皿をお選びください。
        </p>
        
        {/* 検索ボックス */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="お料理名や食材で探す..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* タブナビゲーション */}
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
              <div key={item.id} className={`menu-card ${item.isRecommended ? 'recommended' : ''}`}>
                <div className="menu-header">
                  <h4 className="menu-name">
                    {item.name}
                    {/* おすすめタブ以外の時でも、おすすめ品にはバッジを表示 */}
                    {item.isRecommended && <span className="badge">おすすめ</span>}
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