// api/newsletter.ts
import { createConnection } from 'mysql2/promise';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

// 認証チェック (menu.tsと同じロジック)
const checkAuth = (req) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.auth_token;
  if (!token) throw new Error('No token');
  jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    checkAuth(req); // 管理者のみ実行可能
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
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
    // 1. 購読者リストを取得
    const [subscribers]: any = await connection.execute('SELECT email FROM subscribers');
    if (subscribers.length === 0) {
      return res.status(200).json({ message: '購読者がいません' });
    }

    // 2. 「本日のおすすめ」メニューを取得
    const [menuItems]: any = await connection.execute(
      'SELECT name, price, description FROM menu_items WHERE is_recommended = 1'
    );

    if (menuItems.length === 0) {
      return res.status(400).json({ message: 'おすすめメニューが登録されていません' });
    }

    // 3. メール本文の作成
    const menuListText = menuItems.map((item: any) => (
      `■ ${item.name} (¥${item.price.toLocaleString()})\n${item.description || ''}`
    )).join('\n\n');

    const subject = '【成田屋】季節の献立が新しくなりました';
    const text = `
いつも成田屋をご利用いただき、ありがとうございます。
本日のおすすめメニューをご紹介いたします。

--------------------------------------------------
${menuListText}
--------------------------------------------------

皆様のご来店を心よりお待ち申し上げております。

成田屋 高屋店
〒709-0811 岡山県赤磐市高屋 405-13
`;

    // 4. 送信設定 (SMTP設定がない場合はログ出力のみ)
    if (!process.env.SMTP_HOST) {
      console.log('--- Mock Email Send ---');
      console.log('To:', subscribers.map((s:any) => s.email).join(', '));
      console.log('Subject:', subject);
      console.log('Body:', text);
      return res.status(200).json({ message: 'メール送信シミュレーション完了（サーバーログを確認してください）' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 一斉送信（BCCを使用）
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      bcc: subscribers.map((s: any) => s.email),
      subject: subject,
      text: text,
    });

    res.status(200).json({ message: `購読者${subscribers.length}名に配信しました` });

  } catch (error) {
    console.error('Newsletter Error:', error);
    res.status(500).json({ message: '配信に失敗しました' });
  } finally {
    await connection.end();
  }
}