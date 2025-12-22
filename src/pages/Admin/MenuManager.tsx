// src/pages/Admin/MenuManager.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

// メニュー項目の型定義
type MenuItem = {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_recommended: boolean;
};

// カテゴリ定義（Cuisineページと同じもの）
const CATEGORIES = [
  { id: 'course', label: '会席・コース' },
  { id: 'sashimi', label: '刺身・造り' },
  { id: 'grilled', label: '焼き物・煮物' },
  { id: 'fried', label: '揚げ物' },
  { id: 'rice', label: 'ご飯・麺' },
  { id: 'sake', label: '日本酒・焼酎' },
  { id: 'drink', label: 'お飲み物' },
];

export default function MenuManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // フォーム入力用ステート
  const [formData, setFormData] = useState<MenuItem>({
    name: '', description: '', price: 0, category: 'course', is_recommended: false
  });

  // データ取得
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.status === 401) { navigate('/admin/login'); return; } // 未ログインなら飛ばす
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 削除処理
  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchItems();
      else alert('削除に失敗しました');
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  // 保存処理（追加・更新）
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem ? { ...formData, id: editingItem.id } : formData;

    try {
      const res = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  // モーダルを開く（新規・編集共通）
  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item, is_recommended: !!item.is_recommended }); // true/falseを確実に
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: 'course', is_recommended: false });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">メニュー管理</h2>
        {/* 簡易ログアウト（Cookieを削除する処理はないが、ログイン画面に戻す） */}
        <button onClick={() => navigate('/admin/login')} className="logout-btn">ログアウト</button>
      </div>

      <button onClick={() => openModal()} className="primary-btn" style={{ marginBottom: '2rem' }}>
        ＋ 新規メニュー追加
      </button>

      <ul className="admin-item-list">
        {items.map((item) => (
          <li key={item.id} className="admin-item">
            <div className="item-header">
              <span>{item.name}</span>
              <span>¥{item.price.toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              {CATEGORIES.find(c => c.id === item.category)?.label} 
              {item.is_recommended ? <span style={{color:'red', marginLeft:'0.5rem'}}>★おすすめ</span> : ''}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.description}</div>

            <div className="item-actions">
              <button onClick={() => openModal(item)} className="secondary-btn">編集</button>
              <button onClick={() => item.id && handleDelete(item.id)} className="danger-btn">削除</button>
            </div>
          </li>
        ))}
      </ul>

      {/* 入力モーダル */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginTop: 0 }}>{editingItem ? 'メニュー編集' : '新規追加'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>料理名</label>
                <input
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>説明文</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>価格 (円)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>カテゴリ</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_recommended}
                    onChange={e => setFormData({...formData, is_recommended: e.target.checked})}
                  /> 本日のおすすめにする
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn" style={{flex:1}}>キャンセル</button>
                <button type="submit" className="primary-btn" style={{flex:1, marginTop:0}}>保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}