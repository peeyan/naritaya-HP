// src/pages/Info.tsx
import './Info.css';

export default function Info() {
  return (
    <div className="info-page">
      <h2 className="section-title">ご案内</h2>

      <div className="info-content">
        <dl className="info-list">
          <div className="info-item">
            <dt>店名</dt>
            <dd>成田屋 高屋店(Naritaya-takayaten)</dd>
          </div>

          <div className="info-item">
            <dt>住所</dt>
            <dd>
              〒709-0811<br />
              岡山県赤磐市高屋 405-13
            </dd>
          </div>

          <div className="info-item">
            <dt>電話番号</dt>
            <dd>086-955-8411</dd>
          </div>

          <div className="info-item">
            <dt>営業時間</dt>
            <dd>
              16:30 〜 22:00 (L.O. 21:30)
            </dd>
          </div>

          <div className="info-item">
            <dt>定休日</dt>
            <dd>月曜日</dd>
          </div>
        </dl>
      </div>

      <div className="map-placeholder">
        {/* 将来的にGoogle Mapsを埋め込む場所 */}
        <p>Google Maps Area</p>
      </div>
    </div>
  );
}