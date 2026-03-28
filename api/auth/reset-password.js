import { db } from '../../lib/db'; // DB接続ファイル（環境に合わせてパスを調整してください）
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

  try {
    // 2. 新しいパスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. データベースのパスワードを更新 (テーブル名やカラム名は環境に合わせてください)
    // ここでは users テーブルに username と password_hash カラムがあると仮定しています
    const [result] = await db.execute(
      'UPDATE users SET password_hash = ? WHERE username = ?',
      [hashedPassword, username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }

    res.status(200).json({ message: 'パスワードをリセットしました。新しいパスワードでログインしてください。' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}