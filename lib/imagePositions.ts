import fs from "node:fs";
import path from "node:path";
import { clampImageTransform, DEFAULT_IMAGE_TRANSFORM, type ImageTransform } from "./imageTransform";

// Positions are keyed by "storage key" (slotId for desktop, `${slotId}__mobile`
// for a mobile-specific override) and persisted as a flat JSON file on disk —
// no database needed for a demo site.
function getPositionsFile(): string {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "image-positions.json");
}

function readAll(): Record<string, ImageTransform> {
  const file = getPositionsFile();
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ImageTransform>) {
  fs.writeFileSync(getPositionsFile(), JSON.stringify(data, null, 2));
}

export function getSlotPositionMap(): Record<string, ImageTransform> {
  return readAll();
}

export function saveSlotPosition(storageKey: string, transform: ImageTransform): ImageTransform {
  const clamped = clampImageTransform(transform);
  const all = readAll();
  all[storageKey] = clamped;
  writeAll(all);
  return clamped;
}

export function resetSlotPosition(storageKey: string) {
  const all = readAll();
  delete all[storageKey];
  writeAll(all);
  return DEFAULT_IMAGE_TRANSFORM;
}
