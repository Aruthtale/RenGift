import React, { useEffect, useRef, useState } from 'react';
import { BirthdayWish } from '../lib/birthdayData';
import './SecretMessageCard.css';

interface SecretMessageCardProps {
  wish: BirthdayWish;
  index: number;
}

export const SecretMessageCard: React.FC<SecretMessageCardProps> = ({ wish, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={`wish-card ${isVisible ? 'wish-card--visible' : ''} ${
        isUnlocked ? 'wish-card--unlocked' : ''
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="wish-card__flower-decor" aria-hidden="true">
        {wish.category === 'bunga' ? '🌸' : wish.category === 'stroberi' ? '🍓' : '✨'}
      </div>

      <div className="wish-card__header">
        <span
          className="wish-card__badge"
          style={{
            backgroundColor: `${wish.badgeColor}15`,
            color: wish.badgeColor,
            borderColor: `${wish.badgeColor}35`,
          }}
        >
          {wish.badge}
        </span>
        <span className="wish-card__step">0{index + 1}</span>
      </div>

      <h3 className="wish-card__title">{wish.title}</h3>
      <p className="wish-card__subtitle">{wish.subtitle}</p>

      <div className="wish-card__divider" />

      <p className="wish-card__content">{wish.content}</p>

      <div className="wish-card__highlight-box">
        <p className="wish-card__highlight">"{wish.highlight}"</p>
      </div>

      <button
        type="button"
        className="wish-card__action-btn"
        onClick={() => setIsUnlocked(!isUnlocked)}
        aria-label="Kirim pelukan hangat virtual"
      >
        <span>{isUnlocked ? 'Tersimpan di Hati 💖' : 'Sentuh untuk Mengaminkan 🌸'}</span>
      </button>
    </article>
  );
};
