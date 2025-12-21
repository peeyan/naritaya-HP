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
            <dd>
              <a href="tel:0869558411" className="tel-link">086-955-8411</a>
            </dd>
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
      <iframe
          title="Google Maps"
          src="https://maps.google.com/maps?q=〒709-0811%20岡山県赤磐市高屋%20405-13&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}