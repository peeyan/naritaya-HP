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
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.566379967736!2d133.9472382762756!3d34.64032128647246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3554070000000001%3A0x0!2z5oiQ55Sw5bGLIOmqnOWxi-W6lw!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}