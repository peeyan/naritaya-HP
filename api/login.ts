// api/login.ts
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  // セキュリティ対策: POSTメソッド以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // DB接続
  const connection = await createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  });

  try {
    // ユーザー検索
    const [rows]: any = await connection.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'ユーザー名またはパスワードが違います' });
    }

    const user = rows[0];

    // パスワード照合
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'ユーザー名またはパスワードが違います' });
    }

    // JWT（認証トークン）の発行
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' } // 8時間有効
    );

    // クッキーに保存（HttpOnly属性でJavaScriptからのアクセスを防ぐ）
    res.setHeader('Set-Cookie', serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPS必須
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    }));

    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await connection.end();
  }
}