// api/auth/reset-password.js
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, recoveryKey, newPassword } = req.body;

  // 1. 環境変数の合言葉と一致するかチェック
  if (recoveryKey !== process.env.RECOVERY_KEY) {
    return res.status(403).json({ message: '合言葉が間違っています。' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: '新しいパスワードは6文字以上で入力してください。' });
  }

  let connection;
  try {
    // 2. 他のAPIと同じ方法でデータベースに接続
    connection = await createConnection({
      host: process.env.TIDB_HOST,
      port: parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    });

    // 3. 新しいパスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. 管理者テーブル（admin_users）のパスワードを更新
    const [result] = await connection.execute(
      'UPDATE admin_users SET password_hash = ? WHERE username = ?',
      [hashedPassword, username]
    );

    // 更新された行が0なら、該当するユーザー名がない
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。ユーザー名を確認してください。' });
    }

    res.status(200).json({ message: 'パスワードをリセットしました。新しいパスワードでログインしてください。' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  } finally {
    // 最後に必ず接続を閉じる
    if (connection) {
      await connection.end();
    }
  }
}