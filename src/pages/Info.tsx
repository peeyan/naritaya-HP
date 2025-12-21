// src/pages/Info.tsx
export default function Info() {
  return (
    <div className="info-page">
      <h2 className="section-title">ご案内</h2>
      
      <div className="info-content">
        <dl className="info-list">
          <div className="info-item">
            <dt>店名</dt>
            <dd>成田屋 (Naritaya)</dd>
          </div>
          
          <div className="info-item">
            <dt>住所</dt>
            {/* 【ここを編集】既存サイトの住所を記入 */}
            <dd>
              〒000-0000<br />
              （ここに住所を入力してください）<br />
              （ビル名など）
            </dd>
          </div>

          <div className="info-item">
            <dt>電話番号</dt>
            {/* 【ここを編集】既存サイトの電話番号を記入 */}
            <dd>00-0000-0000</dd>
          </div>

          <div className="info-item">
            <dt>営業時間</dt>
            {/* 【ここを編集】既存サイトの営業時間を記入 */}
            <dd>
              昼 11:30 〜 14:00 (L.O. 13:30)<br />
              夜 17:30 〜 22:00 (L.O. 21:00)
            </dd>
          </div>

          <div className="info-item">
            <dt>定休日</dt>
            {/* 【ここを編集】既存サイトの定休日を記入 */}
            <dd>水曜日・第一木曜日</dd>
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