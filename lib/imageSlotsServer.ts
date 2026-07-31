import fs from "node:fs";
import path from "node:path";
import { mobileSlotKey } from "./imageTransform";
import { ALLOWED_IMAGE_EXTENSIONS, IMAGE_SLOTS } from "./imageSlots";

// Server-only filesystem lookups (uses node:fs / node:path, so this file
// must only be imported from Server Components, layouts, or API routes —
// never from a "use client" component).

export function getSlotsDir(): string {
  return path.join(process.cwd(), "public", "images", "slots");
}

function findFileForStorageId(dir: string, storageId: string): string | null {
  if (!fs.existsSync(dir)) return null;
  for (const ext of ALLOWED_IMAGE_EXTENSIONS) {
    const p = path.join(dir, `${storageId}.${ext}`);
    if (fs.existsSync(p)) {
      return `/images/slots/${storageId}.${ext}`;
    }
  }
  return null;
}

/**
 * Desktop image per slot, with no fallback applied (null = nothing uploaded
 * yet for that slot).
 */
export function getSlotImageMap(): Record<string, string | null> {
  const dir = getSlotsDir();
  const map: Record<string, string | null> = {};
  for (const slot of IMAGE_SLOTS) {
    map[slot.id] = findFileForStorageId(dir, slot.id);
  }
  return map;
}

/**
 * Mobile-only override per slot, with no fallback applied (null = this slot
 * has not had a mobile-specific image uploaded, so the site should keep
 * showing the desktop image on mobile too).
 */
export function getMobileOnlySlotImageMap(): Record<string, string | null> {
  const dir = getSlotsDir();
  const map: Record<string, string | null> = {};
  for (const slot of IMAGE_SLOTS) {
    map[slot.id] = findFileForStorageId(dir, mobileSlotKey(slot.id));
  }
  return map;
}

/**
 * Effective mobile image for rendering the live site: the mobile override if
 * one exists, otherwise the desktop image (the "default to desktop icon
 * until a mobile version is uploaded" behavior).
 */
export function getEffectiveMobileImage(slotId: string): string | null {
  const dir = getSlotsDir();
  return findFileForStorageId(dir, mobileSlotKey(slotId)) ?? findFileForStorageId(dir, slotId);
}
