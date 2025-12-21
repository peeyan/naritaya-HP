// src/pages/Cuisine.tsx
import { useState, useEffect } from 'react';
import './Cuisine.css';

// メニューの型定義（将来的にデータベースの設計図になります）
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'course' | 'single' | 'drink'; // カテゴリ分け
};

export default function Cuisine() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // 【ここを編集】既存サイトのメニューをここに入力してください
    setItems([
      // --- コース料理 ---
      { 
        id: 1, 
        name: "季節の会席「花鳥」", 
        description: "旬の食材をふんだんに使った、目にも鮮やかなコースです。", 
        price: 5500, 
        category: 'course' 
      },
      { 
        id: 2, 
        name: "店主おまかせコース", 
        description: "その日の特選素材で仕立てる、一期一会の味わい。", 
        price: 8800, 
        category: 'course' 
      },
      // --- 一品料理 ---
      { 
        id: 3, 
        name: "特選和牛のすき焼き", 
        description: "厳選された和牛の旨味を特製の割り下で。", 
        price: 3800, 
        category: 'single' 
      },
      { 
        id: 4, 
        name: "本日のお造り盛り合わせ", 
        description: "市場直送の鮮魚を三種盛りで。", 
        price: 1800, 
        category: 'single' 
      },
      // --- お飲み物（必要なら追加） ---
      { 
        id: 5, 
        name: "地酒 各種", 
        description: "店主が選び抜いた銘酒を取り揃えております。", 
        price: 900, 
        category: 'drink' 
      },
    ]);
  }, []);

  // カテゴリごとにフィルタリングする関数
  const renderCategory = (title: string, catKey: string) => {
    const categoryItems = items.filter(i => i.category === catKey);
    if (categoryItems.length === 0) return null;

    return (
      <section className="menu-category-section">
        <h3 className="category-title">{title}</h3>
        <div className="menu-grid">
          {categoryItems.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-text">
                <h4 className="menu-name">{item.name}</h4>
                <p className="menu-desc">{item.description}</p>
              </div>
              <div className="menu-price">
                ¥{item.price.toLocaleString()}<span className="tax-label">（税込）</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="cuisine-page">
      <h2 className="section-title">お品書き</h2>
      <p className="intro-text">
        四季折々の恵みを、<br />
        匠の技で一皿に込めました。
      </p>

      {renderCategory("会席・コース", "course")}
      {renderCategory("逸品", "single")}
      {renderCategory("お飲み物", "drink")}
    </div>
  );
}