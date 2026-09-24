import { useState, useCallback } from 'react';
import InteractiveCharacter from './components/InteractiveCharacter';
import { FloatingCompanion } from './components/FloatingCompanion';
import { PetalCanvas } from './components/PetalCanvas';
import { LetterboxDeck } from './components/LetterboxDeck';
import { BIRTHDAY_INFO } from './lib/birthdayData';
import './App.css';

function App() {
  // Posisi target kursor/companion (disinkronkan dengan sentuhan HP atau mouse)
  const [companionPos, setCompanionPos] = useState<{ x: number; y: number } | null>(null);
  // State untuk harapan pengguna
  const [userWish, setUserWish] = useState('');
  const [submittedWish, setSubmittedWish] = useState<string | null>(null);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (userWish.trim()) {
      setSubmittedWish(userWish.trim());
    }
  };

  const handleCompanionMove = useCallback((x: number, y: number) => {
    setCompanionPos({ x, y });
  }, []);

  return (
    <div className="birthday-app">
      {/* 1. Kelopak Bunga & Daun Stroberi Melayang Halus di Background */}
      <PetalCanvas />

      {/* 2. Floating Companion (Stroberi / Bunga yang bisa di-drag di layar HP) */}
      <FloatingCompanion onPositionChange={handleCompanionMove} />

      {/* 3. Hero Section dengan Karakter Interaktif */}
      <header className="hero-section">
        <div className="hero-pill">
          <span>🌸</span>
          <span>A Special Gift For Sabiru?</span>
          <span>🍓</span>
        </div>

        <h1 className="hero-title">
          Happy Birthday, <span>{BIRTHDAY_INFO.name}</span>!
        </h1>

        <p className="hero-subtitle">
          {BIRTHDAY_INFO.tagline}
        </p>

        {/* Karakter 9 Arah dengan Lerp Physics & 2.5D Parallax */}
        <InteractiveCharacter externalTarget={companionPos} />

        <a href="#wishes" className="scroll-indicator" aria-label="Gulir ke bawah untuk membaca pesan">
          <span>Open The Letter</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </header>

      {/* 4. Scroll Reveal Section: Kartu Ucapan Bertahap */}
      <main id="wishes" className="wishes-section">
        {/* <div className="section-header">
          <span className="section-tag"></span>
          <h2 className="section-title"></h2>
          <p className="section-desc">
            Setiap kartu menyimpan sebaris doa manis dan ketulusan.
          </p>
        </div> */}

        {/* Card Deck Interaktif: Amplop Surat Awal -> Slide/Hover ke Belakang */}
        <LetterboxDeck />

        {/* 5. Bagian Harapan Pribadi (Wish Box) & Pesan Balasan */}
        <section className="birthday-finale">
          <div className="birthday-finale__icon" role="img" aria-label="Wish Icon">
            {submittedWish ? '💌✨🌸' : '🎂🍓✨'}
          </div>

          {!submittedWish ? (
            <form onSubmit={handleSubmitWish} className="wish-form">
              <h3 className="birthday-finale__title">Harapanmu Tahun Ini & Kedepannya 🌸</h3>
              <p className="birthday-finale__text">
                Tuliskan apa saja impian, doa, atau harapan yang paling ingin kamu capai di lembaran baru ini:
              </p>

              <div className="wish-input-wrapper">
                <textarea
                  className="wish-textarea"
                  value={userWish}
                  onChange={(e) => setUserWish(e.target.value)}
                  placeholder="Ketik harapanmu di sini ya Ren... ✨"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="birthday-finale__btn">
                Kirim Harapan Ini 💌✨
              </button>
            </form>
          ) : (
            <div className="wish-response-card">
              <div className="wish-quote-display">
                <span className="wish-quote-label">Harapan yang kamu panjatkan:</span>
                <p className="wish-quote-text">"{submittedWish}"</p>
              </div>

              <div className="wish-divider" />

              <div className="wish-response-message">
                <p className="wish-reply-main">
                  Semoga kecapai yaa Ren... 🌸✨
                </p>
                <p className="wish-reply-sub">
                  dan dari aku, longg last yaa...
                </p>
                <p className="wish-signature">
                  — <strong>Renatha Angelina</strong> 💖
                </p>
              </div>

              <button
                type="button"
                className="wish-edit-btn"
                onClick={() => setSubmittedWish(null)}
              >
                Tulis Harapan Lain ✎
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
