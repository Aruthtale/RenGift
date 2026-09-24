// src/lib/characterDirection.ts

export type CharacterDirection =
  | 'up-left'
  | 'up'
  | 'up-right'
  | 'left'
  | 'center'
  | 'right'
  | 'down-left'
  | 'down'
  | 'down-right';

export interface DirectionResult {
  direction: CharacterDirection;
  angle: number;
  dx: number;
  dy: number;
  distance: number;
}

/**
 * Map from CharacterDirection to sprite image filename.
 * Files are located at /RCHARA/<filename>.png
 */
export const DIRECTION_TO_SPRITE: Record<CharacterDirection, string> = {
  'up-left': 'Kiri-Atas',
  'up': 'Atas',
  'up-right': 'Kanan-Atas',
  'left': 'Kiri',
  'center': 'Tengah',
  'right': 'Kanan',
  'down-left': 'Kiri-Bawah',
  'down': 'Bawah',
  'down-right': 'Kanan-Bawah',
};

/** All possible directions for preloading */
export const ALL_DIRECTIONS: CharacterDirection[] = [
  'up-left', 'up', 'up-right',
  'left', 'center', 'right',
  'down-left', 'down', 'down-right',
];

/**
 * Returns the sprite image path for a given direction (.png).
 */
export function getSpritePath(direction: CharacterDirection): string {
  return `/RCHARA/${DIRECTION_TO_SPRITE[direction]}.png`;
}

/**
 * Returns the ultra-lightweight WebP sprite image path (~78% smaller).
 */
export function getWebpSpritePath(direction: CharacterDirection): string {
  return `/RCHARA/${DIRECTION_TO_SPRITE[direction]}.webp`;
}

/**
 * Dead zone inner and outer threshold in pixels.
 * Uses hysteresis: if currently in 'center', needs DEAD_ZONE_EXIT to leave.
 * If currently outside, needs DEAD_ZONE_ENTER to enter center.
 */
const DEAD_ZONE_ENTER_PX = 75;
const DEAD_ZONE_EXIT_PX = 95;

/** Hysteresis margin in degrees on sector borders to avoid jittering */
const HYSTERESIS_ANGLE_DEG = 4.0;

const SECTOR_DIRECTIONS: CharacterDirection[] = [
  'right',      // 0 (around 0° / 360°)
  'down-right', // 1 (around 45°)
  'down',       // 2 (around 90°)
  'down-left',  // 3 (around 135°)
  'left',       // 4 (around 180°)
  'up-left',    // 5 (around 225°)
  'up',         // 6 (around 270°)
  'up-right',   // 7 (around 315°)
];

/**
 * Determines which of the 9 directions the cursor is relative to
 * the character's bounding rectangle center.
 *
 * Employs dead-zone and angular hysteresis using `currentDirection`
 * so switching between sectors is silky-smooth and jitter-free.
 */
export function getCharacterDirection(
  mouseX: number,
  mouseY: number,
  characterRect: DOMRect,
  currentDirection: CharacterDirection = 'center'
): DirectionResult {
  const centerX = characterRect.left + characterRect.width / 2;
  const centerY = characterRect.top + characterRect.height / 2;

  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Dead zone check with hysteresis
  const deadZoneThreshold =
    currentDirection === 'center' ? DEAD_ZONE_EXIT_PX : DEAD_ZONE_ENTER_PX;

  if (distance < deadZoneThreshold) {
    return {
      direction: 'center',
      angle: 0,
      dx,
      dy,
      distance,
    };
  }

  // atan2 returns angle in radians (-PI to PI)
  let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angleDeg < 0) angleDeg += 360; // 0 to 360

  // Standard sector is 45° with 22.5° offset
  // If we have a current active directional sector, give it extra hysteresis angle tolerance
  let activeSector = Math.floor(((angleDeg + 22.5) % 360) / 45);

  if (currentDirection !== 'center') {
    const currentIndex = SECTOR_DIRECTIONS.indexOf(currentDirection);
    if (currentIndex !== -1) {
      const centerAngle = currentIndex * 45; // 0, 45, 90, ...
      // Difference between angleDeg and centerAngle wrapping around 360
      let diff = Math.abs(angleDeg - centerAngle);
      if (diff > 180) diff = 360 - diff;

      // If still within expanded sector boundary (22.5° + HYSTERESIS_ANGLE_DEG), retain current sector
      if (diff <= 22.5 + HYSTERESIS_ANGLE_DEG) {
        activeSector = currentIndex;
      }
    }
  }

  return {
    direction: SECTOR_DIRECTIONS[activeSector],
    angle: angleDeg,
    dx,
    dy,
    distance,
  };
}
