// api/menu.ts
import { createConnection } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

// DB接続ヘルパー
const createDBConnection = async () => {
  return await createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });
};

// 認証チェックヘルパー
const checkAuth = (req) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) throw new Error('No token');

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return true;
  } catch (e) {
    throw new Error('Invalid token');
  }
};

export default async function handler(req, res) {
  const connection = await createDBConnection();

  try {
    // --- GET: メニュー一覧取得 ---
    if (req.method === 'GET') {
      const [rows] = await connection.execute(
        'SELECT * FROM menu_items ORDER BY category, id DESC'
      );
      return res.status(200).json(rows);
    }

    // ★これ以降の操作（POST, PUT, DELETE）は認証が必要★
    try {
      checkAuth(req);
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // --- POST: 新規追加 ---
    if (req.method === 'POST') {
      const { name, description, price, category, is_recommended, image } = req.body;
      await connection.query(
        'INSERT INTO menu_items (name, description, price, category, is_recommended, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description || '', price, category, is_recommended ? 1 : 0, image || null]
      );
      return res.status(201).json({ message: 'Created' });
    }

    // --- PUT: 更新 ---
    if (req.method === 'PUT') {
      const { id, name, description, price, category, is_recommended, image } = req.body;
      await connection.query(
        'UPDATE menu_items SET name=?, description=?, price=?, category=?, is_recommended=?, image=? WHERE id=?',
        [name, description || '', price, category, is_recommended ? 1 : 0, id, image || null]
      );
      return res.status(200).json({ message: 'Updated' });
    }

    // --- DELETE: 削除 ---
    if (req.method === 'DELETE') {
      const { id } = req.body; // または req.query.id
      await connection.execute('DELETE FROM menu_items WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Deleted' });
    }

    // それ以外のメソッド
    res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    await connection.end();
  }
}