import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ALLOWED_IMAGE_EXTENSIONS, isValidSlotId } from "@/lib/imageSlots";
import { getSlotsDir } from "@/lib/imageSlotsServer";
import { mobileSlotKey } from "@/lib/imageTransform";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function resolveStorageId(slotId: string, device: unknown): string {
  return device === "mobile" ? mobileSlotKey(slotId) : slotId;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const slotId = formData.get("slotId");
    const file = formData.get("file");
    const device = formData.get("device"); // "desktop" (default) | "mobile"

    if (typeof slotId !== "string" || !isValidSlotId(slotId)) {
      return NextResponse.json({ error: "無效的圖片欄位 ID" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "請選擇要上傳的圖片檔案" }, { status: 400 });
    }

    const originalExt = path.extname(file.name).replace(".", "").toLowerCase();
    const resolvedExt = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(originalExt)
      ? originalExt
      : MIME_EXTENSION_MAP[file.type];

    if (!resolvedExt) {
      return NextResponse.json(
        { error: "不支援的圖片格式，請上傳 PNG / JPG / WEBP / GIF / SVG 檔案" },
        { status: 400 }
      );
    }

    const storageId = resolveStorageId(slotId, device);
    const dir = getSlotsDir();
    fs.mkdirSync(dir, { recursive: true });

    // Remove any previous upload for this slot+device so a different
    // extension doesn't leave a stale file behind.
    for (const ext of ALLOWED_IMAGE_EXTENSIONS) {
      const existingPath = path.join(dir, `${storageId}.${ext}`);
      if (fs.existsSync(existingPath)) fs.unlinkSync(existingPath);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const destPath = path.join(dir, `${storageId}.${resolvedExt}`);
    fs.writeFileSync(destPath, buffer);

    return NextResponse.json({ ok: true, url: `/images/slots/${storageId}.${resolvedExt}` });
  } catch (error) {
    console.error("[upload-image] 上傳失敗", error);
    return NextResponse.json({ error: "上傳失敗，請稍後再試" }, { status: 500 });
  }
}

/** Clears a slot's mobile-only override so it falls back to the desktop image again. */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, device } = body ?? {};

    if (typeof slotId !== "string" || !isValidSlotId(slotId)) {
      return NextResponse.json({ error: "無效的圖片欄位 ID" }, { status: 400 });
    }

    const storageId = resolveStorageId(slotId, device);
    const dir = getSlotsDir();

    for (const ext of ALLOWED_IMAGE_EXTENSIONS) {
      const filePath = path.join(dir, `${storageId}.${ext}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[upload-image] 清除失敗", error);
    return NextResponse.json({ error: "清除失敗，請稍後再試" }, { status: 500 });
  }
}
