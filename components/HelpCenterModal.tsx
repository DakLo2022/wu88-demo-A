"use client";

import { useState } from "react";
import {
  FAQ_ITEMS,
  RULES_AND_TERMS,
  PRIVACY_POLICY,
  STORE_SEARCH_711_FLOW,
  STORE_SEARCH_FAMILY_FLOW,
  USDT_DEPOSIT_FLOW,
  ALIPAY_REGISTER_FLOW,
  ALIPAY_DEPOSIT_FLOW,
  type TutorialFlow,
  type AboutDoc,
} from "@/data/helpCenter";
import { helpCenterStepSlotId } from "@/lib/imageSlots";

type Props = {
  open: boolean;
  onClose: () => void;
  images: Record<string, string | null>;
};

const TABS = ["常見問題", "關於我們", "超商搜尋流程", "USDT儲值流程", "支付寶儲值流程"] as const;
type Tab = (typeof TABS)[number];

// 常見問題: plain accordion, verbatim FAQ copy from the real site (short
// functional Q&A text, not long-form creative/legal content).
function FaqTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3 p-5">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="overflow-hidden rounded-[10px] border border-black/10">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-black"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#f4702a] text-[11px] font-bold text-white">
                Q
              </span>
              <span className="flex-1">{item.q}</span>
            </button>
            {isOpen ? (
              <div className="flex items-start gap-3 border-t border-black/5 bg-black/[0.02] px-4 py-3 text-[13px] leading-relaxed text-black/60">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/20 text-[11px] font-bold text-white">
                  A
                </span>
                <span>{item.a}</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// 關於我們: two rows (規則與條款/隱私權政策). Real site pops these into a
// separate floating panel; here they swap the tab content inline with a
// back link, which is functionally equivalent and simpler to navigate.
function AboutTab() {
  const [doc, setDoc] = useState<AboutDoc | null>(null);

  if (doc) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <button onClick={() => setDoc(null)} className="w-fit text-[13px] text-[#e06018] hover:underline">
          ← 返回
        </button>
        <p className="text-[15px] font-medium text-[#e06018]">{doc.title}</p>
        <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-black/70">
          {doc.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      {[RULES_AND_TERMS, PRIVACY_POLICY].map((d) => (
        <button
          key={d.title}
          onClick={() => setDoc(d)}
          className="rounded-[6px] border border-black/10 px-4 py-3 text-left text-[14px] text-black hover:bg-black/[0.02]"
        >
          {d.title}
        </button>
      ))}
    </div>
  );
}

// Shared paginated screenshot-tutorial viewer, used for all three
// "步驟教學" tabs. The real site's equivalent pages are literally just a
// sequence of annotated phone/browser screenshots with no real text
// content, so each step is a plain uploadable image slot; supports both of
// the real site's pagination styles (numbered dots vs "X / Y" counter).
function TutorialSteps({
  flowDef,
  images,
  afterImage,
}: {
  flowDef: TutorialFlow;
  images: Record<string, string | null>;
  afterImage?: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const { flow, count, pagination } = flowDef;
  const src = images[helpCenterStepSlotId(flow, step)];

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[6px] border border-black/10 bg-black/[0.02]"
        style={{ minHeight: 320 }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`步驟 ${step}`} className="max-h-[420px] w-auto object-contain" />
        ) : (
          <span className="p-10 text-center text-[12px] text-black/35">
            步驟 {step}／{count}（請至 /image-manager 上傳截圖）
          </span>
        )}
      </div>

      {afterImage}

      {pagination === "dots" ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] transition-colors ${
                n === step ? "bg-[#e06018] text-white" : "text-black/60 hover:bg-black/5"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            aria-label="上一步"
            className="text-[16px] text-black/50 hover:text-black disabled:opacity-30"
          >
            ‹‹
          </button>
          <span className="text-[14px] font-medium text-[#e06018]">
            {step} / {count}
          </span>
          <button
            onClick={() => setStep((s) => Math.min(count, s + 1))}
            disabled={step === count}
            aria-label="下一步"
            className="text-[16px] text-black/50 hover:text-black disabled:opacity-30"
          >
            ››
          </button>
        </div>
      )}
    </div>
  );
}

// 超商搜尋流程 has a "7-11查詢"/"全家查詢" toggle below the tutorial image —
// each store chain has its own, independent screenshot sequence (5 steps
// for 7-11, 7 steps for 全家) rather than sharing one flow. Defaults to
// 全家查詢 since that's the tab the real site's toggle opens on by default.
function StoreSearchTab({ images }: { images: Record<string, string | null> }) {
  const [store, setStore] = useState<"711" | "family">("family");
  const flowDef = store === "711" ? STORE_SEARCH_711_FLOW : STORE_SEARCH_FAMILY_FLOW;

  return (
    <TutorialSteps
      key={store}
      flowDef={flowDef}
      images={images}
      afterImage={
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStore("711")}
            className={`rounded-[5px] px-4 py-1.5 text-[14px] transition-colors ${
              store === "711" ? "bg-[#f77730] text-white" : "bg-transparent text-[#e06018]"
            }`}
          >
            7-11查詢
          </button>
          <button
            onClick={() => setStore("family")}
            className={`rounded-[5px] px-4 py-1.5 text-[14px] transition-colors ${
              store === "family" ? "bg-[#f77730] text-white" : "bg-transparent text-[#e06018]"
            }`}
          >
            全家查詢
          </button>
        </div>
      }
    />
  );
}

// 支付寶儲值流程 has its own 3 sub-tabs on the real site: 教學影片 (two
// video-link buttons — no real video to embed in a demo, kept as inert
// labeled buttons), 註冊流程 (13-step phone-screenshot tutorial), 儲值流程
// (2-step phone-screenshot tutorial).
function AlipayTab({ images }: { images: Record<string, string | null> }) {
  const [sub, setSub] = useState<"教學影片" | "註冊流程" | "儲值流程">("教學影片");
  return (
    <div className="flex flex-col">
      <div className="flex gap-6 border-b border-black/10 px-5 pt-3">
        {(["教學影片", "註冊流程", "儲值流程"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            className={`border-b-2 pb-2 text-[14px] font-bold transition-colors ${
              sub === t ? "border-[#e06018] text-[#e06018]" : "border-transparent text-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {sub === "教學影片" ? (
        <div className="flex flex-col gap-3 p-6">
          {["國際支付寶註冊流程（一）", "國際支付寶儲值流程（二）"].map((label) => (
            <button
              key={label}
              className="rounded-[4px] bg-[#e06018] py-3 text-center text-[14px] font-medium text-white hover:brightness-105"
            >
              {label}
            </button>
          ))}
        </div>
      ) : sub === "註冊流程" ? (
        <TutorialSteps flowDef={ALIPAY_REGISTER_FLOW} images={images} />
      ) : (
        <TutorialSteps flowDef={ALIPAY_DEPOSIT_FLOW} images={images} />
      )}
    </div>
  );
}

// Centered (not full-page) modal — matches the real site's 協助中心 popup,
// which is a fixed ~800px-wide card rather than the full-viewport takeover
// used by MemberCentreModal/MessageCenterModal.
export default function HelpCenterModal({ open, onClose, images }: Props) {
  const [tab, setTab] = useState<Tab>("常見問題");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="flex max-h-[85vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[10px] bg-white shadow-xl">
        <div className="flex items-center gap-2 rounded-t-[10px] bg-[#f4702a] px-6 py-3 text-white">
          <h2 className="text-[17px] font-medium">協助中心</h2>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full hover:bg-white/15"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto border-b border-black/10 px-6 pt-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 border-b-4 pb-2 text-[15px] font-bold transition-colors ${
                tab === t ? "border-[#e06018] text-[#e06018]" : "border-transparent text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "常見問題" ? <FaqTab /> : null}
          {tab === "關於我們" ? <AboutTab /> : null}
          {tab === "超商搜尋流程" ? <StoreSearchTab images={images} /> : null}
          {tab === "USDT儲值流程" ? <TutorialSteps flowDef={USDT_DEPOSIT_FLOW} images={images} /> : null}
          {tab === "支付寶儲值流程" ? <AlipayTab images={images} /> : null}
        </div>
      </div>
    </div>
  );
}
