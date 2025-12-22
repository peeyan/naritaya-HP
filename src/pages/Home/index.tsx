// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="vertical-title">
          味よし、<br />
          時よし、<br />
          人よし。<br />
          そして、値よし。<br />
          <span className="small-text">高屋店の心尽くし</span>
        </h1>
      </div>

      <div className="greeting-section">
        <p className="greeting-text">
          日頃よりご愛顧いただき、<br /> 誠にありがとうございます。<br />
          当店では、地元の旬の食材にこだわり、<br />
          一品一品丁寧に仕上げております。<br />
          <br />
          喧騒を離れ、心安らぐひとときを<br />
          お過ごしいただければ幸いです。<br />
          <br />
          店主店員一同 敬白
        </p>

        <div className="action-area">
          <Link to="/cuisine" className="button-link">お料理を見る</Link>
        </div>
      </div>
    </div>
  );
}