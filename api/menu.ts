import { createConnection } from 'mysql2/promise';

export default async function handler(req, res) {
  // データベース接続設定
  const connection = await createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });

  try {
    // データベースからメニュー一覧を取得
    const [rows] = await connection.execute(
      'SELECT id, name, description, price, category, is_recommended FROM menu_items'
    );

    // 取得したデータをフロントエンドに返す
    res.status(200).json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  } finally {
    // 接続を閉じる
    await connection.end();
  }
}