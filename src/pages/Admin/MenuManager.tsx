// src/pages/Admin/MenuManager.tsx
import { useState, useEffect, useMemo } from 'react';
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
  image? : string;
};

// 選択用カテゴリ（フォーム用）
const FORM_CATEGORIES = [
  { id: 'course', label: '会席・コース' },
  { id: 'sashimi', label: '刺身・造り' },
  { id: 'grilled', label: '焼き物・煮物' },
  { id: 'fried', label: '揚げ物' },
  { id: 'rice', label: 'ご飯・麺' },
  { id: 'sake', label: '日本酒・焼酎' },
  { id: 'drink', label: 'お飲み物' },
];

// 絞り込み用カテゴリ（タブ用：「すべて」などを追加）
const FILTER_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'recommended', label: '★おすすめ' },
  ...FORM_CATEGORIES
];

export default function MenuManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState('all'); // 選択中のタブ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const [selectedNewsletterIds, setSelectedNewsletterIds] = useState<number[]>([]);

  // フォーム入力用ステート
  const [formData, setFormData] = useState<MenuItem>({
    name: '', description: '', price: 0, category: 'course', is_recommended: false, image: ''
  });

  // 画像ファイルをBase64の文字データに変換する関数（コンポーネント内に追加）
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setFormData(prev => ({ ...prev, image: compressedBase64 }));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // データ取得
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.status === 401) { navigate('/admin/login'); return; }
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

  // 保存処理
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("送信するデータ:", formData);
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

  // モーダルを開く
  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item, is_recommended: !!item.is_recommended });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: 'course', is_recommended: false, image: '' });
    }
    setIsModalOpen(true);
  };

  // 表示データの絞り込み
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    if (activeTab === 'recommended') return items.filter(i => i.is_recommended);
    return items.filter(i => i.category === activeTab);
  }, [items, activeTab]);

  // メルマガ配信モーダルを開く
  const openNewsletterModal = () => {
    // デフォルトで「おすすめ」のIDを選択状態にする
    const recommendedIds = items
      .filter(i => i.is_recommended && i.id !== undefined)
      .map(i => i.id as number);
    setSelectedNewsletterIds(recommendedIds);
    setIsNewsletterModalOpen(true);
  };

  // チェックボックスの切り替え
  const toggleNewsletterSelection = (id: number) => {
    setSelectedNewsletterIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // メルマガ送信実行
  const handleSendNewsletter = async () => {
    if (selectedNewsletterIds.length === 0) {
      alert('配信するメニューを1つ以上選択してください');
      return;
    }
    if (!window.confirm(`選択した${selectedNewsletterIds.length}品のメニューを配信しますか？`)) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuIds: selectedNewsletterIds }),
      });
      const data = await res.json();
      alert(data.message);
      setIsNewsletterModalOpen(false);
    } catch (error) {
      alert('配信に失敗しました');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">メニュー管理</h2>
        <button onClick={() => navigate('/admin/login')} className="logout-btn">ログアウト</button>
      </div>

      <button onClick={() => openModal()} className="primary-btn" style={{ marginBottom: '1.5rem' }}>
        ＋ 新規メニュー追加
      </button>
      <button onClick={openNewsletterModal} className="primary-btn menuManage" style={{ marginTop: 0, flex: 1, backgroundColor: '#555' }}>
        ✉️ メルマガ配信
      </button>

      {/* ★タブ UI */}
      <div className="admin-tabs">
        {FILTER_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`admin-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <ul className="admin-item-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id} className="admin-item">
              <div className="item-header">
                <span>{item.name}</span>
                <span>¥{item.price.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                <span className="category-badge">
                  {FORM_CATEGORIES.find(c => c.id === item.category)?.label}
                </span>
                {item.is_recommended ? <span style={{color:'red', marginLeft:'0.5rem', fontWeight:'bold'}}>★おすすめ</span> : ''}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{item.description}</div>
              <div className="item-actions">
                <button onClick={() => openModal(item)} className="secondary-btn">編集</button>
                <button onClick={() => item.id && handleDelete(item.id)} className="danger-btn">削除</button>
              </div>
            </li>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
            このカテゴリのメニューはありません
          </p>
        )}
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
                <label>写真</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={handleImageChange}
                  style={{ border: 'none', padding: 0 }}
                />
                {/* プレビュー表示 */}
                {formData.image && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={formData.image} alt="プレビュー" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button type="button" onClick={() => setFormData({...formData, image: ''})} className="secondary-btn" style={{ fontSize: '0.8rem', padding: '0.3rem', marginTop: '0.5rem' }}>写真を削除</button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>カテゴリ</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {FORM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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

      {/* メルマガ配信選択モーダル */}
      {isNewsletterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0 }}>配信メニュー選択</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              メルマガに載せるメニューを選択してください。<br/>
              (初期状態では「おすすめ」が選択されています)
            </p>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map(item => (
                  <li key={item.id} style={{ padding: '0.8rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', width: '100%', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={item.id ? selectedNewsletterIds.includes(item.id) : false}
                        onChange={() => item.id && toggleNewsletterSelection(item.id)}
                        style={{ transform: 'scale(1.5)', marginRight: '1rem' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                          {FORM_CATEGORIES.find(c => c.id === item.category)?.label}
                          {item.is_recommended && <span style={{color:'red', marginLeft:'0.5rem'}}>★おすすめ</span>}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setIsNewsletterModalOpen(false)} className="secondary-btn" style={{flex:1}}>キャンセル</button>
              <button onClick={handleSendNewsletter} className="primary-btn" style={{flex:1, marginTop:0}}>
                送信 ({selectedNewsletterIds.length}件)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}