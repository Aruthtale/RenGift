import React, { useState } from 'react';
import { BIRTHDAY_WISHES, BirthdayWish } from '../lib/birthdayData';
import './LetterboxDeck.css';

export const LetterboxDeck: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const totalCards = BIRTHDAY_WISHES.length;
  const currentWish = BIRTHDAY_WISHES[currentIndex];

  const handleOpenEnvelope = () => {
    setIsOpen(true);
  };

  const handleNextCard = () => {
    if (isSwiping) return;
    setIsSwiping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
      setIsSwiping(false);
    }, 280);
  };

  const handlePrevCard = () => {
    if (isSwiping) return;
    setIsSwiping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
      setIsSwiping(false);
    }, 280);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextCard(); // Swipe kiri -> next
      } else {
        handlePrevCard(); // Swipe kanan -> prev
      }
    }
  };

  return (
    <div className="letterbox-wrapper">
      {!isOpen ? (
        /* ===== 1. TAHAP AWAL: ENVELOPE / SURAT WARM WHITE & PINK ===== */
        <div
          className="envelope-sealed"
          onClick={handleOpenEnvelope}
          role="button"
          tabIndex={0}
          aria-label="Buka Surat Ulang Tahun untuk Rhea"
        >
          <div className="envelope-sealed__flap" />
          <div className="envelope-sealed__body">
            <div className="envelope-sealed__stamp">
              <span>🌸</span>
              <small>Special Gift</small>
            </div>

            <div className="envelope-sealed__seal">
              <span className="seal-heart">🍓</span>
            </div>

            <div className="envelope-sealed__front-text">
              <p className="envelope-to">Untuk: Rhea tercinta 💌</p>
              <p className="envelope-from">Dari seseorang yang mendoakanmu selalu</p>
            </div>
          </div>

          <div className="envelope-sealed__hint">
            <span>Sentuh untuk membuka surat ✨</span>
          </div>
        </div>
      ) : (
        /* ===== 2. TAHAP KEDUA: CARD DECK (SLIDE/HOVER KE BELAKANG) ===== */
        <div className="card-deck-container">
          <div className="deck-controls-top">
            <span className="deck-page-indicator">
              Kartu {currentIndex + 1} dari {totalCards}
            </span>
            <button
              type="button"
              className="deck-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup kembali surat"
            >
              Tutup Surat ✉️
            </button>
          </div>

          <div
            className="deck-stack"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Render 3 visual layers to give realistic 3D depth */}
            {[2, 1, 0].map((depth) => {
              const cardIndex = (currentIndex + depth) % totalCards;
              const wish: BirthdayWish = BIRTHDAY_WISHES[cardIndex];
              const isTop = depth === 0;

              return (
                <div
                  key={`${wish.id}-${depth}`}
                  className={`deck-card deck-card--depth-${depth} ${
                    isTop && isSwiping ? 'deck-card--swiping-out' : ''
                  }`}
                  onClick={isTop ? handleNextCard : undefined}
                >
                  <div className="deck-card__header">
                    <span
                      className="deck-card__badge"
                      style={{
                        backgroundColor: `${wish.badgeColor}15`,
                        color: wish.badgeColor,
                        borderColor: `${wish.badgeColor}35`,
                      }}
                    >
                      {wish.badge}
                    </span>
                    <span className="deck-card__num">0{cardIndex + 1}</span>
                  </div>

                  <h3 className="deck-card__title">{wish.title}</h3>
                  <p className="deck-card__subtitle">{wish.subtitle}</p>

                  <div className="deck-card__divider" />

                  <p className="deck-card__content">{wish.content}</p>

                  <div className="deck-card__quote">
                    <p>"{wish.highlight}"</p>
                  </div>

                  {isTop && (
                    <div className="deck-card__footer">
                      <span className="deck-swipe-hint">
                        Geser atau ketuk kartu untuk slide ke belakang ➔
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="deck-nav-buttons">
            <button
              type="button"
              className="deck-btn"
              onClick={handlePrevCard}
              aria-label="Kartu Sebelumnya"
            >
              ⬅ Sebelumnya
            </button>
            <button
              type="button"
              className="deck-btn deck-btn--primary"
              onClick={handleNextCard}
              aria-label="Kartu Berikutnya"
            >
              Selanjutnya ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
