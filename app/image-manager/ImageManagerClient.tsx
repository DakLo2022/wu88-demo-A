"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import styles from "./ImageManager.module.css";
import {
  GLOBAL_PROVIDER_BADGE_SLOT_ID,
  GLOBAL_PROVIDER_SLOT_ID,
  type ImageSlot,
  type ImageSlotCategory,
} from "@/lib/imageSlots";
import { navCategories } from "@/data/nav";
import {
  clampImageTransform,
  DEFAULT_IMAGE_TRANSFORM,
  getImageTransformStyle,
  mobileSlotKey,
  type ImageTransform,
} from "@/lib/imageTransform";

type Device = "desktop" | "mobile";

// What the preview thumbnail needs to match to be WYSIWYG with the actual
// live-site render for a given slot + device — otherwise dragging in the
// admin tool can look fine there but come out cropped differently live (the
// bug this fixes). Every other slot type (banner/icon/logo) keeps the
// original fixed 4:3 "contain, always fully visible" preview, since nothing
// changed for those. Provider (廠商) images are special because they render
// two different ways depending on device: object-cover inside a
// category-specific-height card on mobile (MobileCategoryExplorer), and
// object-contain inside a fixed aspect-[300/360] box on desktop (Navbar's
// hover dropdown).
function getPreviewFit(slot: ImageSlot, device: Device): { objectFit: "cover" | "contain"; aspectRatio: number } {
  if (slot.category === "provider" && slot.id.endsWith("-badge")) {
    // Small corner logo — never cropped, just fit + repositioned inside its
    // own little box (see the "h-[45px] w-[56px]" wrapper in
    // MobileCategoryExplorer).
    return { objectFit: "contain", aspectRatio: 56 / 45 };
  }
  if (slot.category === "provider" && !slot.id.endsWith("-badge")) {
    if (device === "mobile") {
      const categoryKey = slot.id.replace(/^nav-/, "").replace(/-\d+$/, "");
      const category = navCategories.find((c) => c.key === categoryKey);
      const height = category?.mobileCardHeight === "tall" ? 288 : 192;
      // Single-column categories (棋牌/捕魚/電競) render each card at the
      // grid pane's full width (~319.6px measured off wu88.live at a
      // 414px-wide viewport), not the ~156.8px a 2-column card gets — missing
      // this is exactly why "cards" (棋牌) was still showing cropped
      // differently after the first fix, which only corrected the height.
      const width = category?.mobileColumns === 1 ? 319.6 : 156.8;
      return { objectFit: "cover", aspectRatio: width / height };
    }
    return { objectFit: "contain", aspectRatio: 300 / 360 };
  }
  return { objectFit: "contain", aspectRatio: 4 / 3 };
}

// "版面" (banner) 依畫面區塊分類；"icon" 圖示自成一區；"logo" 是 footer 廠商 logo 列；
// "provider" 是導覽列 hover 下拉選單裡每個廠商的圖示。
const CATEGORY_LABELS: Record<ImageSlotCategory, string> = {
  banner: "一、版面 Banner（依首頁區塊分類）",
  icon: "二、Icon 圖示（Logo / 卡片 icon / footer QR / 側邊客服 icon）",
  logo: "三、廠商 Logo（Footer 底部廠商合作 logo 列，只有已上傳的會顯示在正式頁面）",
  provider: "四、導覽列下拉選單廠商圖示（依分類分組，滑過導覽列項目時顯示）",
};

const CATEGORY_TAB_LABELS: Record<ImageSlotCategory, string> = {
  banner: "版面 Banner",
  icon: "Icon 圖示",
  logo: "廠商 Logo",
  provider: "導覽下拉圖示",
};

const CATEGORY_ORDER: ImageSlotCategory[] = ["banner", "icon", "logo", "provider"];

type Placeholder = { background: string; emoji: string };

function getPlaceholder(slotId: string): Placeholder {
  if (slotId.startsWith("hero-slide")) {
    return { background: "linear-gradient(140deg,#f5820c66,#1a1a1a)", emoji: "🖼️" };
  }
  if (slotId === "logo") return { background: "#1c1c1c", emoji: "DS" };
  if (slotId.startsWith("promo-icon")) return { background: "#2a2a2a", emoji: "🎁" };
  if (slotId.startsWith("footer-qr")) return { background: "#2a2a2a", emoji: "▦" };
  if (slotId.startsWith("sidedock")) return { background: "#2a2a2a", emoji: "●" };
  if (slotId.startsWith("vendor-logo")) return { background: "#f2f2f2", emoji: "🏷️" };
  if (slotId.startsWith("nav-")) return { background: "#eaeaea", emoji: "🎮" };
  return { background: "#d9d9d9", emoji: "🖼️" };
}

type UploadState = "idle" | "uploading" | "success" | "error";
type PositionSaveState = "idle" | "saving" | "saved";

type DragState = {
  slotId: string;
  storageKey: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

export default function ImageManagerClient({
  slots,
  initialImages,
  initialMobileImages,
  initialPositions,
}: {
  slots: ImageSlot[];
  initialImages: Record<string, string | null>;
  initialMobileImages: Record<string, string | null>;
  initialPositions: Record<string, ImageTransform>;
}) {
  const [images, setImages] = useState<Record<string, string | null>>(initialImages);
  const [mobileImages, setMobileImages] = useState<Record<string, string | null>>(initialMobileImages);
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [activeCategory, setActiveCategory] = useState<ImageSlotCategory>("banner");

  const [positions, setPositions] = useState<Record<string, ImageTransform>>(initialPositions);
  const [savedPositions, setSavedPositions] = useState<Record<string, ImageTransform>>(initialPositions);
  const [positionSaveStates, setPositionSaveStates] = useState<Record<string, PositionSaveState>>({});
  const [deviceBySlot, setDeviceBySlot] = useState<Record<string, Device>>({});
  const dragStateRef = useRef<DragState | null>(null);

  function getDevice(slotId: string): Device {
    return deviceBySlot[slotId] ?? "desktop";
  }

  function getStorageKey(slotId: string, device: Device): string {
    return device === "mobile" ? mobileSlotKey(slotId) : slotId;
  }

  function isProviderSlot(slotId: string): boolean {
    return slots.some((s) => s.id === slotId && s.category === "provider");
  }

  // Mirrors the live-site fallback chain (mobile global > desktop global) so
  // a provider slot's admin preview starts from whatever it will ACTUALLY
  // render as on the public page, not a blank default — otherwise opening a
  // single image to fine-tune it after setting the global default would
  // visually "jump" back to centered/100%, making it look like per-slot
  // editing doesn't build on top of / override the global setting.
  function getGlobalProviderFallback(
    map: Record<string, ImageTransform>,
    device: Device,
    globalSlotId: string
  ): ImageTransform | undefined {
    if (device === "mobile") {
      return map[mobileSlotKey(globalSlotId)] ?? map[globalSlotId];
    }
    return map[globalSlotId];
  }

  function globalSlotIdFor(slotId: string): string {
    return slotId.endsWith("-badge") ? GLOBAL_PROVIDER_BADGE_SLOT_ID : GLOBAL_PROVIDER_SLOT_ID;
  }

  function getTransform(slotId: string): ImageTransform {
    const device = getDevice(slotId);
    const globalFallback = isProviderSlot(slotId)
      ? getGlobalProviderFallback(positions, device, globalSlotIdFor(slotId))
      : undefined;
    if (device === "mobile") {
      return (
        positions[getStorageKey(slotId, "mobile")] ?? positions[slotId] ?? globalFallback ?? DEFAULT_IMAGE_TRANSFORM
      );
    }
    return positions[slotId] ?? globalFallback ?? DEFAULT_IMAGE_TRANSFORM;
  }

  function getSavedTransformForDisplay(slotId: string): ImageTransform {
    const device = getDevice(slotId);
    const globalFallback = isProviderSlot(slotId)
      ? getGlobalProviderFallback(savedPositions, device, globalSlotIdFor(slotId))
      : undefined;
    if (device === "mobile") {
      return (
        savedPositions[getStorageKey(slotId, "mobile")] ??
        savedPositions[slotId] ??
        globalFallback ??
        DEFAULT_IMAGE_TRANSFORM
      );
    }
    return savedPositions[slotId] ?? globalFallback ?? DEFAULT_IMAGE_TRANSFORM;
  }

  function isDirty(slotId: string): boolean {
    const current = getTransform(slotId);
    const saved = getSavedTransformForDisplay(slotId);
    return current.x !== saved.x || current.y !== saved.y || current.scale !== saved.scale;
  }

  function handlePointerDown(slotId: string, e: ReactPointerEvent<HTMLImageElement>) {
    const container = e.currentTarget.parentElement;
    const rect = (container ?? e.currentTarget).getBoundingClientRect();
    const current = getTransform(slotId);
    const storageKey = getStorageKey(slotId, getDevice(slotId));
    dragStateRef.current = {
      slotId,
      storageKey,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: current.x,
      startY: current.y,
      width: rect.width || 1,
      height: rect.height || 1,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLImageElement>) {
    const drag = dragStateRef.current;
    if (!drag) return;
    const deltaXPercent = ((e.clientX - drag.startClientX) / drag.width) * 100;
    const deltaYPercent = ((e.clientY - drag.startClientY) / drag.height) * 100;
    const currentScale = getTransform(drag.slotId).scale;
    const next = clampImageTransform({
      x: drag.startX + deltaXPercent,
      y: drag.startY + deltaYPercent,
      scale: currentScale,
    });
    setPositions((prev) => ({ ...prev, [drag.storageKey]: next }));
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLImageElement>) {
    if (dragStateRef.current && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
  }

  function handleScaleChange(slotId: string, scalePercent: number) {
    const current = getTransform(slotId);
    const next = clampImageTransform({ x: current.x, y: current.y, scale: scalePercent / 100 });
    const storageKey = getStorageKey(slotId, getDevice(slotId));
    setPositions((prev) => ({ ...prev, [storageKey]: next }));
  }

  function handleAxisInputChange(slotId: string, axis: "x" | "y", value: number) {
    if (Number.isNaN(value)) return;
    const current = getTransform(slotId);
    const next = clampImageTransform({ ...current, [axis]: value });
    const storageKey = getStorageKey(slotId, getDevice(slotId));
    setPositions((prev) => ({ ...prev, [storageKey]: next }));
  }

  async function handleSavePosition(slotId: string) {
    setPositionSaveStates((prev) => ({ ...prev, [slotId]: "saving" }));
    try {
      const device = getDevice(slotId);
      const storageKey = getStorageKey(slotId, device);
      const transform = getTransform(slotId);
      const res = await fetch("/api/save-image-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, device, ...transform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "儲存失敗，請稍後再試");

      const saved = { x: data.x, y: data.y, scale: data.scale };
      setPositions((prev) => ({ ...prev, [storageKey]: saved }));
      setSavedPositions((prev) => ({ ...prev, [storageKey]: saved }));
      setPositionSaveStates((prev) => ({ ...prev, [slotId]: "saved" }));
    } catch {
      setPositionSaveStates((prev) => ({ ...prev, [slotId]: "idle" }));
    }
  }

  async function handleResetPosition(slotId: string) {
    setPositionSaveStates((prev) => ({ ...prev, [slotId]: "saving" }));
    try {
      const device = getDevice(slotId);
      const storageKey = getStorageKey(slotId, device);
      const res = await fetch("/api/save-image-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, device, reset: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "重設失敗，請稍後再試");

      // Always clear the key entirely (matching what the server just did),
      // rather than pinning it to DEFAULT_IMAGE_TRANSFORM — for a provider
      // slot, that distinction matters: a cleared key falls back through to
      // the global "廠商圖片統一版面設定" default (if one exists), whereas a
      // key explicitly set to default would permanently block that fallback.
      setPositions((prev) => {
        const next = { ...prev };
        delete next[storageKey];
        return next;
      });
      setSavedPositions((prev) => {
        const next = { ...prev };
        delete next[storageKey];
        return next;
      });
      setPositionSaveStates((prev) => ({ ...prev, [slotId]: "saved" }));
    } catch {
      setPositionSaveStates((prev) => ({ ...prev, [slotId]: "idle" }));
    }
  }

  const grouped: Record<ImageSlotCategory, ImageSlot[]> = { banner: [], icon: [], logo: [], provider: [] };
  for (const slot of slots) grouped[slot.category].push(slot);

  // "廠商圖片統一版面設定" — one shared position/scale for every provider
  // image at once (desktop/mobile independent), so ~90+ vendor images don't
  // each need dragging by hand. Reuses all the same generic per-slot state
  // functions above by just treating GLOBAL_PROVIDER_SLOT_ID as if it were a
  // regular slot id.
  const globalProviderDevice = getDevice(GLOBAL_PROVIDER_SLOT_ID);
  const globalProviderTransform = getTransform(GLOBAL_PROVIDER_SLOT_ID);
  const globalProviderDirty = isDirty(GLOBAL_PROVIDER_SLOT_ID);
  const globalProviderSaveState = positionSaveStates[GLOBAL_PROVIDER_SLOT_ID] ?? "idle";
  const providerArtSlots = grouped.provider.filter((s) => !s.id.endsWith("-badge"));
  const globalProviderPreviewSlot = providerArtSlots.find((s) =>
    globalProviderDevice === "mobile" ? mobileImages[s.id] ?? images[s.id] : images[s.id]
  );
  const globalProviderPreviewSrc = globalProviderPreviewSlot
    ? globalProviderDevice === "mobile"
      ? mobileImages[globalProviderPreviewSlot.id] ?? images[globalProviderPreviewSlot.id]
      : images[globalProviderPreviewSlot.id]
    : null;

  // Same idea, but for the small vendor-logo badge in each card's top-right
  // corner instead of the card's main art image.
  const globalBadgeDevice = getDevice(GLOBAL_PROVIDER_BADGE_SLOT_ID);
  const globalBadgeTransform = getTransform(GLOBAL_PROVIDER_BADGE_SLOT_ID);
  const globalBadgeDirty = isDirty(GLOBAL_PROVIDER_BADGE_SLOT_ID);
  const globalBadgeSaveState = positionSaveStates[GLOBAL_PROVIDER_BADGE_SLOT_ID] ?? "idle";
  const providerBadgeSlots = grouped.provider.filter((s) => s.id.endsWith("-badge"));
  const globalBadgePreviewSlot = providerBadgeSlots.find((s) =>
    globalBadgeDevice === "mobile" ? mobileImages[s.id] ?? images[s.id] : images[s.id]
  );
  const globalBadgePreviewSrc = globalBadgePreviewSlot
    ? globalBadgeDevice === "mobile"
      ? mobileImages[globalBadgePreviewSlot.id] ?? images[globalBadgePreviewSlot.id]
      : images[globalBadgePreviewSlot.id]
    : null;

  async function handleFileChange(slotId: string, fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    const device = getDevice(slotId);
    setUploadStates((prev) => ({ ...prev, [slotId]: "uploading" }));
    setErrors((prev) => ({ ...prev, [slotId]: "" }));

    try {
      const formData = new FormData();
      formData.append("slotId", slotId);
      formData.append("file", file);
      formData.append("device", device);

      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "上傳失敗，請稍後再試");

      const urlWithTs = `${data.url}?t=${Date.now()}`;
      if (device === "mobile") {
        setMobileImages((prev) => ({ ...prev, [slotId]: urlWithTs }));
      } else {
        setImages((prev) => ({ ...prev, [slotId]: urlWithTs }));
      }
      setUploadStates((prev) => ({ ...prev, [slotId]: "success" }));
    } catch (err) {
      setUploadStates((prev) => ({ ...prev, [slotId]: "error" }));
      setErrors((prev) => ({ ...prev, [slotId]: err instanceof Error ? err.message : "上傳失敗，請稍後再試" }));
    }
  }

  async function handleClearMobileImage(slotId: string) {
    setUploadStates((prev) => ({ ...prev, [slotId]: "uploading" }));
    setErrors((prev) => ({ ...prev, [slotId]: "" }));
    try {
      const res = await fetch("/api/upload-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, device: "mobile" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "清除失敗，請稍後再試");
      setMobileImages((prev) => ({ ...prev, [slotId]: null }));
      setUploadStates((prev) => ({ ...prev, [slotId]: "success" }));
    } catch (err) {
      setUploadStates((prev) => ({ ...prev, [slotId]: "error" }));
      setErrors((prev) => ({ ...prev, [slotId]: err instanceof Error ? err.message : "清除失敗，請稍後再試" }));
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>圖片欄位管理</h1>
        <p className={styles.subtitle}>
          內部工具頁，用來上傳/調整 demo 站台各版位的圖片，跟正式首頁的樣式無關。
          在下方分類找到欄位，點「選擇檔案上傳」換上圖片；上傳成功後這裡的縮圖立刻更新，
          回到首頁重新整理也會套用。每個欄位上方有「桌面 / 手機」切換：只上傳桌面版的話，
          手機版會自動沿用桌面版圖示；只有需要手機版單獨換圖時，才切到「手機」另外上傳。
          圖片位置/大小不對時，可以直接在縮圖上按住拖曳調整位置，用下面的縮放滑桿等比例放大縮小，
          按「儲存位置」才會套用到正式頁面。
        </p>
      </header>

      <nav className={styles.tabBar} aria-label="圖片欄位分類">
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setActiveCategory(category)}
          >
            {CATEGORY_TAB_LABELS[category]}
            <span className={styles.tabBtnCount}>{grouped[category].length}</span>
          </button>
        ))}
      </nav>

      {CATEGORY_ORDER.filter((category) => category === activeCategory).map((category) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.sectionTitle}>{CATEGORY_LABELS[category]}</h2>

          {category === "provider" && (
            <div className={styles.globalPanel}>
              <div className={styles.globalPanelText}>
                <div className={styles.globalPanelTitle}>廠商圖片統一版面設定</div>
                <p className={styles.globalPanelHint}>
                  設定一次，套用到「所有」還沒被個別調整過位置的廠商圖片／右上角 Logo（左邊卡片調整圖片本身，
                  右邊卡片調整右上角小 Logo，各自獨立）；下面某張圖或某個 Logo 如果自己拖曳並存過位置，
                  會優先套用該張自己的設定。桌面版、手機版也各自獨立設定。
                </p>
              </div>

              <div className={`${styles.card} ${styles.globalPanelCard}`}>
                <div className={styles.deviceTabBar} role="tablist" aria-label="桌面/手機統一設定切換">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={globalProviderDevice === "desktop"}
                    className={globalProviderDevice === "desktop" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                    onClick={() =>
                      setDeviceBySlot((prev) => ({ ...prev, [GLOBAL_PROVIDER_SLOT_ID]: "desktop" }))
                    }
                  >
                    桌面
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={globalProviderDevice === "mobile"}
                    className={globalProviderDevice === "mobile" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                    onClick={() =>
                      setDeviceBySlot((prev) => ({ ...prev, [GLOBAL_PROVIDER_SLOT_ID]: "mobile" }))
                    }
                  >
                    手機
                  </button>
                </div>

                <div
                  className={styles.previewWrap}
                  style={
                    globalProviderPreviewSlot
                      ? { aspectRatio: String(getPreviewFit(globalProviderPreviewSlot, globalProviderDevice).aspectRatio) }
                      : undefined
                  }
                >
                  {globalProviderPreviewSrc && globalProviderPreviewSlot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={globalProviderPreviewSrc}
                      alt="廠商圖片預覽（任一張已上傳的廠商圖，僅供預覽用）"
                      className={styles.previewImg}
                      style={{
                        ...getImageTransformStyle(globalProviderTransform),
                        objectFit: getPreviewFit(globalProviderPreviewSlot, globalProviderDevice).objectFit,
                        cursor: "grab",
                        touchAction: "none",
                      }}
                      onPointerDown={(e) => handlePointerDown(GLOBAL_PROVIDER_SLOT_ID, e)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      draggable={false}
                    />
                  ) : (
                    <div className={styles.previewPlaceholder} style={{ background: "#d9d9d9" }}>
                      <span>尚無廠商圖片可預覽</span>
                    </div>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.slotLabel}>
                    預覽圖：{globalProviderPreviewSlot?.label ?? "（尚未上傳任何廠商圖片）"}
                  </div>

                  <div className={styles.positionEditor}>
                    <div className={styles.positionHint}>
                      在上方縮圖拖曳調整；
                      {globalProviderDevice === "mobile" ? "目前調整的是「手機版」統一設定。" : "目前調整的是「桌面版」統一設定。"}
                    </div>

                    <label className={styles.scaleRow}>
                      <span>縮放 {Math.round(globalProviderTransform.scale * 100)}%</span>
                      <input
                        type="range"
                        min={30}
                        max={300}
                        step={5}
                        value={Math.round(globalProviderTransform.scale * 100)}
                        onChange={(e) => handleScaleChange(GLOBAL_PROVIDER_SLOT_ID, Number(e.target.value))}
                      />
                    </label>

                    <div className={styles.axisRow}>
                      <label className={styles.axisField}>
                        X
                        <input
                          type="number"
                          className={styles.axisInput}
                          value={Math.round(globalProviderTransform.x)}
                          onChange={(e) =>
                            handleAxisInputChange(GLOBAL_PROVIDER_SLOT_ID, "x", Number(e.target.value))
                          }
                        />
                        %
                      </label>
                      <label className={styles.axisField}>
                        Y
                        <input
                          type="number"
                          className={styles.axisInput}
                          value={Math.round(globalProviderTransform.y)}
                          onChange={(e) =>
                            handleAxisInputChange(GLOBAL_PROVIDER_SLOT_ID, "y", Number(e.target.value))
                          }
                        />
                        %
                      </label>
                    </div>

                    <div className={styles.positionActions}>
                      <button
                        type="button"
                        className={styles.savePositionBtn}
                        onClick={() => handleSavePosition(GLOBAL_PROVIDER_SLOT_ID)}
                        disabled={globalProviderSaveState === "saving"}
                      >
                        {globalProviderSaveState === "saving" ? "儲存中…" : "套用到全部廠商圖片"}
                      </button>
                      <button
                        type="button"
                        className={styles.resetPositionBtn}
                        onClick={() => handleResetPosition(GLOBAL_PROVIDER_SLOT_ID)}
                        disabled={globalProviderSaveState === "saving"}
                      >
                        重設
                      </button>
                    </div>

                    {globalProviderDirty && globalProviderSaveState !== "saving" && (
                      <div className={styles.statusUploading}>尚未儲存，正式頁面不會套用</div>
                    )}
                    {!globalProviderDirty && globalProviderSaveState === "saved" && (
                      <div className={styles.statusSuccess}>已儲存，套用到所有未個別設定的廠商圖片</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.globalPanelCard}`}>
                <div className={styles.deviceTabBar} role="tablist" aria-label="桌面/手機右上角 Logo 統一設定切換">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={globalBadgeDevice === "desktop"}
                    className={globalBadgeDevice === "desktop" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                    onClick={() =>
                      setDeviceBySlot((prev) => ({ ...prev, [GLOBAL_PROVIDER_BADGE_SLOT_ID]: "desktop" }))
                    }
                  >
                    桌面
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={globalBadgeDevice === "mobile"}
                    className={globalBadgeDevice === "mobile" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                    onClick={() =>
                      setDeviceBySlot((prev) => ({ ...prev, [GLOBAL_PROVIDER_BADGE_SLOT_ID]: "mobile" }))
                    }
                  >
                    手機
                  </button>
                </div>

                <div
                  className={styles.previewWrap}
                  style={
                    globalBadgePreviewSlot
                      ? { aspectRatio: String(getPreviewFit(globalBadgePreviewSlot, globalBadgeDevice).aspectRatio) }
                      : undefined
                  }
                >
                  {globalBadgePreviewSrc && globalBadgePreviewSlot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={globalBadgePreviewSrc}
                      alt="右上角 Logo 預覽（任一張已上傳的廠商 Logo，僅供預覽用）"
                      className={styles.previewImg}
                      style={{
                        ...getImageTransformStyle(globalBadgeTransform),
                        objectFit: getPreviewFit(globalBadgePreviewSlot, globalBadgeDevice).objectFit,
                        cursor: "grab",
                        touchAction: "none",
                      }}
                      onPointerDown={(e) => handlePointerDown(GLOBAL_PROVIDER_BADGE_SLOT_ID, e)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      draggable={false}
                    />
                  ) : (
                    <div className={styles.previewPlaceholder} style={{ background: "#d9d9d9" }}>
                      <span>尚無右上角 Logo 可預覽</span>
                    </div>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.slotLabel}>
                    廠商圖右上角 Logo 統一版面設定
                    <br />
                    預覽：{globalBadgePreviewSlot?.label ?? "（尚未上傳任何廠商 Logo）"}
                  </div>

                  <div className={styles.positionEditor}>
                    <div className={styles.positionHint}>
                      在上方縮圖拖曳調整；
                      {globalBadgeDevice === "mobile" ? "目前調整的是「手機版」統一設定。" : "目前調整的是「桌面版」統一設定。"}
                    </div>

                    <label className={styles.scaleRow}>
                      <span>縮放 {Math.round(globalBadgeTransform.scale * 100)}%</span>
                      <input
                        type="range"
                        min={30}
                        max={300}
                        step={5}
                        value={Math.round(globalBadgeTransform.scale * 100)}
                        onChange={(e) => handleScaleChange(GLOBAL_PROVIDER_BADGE_SLOT_ID, Number(e.target.value))}
                      />
                    </label>

                    <div className={styles.axisRow}>
                      <label className={styles.axisField}>
                        X
                        <input
                          type="number"
                          className={styles.axisInput}
                          value={Math.round(globalBadgeTransform.x)}
                          onChange={(e) =>
                            handleAxisInputChange(GLOBAL_PROVIDER_BADGE_SLOT_ID, "x", Number(e.target.value))
                          }
                        />
                        %
                      </label>
                      <label className={styles.axisField}>
                        Y
                        <input
                          type="number"
                          className={styles.axisInput}
                          value={Math.round(globalBadgeTransform.y)}
                          onChange={(e) =>
                            handleAxisInputChange(GLOBAL_PROVIDER_BADGE_SLOT_ID, "y", Number(e.target.value))
                          }
                        />
                        %
                      </label>
                    </div>

                    <div className={styles.positionActions}>
                      <button
                        type="button"
                        className={styles.savePositionBtn}
                        onClick={() => handleSavePosition(GLOBAL_PROVIDER_BADGE_SLOT_ID)}
                        disabled={globalBadgeSaveState === "saving"}
                      >
                        {globalBadgeSaveState === "saving" ? "儲存中…" : "套用到全部右上角 Logo"}
                      </button>
                      <button
                        type="button"
                        className={styles.resetPositionBtn}
                        onClick={() => handleResetPosition(GLOBAL_PROVIDER_BADGE_SLOT_ID)}
                        disabled={globalBadgeSaveState === "saving"}
                      >
                        重設
                      </button>
                    </div>

                    {globalBadgeDirty && globalBadgeSaveState !== "saving" && (
                      <div className={styles.statusUploading}>尚未儲存，正式頁面不會套用</div>
                    )}
                    {!globalBadgeDirty && globalBadgeSaveState === "saved" && (
                      <div className={styles.statusSuccess}>已儲存，套用到所有未個別設定的右上角 Logo</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.grid}>
            {grouped[category].map((slot) => {
              const placeholder = getPlaceholder(slot.id);
              const device = getDevice(slot.id);
              const desktopSrc = images[slot.id];
              const mobileOverrideSrc = mobileImages[slot.id];
              const hasMobileOverride = Boolean(mobileOverrideSrc);
              const src = device === "mobile" ? mobileOverrideSrc ?? desktopSrc : desktopSrc;
              const state = uploadStates[slot.id] ?? "idle";
              const error = errors[slot.id];

              const transform = getTransform(slot.id);
              const dirty = isDirty(slot.id);
              const positionSaveState = positionSaveStates[slot.id] ?? "idle";

              return (
                <div key={slot.id} className={styles.card}>
                  <div className={styles.deviceTabBar} role="tablist" aria-label="桌面/手機圖片與座標切換">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={device === "desktop"}
                      className={device === "desktop" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                      onClick={() => setDeviceBySlot((prev) => ({ ...prev, [slot.id]: "desktop" }))}
                    >
                      桌面
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={device === "mobile"}
                      className={device === "mobile" ? styles.deviceTabBtnActive : styles.deviceTabBtn}
                      onClick={() => setDeviceBySlot((prev) => ({ ...prev, [slot.id]: "mobile" }))}
                    >
                      手機
                    </button>
                  </div>

                  <div
                    className={styles.previewWrap}
                    style={{ aspectRatio: String(getPreviewFit(slot, device).aspectRatio) }}
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={src}
                        alt={slot.label}
                        className={styles.previewImg}
                        style={{
                          ...getImageTransformStyle(transform),
                          objectFit: getPreviewFit(slot, device).objectFit,
                          cursor: "grab",
                          touchAction: "none",
                        }}
                        onPointerDown={(e) => handlePointerDown(slot.id, e)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        draggable={false}
                      />
                    ) : (
                      <div className={styles.previewPlaceholder} style={{ background: placeholder.background }}>
                        <span>{placeholder.emoji}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.slotLabel}>{slot.label}</div>
                    <div className={styles.slotId}>id: {slot.id}</div>
                    <div className={styles.slotMeta}>建議尺寸 {slot.width} x {slot.height} px</div>

                    {device === "desktop" ? (
                      <div className={styles.slotStatus}>
                        {desktopSrc ? "桌面版狀態：已上傳圖片" : "桌面版狀態：目前為色塊 / emoji 佔位"}
                      </div>
                    ) : hasMobileOverride ? (
                      <div className={styles.slotStatus}>手機版狀態：已上傳手機專用圖片</div>
                    ) : (
                      <div className={styles.slotStatus}>
                        手機版狀態：{desktopSrc ? "尚未上傳專用圖片，目前套用桌面版圖片" : "目前為色塊 / emoji 佔位"}
                      </div>
                    )}

                    {state === "uploading" && <div className={styles.statusUploading}>處理中…</div>}
                    {state === "success" && <div className={styles.statusSuccess}>已更新，套用中</div>}
                    {state === "error" && <div className={styles.statusError}>{error}</div>}

                    <input
                      ref={(el) => {
                        fileInputRefs.current[slot.id] = el;
                      }}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      className={styles.hiddenInput}
                      onChange={(e) => handleFileChange(slot.id, e.target.files)}
                    />
                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                    >
                      {device === "mobile"
                        ? hasMobileOverride
                          ? "重新上傳手機專用圖片"
                          : "上傳手機專用圖片"
                        : "選擇檔案上傳"}
                    </button>

                    {device === "mobile" && hasMobileOverride && (
                      <button
                        type="button"
                        className={styles.resetPositionBtn}
                        onClick={() => handleClearMobileImage(slot.id)}
                      >
                        清除手機專用圖片（改回沿用桌面版）
                      </button>
                    )}

                    {src && (
                      <div className={styles.positionEditor}>
                        <div className={styles.positionHint}>
                          在縮圖上按住拖曳調整位置；
                          {device === "mobile" ? "目前調整的是「手機版」座標。" : "目前調整的是「桌面版」座標。"}
                        </div>

                        <label className={styles.scaleRow}>
                          <span>縮放 {Math.round(transform.scale * 100)}%</span>
                          <input
                            type="range"
                            min={30}
                            max={300}
                            step={5}
                            value={Math.round(transform.scale * 100)}
                            onChange={(e) => handleScaleChange(slot.id, Number(e.target.value))}
                          />
                        </label>

                        <div className={styles.axisRow}>
                          <label className={styles.axisField}>
                            X
                            <input
                              type="number"
                              className={styles.axisInput}
                              value={Math.round(transform.x)}
                              onChange={(e) => handleAxisInputChange(slot.id, "x", Number(e.target.value))}
                            />
                            %
                          </label>
                          <label className={styles.axisField}>
                            Y
                            <input
                              type="number"
                              className={styles.axisInput}
                              value={Math.round(transform.y)}
                              onChange={(e) => handleAxisInputChange(slot.id, "y", Number(e.target.value))}
                            />
                            %
                          </label>
                        </div>

                        <div className={styles.positionActions}>
                          <button
                            type="button"
                            className={styles.savePositionBtn}
                            onClick={() => handleSavePosition(slot.id)}
                            disabled={positionSaveState === "saving"}
                          >
                            {positionSaveState === "saving" ? "儲存中…" : "儲存位置"}
                          </button>
                          <button
                            type="button"
                            className={styles.resetPositionBtn}
                            onClick={() => handleResetPosition(slot.id)}
                            disabled={positionSaveState === "saving"}
                          >
                            重設
                          </button>
                        </div>

                        {dirty && positionSaveState !== "saving" && (
                          <div className={styles.statusUploading}>位置尚未儲存，正式頁面不會套用</div>
                        )}
                        {!dirty && positionSaveState === "saved" && (
                          <div className={styles.statusSuccess}>位置已儲存，正式頁面會套用</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
