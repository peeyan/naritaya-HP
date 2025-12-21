// src/pages/Rooms/index.tsx
import './Rooms.css';

export default function Rooms() {
  return (
    <div className="rooms-page">
      <h2 className="section-title">設え</h2>
      <p className="intro-text">
        心安らぐ和の空間で、<br />
        特別なひとときを。
      </p>

      <div className="room-section">
        {/* 将来的に写真を入れやすくするための枠組み */}
        <div className="room-card reverse">
          <div className="room-image-placeholder">
            <span>カウンター席の写真</span>
          </div>
          <div className="room-text">
            <h3>カウンター席</h3>
            <p>
              店主の包丁さばきや、炭火の香りを間近で愉しめる特等席。<br />
              お一人様や、大切な方との語らいに。
            </p>
          </div>
        </div>

        <div className="room-card">
          <div className="room-image-placeholder">
            <span>個室の写真</span>
          </div>
          <div className="room-text">
            <h3>個室「松の間」</h3>
            <p>
              掘りごたつ式の落ち着いた個室です。<br />
              ご接待やご家族での会食など、プライベートな空間で<br />
              周りを気にせずお過ごしいただけます。<br />
              （4名様〜8名様）
            </p>
          </div>
        </div>

        <div className="room-card reverse">
          <div className="room-image-placeholder">
            <span>お座敷の写真</span>
          </div>
          <div className="room-text">
            <h3>お座敷</h3>
            <p>
              大人数でのご宴会にも対応できる広間です。<br />
              季節の掛け軸や生け花が、宴に彩りを添えます。<br />
              （最大20名様まで）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}