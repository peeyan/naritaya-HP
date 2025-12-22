// api/subscribe.ts
import { createConnection } from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: '有効なメールアドレスを入力してください' });
  }

  const connection = await createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });

  try {
    await connection.execute(
      'INSERT INTO subscribers (email) VALUES (?)',
      [email]
    );
    res.status(201).json({ message: '登録しました' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      // 既に登録済みでもエラーにはせず、成功として扱う（UXのため）
      res.status(200).json({ message: '登録しました' });
    } else {
      console.error('Subscribe Error:', error);
      res.status(500).json({ message: 'エラーが発生しました' });
    }
  } finally {
    await connection.end();
  }
}