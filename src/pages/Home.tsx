// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        {/* 【ここを編集】
          既存サイトのキャッチコピーや、お店の「顔」となる言葉を入れてください。
          <br /> で改行できます。
        */}
        <h1 className="vertical-title">
          季節の移ろいを、<br />
          皿の上に描く。<br />
          <span className="small-text">成田屋の心尽くし</span>
        </h1>
      </div>

      <div className="greeting-section">
        {/* 【ここを編集】
          既存サイトの「ご挨拶」や「こだわり」の文章をここに貼り付けてください。
        */}
        <p className="greeting-text">
          日頃よりご愛顧いただき、誠にありがとうございます。<br />
          当店では、地元の旬の食材にこだわり、<br />
          一品一品丁寧に仕上げております。<br />
          <br />
          喧騒を離れ、心安らぐひとときを<br />
          お過ごしいただければ幸いです。<br />
          <br />
          店主敬白
        </p>

        <div className="action-area">
          <Link to="/cuisine" className="button-link">お料理を見る</Link>
        </div>
      </div>
    </div>
  );
}