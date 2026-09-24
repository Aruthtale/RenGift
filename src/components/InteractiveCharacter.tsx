import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type CharacterDirection,
  type DirectionResult,
  ALL_DIRECTIONS,
  getCharacterDirection,
  getSpritePath,
  getWebpSpritePath,
} from '../lib/characterDirection';
import './InteractiveCharacter.css';

// ──────────────────────────────────────────────
// Set to `true` to show debug overlay
// ──────────────────────────────────────────────
const DEBUG = false;

/** Crossfade transition duration in milliseconds */
const TRANSITION_MS = 160;

// ──── Types ────

interface DebugInfo {
  mouseX: number;
  mouseY: number;
  centerX: number;
  centerY: number;
  result: DirectionResult;
}

interface InteractiveCharacterProps {
  externalTarget?: { x: number; y: number } | null;
}

// ──── Component ────

export default function InteractiveCharacter({ externalTarget }: InteractiveCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentDirection, setCurrentDirection] =
    useState<CharacterDirection>('center');
  const [prevDirection, setPrevDirection] =
    useState<CharacterDirection>('center');
  const [isFading, setIsFading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  // Micro-parallax 3D tilt & translation
  const [transformStyle, setTransformStyle] = useState('');

  // Refs for tracking target mouse vs smoothed virtual mouse
  const targetMouseRef = useRef<{ x: number; y: number } | null>(null);
  const smoothedMouseRef = useRef<{ x: number; y: number } | null>(null);
  const isPointerActiveRef = useRef(false);
  const currentDirectionRef = useRef<CharacterDirection>('center');
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref synchronized
  useEffect(() => {
    currentDirectionRef.current = currentDirection;
  }, [currentDirection]);

  // Synchronize external target (misal dari Floating Companion di HP)
  useEffect(() => {
    if (externalTarget) {
      isPointerActiveRef.current = true;
      targetMouseRef.current = externalTarget;
    }
  }, [externalTarget]);

  // ── Preload all 9 sprite images on mount (WebP preferred, PNG fallback) ──
  useEffect(() => {
    ALL_DIRECTIONS.forEach((dir) => {
      const imgWebp = new Image();
      imgWebp.src = getWebpSpritePath(dir);
      const imgPng = new Image();
      imgPng.src = getSpritePath(dir);
    });
  }, []);

  // ── Helper: transition to a new direction with crossfade ──
  const transitionTo = useCallback((newDir: CharacterDirection) => {
    setCurrentDirection((prev) => {
      if (prev === newDir) return prev;

      setPrevDirection(prev);
      setIsFading(true);

      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        setIsFading(false);
        fadeTimerRef.current = null;
      }, TRANSITION_MS);

      return newDir;
    });
  }, []);

  // ── Continuous 60fps smoothing loop (Inertia + Micro-parallax) ──
  useEffect(() => {
    let animId = 0;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // If pointer is inactive, gently relax smoothed mouse back to center
      const targetX = isPointerActiveRef.current && targetMouseRef.current
        ? targetMouseRef.current.x
        : centerX;
      const targetY = isPointerActiveRef.current && targetMouseRef.current
        ? targetMouseRef.current.y
        : centerY;

      if (!smoothedMouseRef.current) {
        smoothedMouseRef.current = { x: targetX, y: targetY };
      }

      // LERP (Linear Interpolation) with damping factor
      const LERP_FACTOR = 0.12;
      const sm = smoothedMouseRef.current;
      sm.x += (targetX - sm.x) * LERP_FACTOR;
      sm.y += (targetY - sm.y) * LERP_FACTOR;

      // Compute direction from smoothed virtual mouse
      const result = getCharacterDirection(
        sm.x,
        sm.y,
        rect,
        currentDirectionRef.current
      );

      transitionTo(result.direction);

      // Micro 2.5D parallax tilt & slight translation
      const dx = sm.x - centerX;
      const dy = sm.y - centerY;

      const maxOffset = 14; // pixels
      const maxTilt = 4.5;   // degrees

      const clampedX = Math.max(-1, Math.min(1, dx / 400));
      const clampedY = Math.max(-1, Math.min(1, dy / 400));

      const transX = clampedX * maxOffset;
      const transY = clampedY * maxOffset;
      const tiltY = clampedX * maxTilt;
      const tiltX = -clampedY * maxTilt;

      setTransformStyle(
        `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`
      );

      if (DEBUG) {
        setDebugInfo({
          mouseX: Math.round(sm.x),
          mouseY: Math.round(sm.y),
          centerX: Math.round(centerX),
          centerY: Math.round(centerY),
          result,
        });
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [transitionTo]);

  // ── Input Event Listeners ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      isPointerActiveRef.current = true;
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      isPointerActiveRef.current = true;
      targetMouseRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handlePointerLeave = () => {
      // Hanya reset jika tidak ada externalTarget yang sedang aktif
      if (!externalTarget) {
        isPointerActiveRef.current = false;
        targetMouseRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerLeave);
    };
  }, [externalTarget]);

  // ── Derived paths (Dual WebP + PNG) ──
  const currentPng = getSpritePath(currentDirection);
  const currentWebp = getWebpSpritePath(currentDirection);

  const prevPng = getSpritePath(prevDirection);
  const prevWebp = getWebpSpritePath(prevDirection);

  return (
    <div className="character-scene">
      <div
        className="character-container"
        ref={containerRef}
        style={{ transform: transformStyle }}
      >
        {/* Previous direction — fades out during crossfade */}
        <picture
          className={`character-sprite character-sprite--prev ${
            isFading
              ? 'character-sprite--fading-out'
              : 'character-sprite--hidden'
          }`}
        >
          <source srcSet={prevWebp} type="image/webp" />
          <img src={prevPng} alt="" draggable={false} />
        </picture>

        {/* Current direction — always on top */}
        <picture className="character-sprite character-sprite--current">
          <source srcSet={currentWebp} type="image/webp" />
          <img src={currentPng} alt="Rhea Character" draggable={false} />
        </picture>
      </div>

      <p className="character-hint">
        <span className="character-hint--desktop">Arahin stroberi nya ngelilingin character ✨</span>
        <span className="character-hint--mobile">Click & Swap a stroberi terus puterin ✨</span>
      </p>

      {/* ── Debug overlay (visible only when DEBUG = true) ── */}
      {DEBUG && debugInfo && (
        <div className="character-debug">
          <div className="character-debug__info">
            <p>
              <strong>Direction:</strong> {debugInfo.result.direction}
            </p>
            <p>
              <strong>Angle:</strong> {debugInfo.result.angle.toFixed(1)}°
            </p>
            <p>
              <strong>dx:</strong> {debugInfo.result.dx.toFixed(0)} |{' '}
              <strong>dy:</strong> {debugInfo.result.dy.toFixed(0)}
            </p>
            <p>
              <strong>Distance:</strong> {debugInfo.result.distance.toFixed(0)}
              px
            </p>
            <p>
              <strong>Mouse:</strong> ({debugInfo.mouseX}, {debugInfo.mouseY})
            </p>
            <p>
              <strong>Center:</strong> ({debugInfo.centerX.toFixed(0)},{' '}
              {debugInfo.centerY.toFixed(0)})
            </p>
          </div>
          {/* Visual debug lines rendered as a full-viewport SVG */}
          <svg
            className="character-debug__svg"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            {/* Character center */}
            <circle
              cx={debugInfo.centerX}
              cy={debugInfo.centerY}
              r={5}
              fill="#ff4444"
            />
            {/* Cursor position */}
            <circle
              cx={debugInfo.mouseX}
              cy={debugInfo.mouseY}
              r={5}
              fill="#44ff44"
            />
            {/* Line from center to cursor */}
            <line
              x1={debugInfo.centerX}
              y1={debugInfo.centerY}
              x2={debugInfo.mouseX}
              y2={debugInfo.mouseY}
              stroke="rgba(255,255,0,0.6)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            {/* Dead zone circle */}
            <circle
              cx={debugInfo.centerX}
              cy={debugInfo.centerY}
              r={80}
              fill="none"
              stroke="rgba(255,100,100,0.3)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
