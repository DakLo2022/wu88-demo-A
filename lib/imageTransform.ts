// Shared position/scale model for banner-type slots. A "transform" describes
// how the uploaded image is offset (as % of its container) and scaled inside
// the fixed-size box it renders into, so a designer can drag/zoom an image
// that doesn't perfectly match the container's aspect ratio.

export type ImageTransform = {
  x: number; // % offset from center, positive = right
  y: number; // % offset from center, positive = down
  scale: number; // 1 = 100%
};

export const DEFAULT_IMAGE_TRANSFORM: ImageTransform = { x: 0, y: 0, scale: 1 };

const MAX_OFFSET_PERCENT = 100;
const MIN_SCALE = 0.3;
const MAX_SCALE = 3;

export function clampImageTransform(t: ImageTransform): ImageTransform {
  return {
    x: Math.max(-MAX_OFFSET_PERCENT, Math.min(MAX_OFFSET_PERCENT, t.x)),
    y: Math.max(-MAX_OFFSET_PERCENT, Math.min(MAX_OFFSET_PERCENT, t.y)),
    scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale)),
  };
}

export function getImageTransformStyle(t: ImageTransform): React.CSSProperties {
  return {
    transform: `translate(${t.x}%, ${t.y}%) scale(${t.scale})`,
  };
}

/** Storage key used for a slot's mobile-only override. */
export function mobileSlotKey(slotId: string): string {
  return `${slotId}__mobile`;
}
