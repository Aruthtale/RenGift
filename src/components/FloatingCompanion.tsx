import React, { useEffect, useRef, useState } from 'react';
import './FloatingCompanion.css';

interface FloatingCompanionProps {
  onPositionChange: (x: number, y: number) => void;
  targetRect?: DOMRect | null;
}

export const FloatingCompanion: React.FC<FloatingCompanionProps> = ({
  onPositionChange,
}) => {
  // Mode: Strawberry or Blossom Flower
  const [itemType, setItemType] = useState<'strawberry' | 'blossom'>('strawberry');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const companionRef = useRef<HTMLDivElement>(null);

  // Initialize position in lower half on mobile, or bottom-right
  useEffect(() => {
    const defaultX = window.innerWidth * 0.75;
    const defaultY = window.innerHeight * 0.45;
    setPos({ x: defaultX, y: defaultY });
    onPositionChange(defaultX, defaultY);
  }, [onPositionChange]);

  // Handle pointer down (touch or mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = Math.max(30, Math.min(window.innerWidth - 30, e.clientX - dragOffsetRef.current.x));
    const newY = Math.max(30, Math.min(window.innerHeight - 30, e.clientY - dragOffsetRef.current.y));

    setPos({ x: newX, y: newY });
    onPositionChange(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Toggle item between strawberry and flower on double click/tap
  const toggleItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setItemType((prev) => (prev === 'strawberry' ? 'blossom' : 'strawberry'));
  };

  return (
    <div
      ref={companionRef}
      className={`floating-companion ${isDragging ? 'floating-companion--dragging' : ''}`}
      style={{
        transform: `translate3d(${pos.x - 28}px, ${pos.y - 28}px, 0)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="button"
      tabIndex={0}
      aria-label="Geser stroberi atau bunga ini untuk mengarahkan pandangan karakter"
    >
      <div className="floating-companion__aura" />
      <div className="floating-companion__body" onClick={toggleItem}>
        {itemType === 'strawberry' ? (
          <svg
            className="floating-companion__svg"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Strawberry Calyx (Daun Hijau) */}
            <path
              d="M24 10C22 5 16 7 15 9C17 11 20 12 24 12C28 12 31 11 33 9C32 7 26 5 24 10Z"
              fill="#65A30D"
            />
            <path
              d="M24 10C24 4 23 2 22 2"
              stroke="#4D7C0F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Strawberry Fruit */}
            <path
              d="M24 12C15 12 11 18 12 28C13 36 21 44 24 45C27 44 35 36 36 28C37 18 33 12 24 12Z"
              fill="url(#strawberryGrad)"
            />
            {/* Strawberry Seeds */}
            <circle cx="19" cy="22" r="1.2" fill="#FEF08A" />
            <circle cx="28" cy="21" r="1.2" fill="#FEF08A" />
            <circle cx="23" cy="27" r="1.2" fill="#FEF08A" />
            <circle cx="18" cy="31" r="1.2" fill="#FEF08A" />
            <circle cx="29" cy="30" r="1.2" fill="#FEF08A" />
            <circle cx="24" cy="36" r="1.1" fill="#FEF08A" />
            <defs>
              <linearGradient id="strawberryGrad" x1="12" y1="12" x2="36" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB7185" />
                <stop offset="1" stopColor="#E11D48" />
              </linearGradient>
            </defs>
          </svg>
        ) : (
          <svg
            className="floating-companion__svg"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Blossom Flower */}
            <circle cx="24" cy="14" r="8" fill="#FBCFE8" />
            <circle cx="34" cy="22" r="8" fill="#FBCFE8" />
            <circle cx="30" cy="34" r="8" fill="#F472B6" />
            <circle cx="18" cy="34" r="8" fill="#F472B6" />
            <circle cx="14" cy="22" r="8" fill="#FBCFE8" />
            {/* Center pistil */}
            <circle cx="24" cy="24" r="6" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
          </svg>
        )}
      </div>

      {!hasInteracted && (
        <div className="floating-companion__tooltip">
          <span>Sentuh & geser aku! ✨</span>
        </div>
      )}
    </div>
  );
};
