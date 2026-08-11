"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";
import MobileTutorialSteps from "./MobileTutorialSteps";
import {
  STORE_SEARCH_711_FLOW,
  STORE_SEARCH_FAMILY_FLOW,
  USDT_DEPOSIT_FLOW,
  ALIPAY_REGISTER_FLOW,
  ALIPAY_DEPOSIT_FLOW,
  TAIWAN_PAY_FLOW,
} from "@/data/helpCenter";

type Variant = "usdt" | "store-search" | "taiwan-pay" | "alipay";

type Props = { images: Record<string, string | null>; variant: Variant };

const TITLES: Record<Variant, string> = {
  usdt: "USDT儲值流程",
  "store-search": "超商查詢流程",
  "taiwan-pay": "雲支付綁定流程",
  alipay: "支付寶綁定流程",
};

function SubTabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 rounded-[5px] px-3.5 py-1.5 text-[13px] ${
        active ? "bg-[#f77730] text-white" : "bg-black/[0.04] text-[#e06018]"
      }`}
    >
      {children}
    </button>
  );
}

function StoreSearchBody({ images }: { images: Record<string, string | null> }) {
  const [store, setStore] = useState<"711" | "family">("family");
  const flowDef = store === "711" ? STORE_SEARCH_711_FLOW : STORE_SEARCH_FAMILY_FLOW;
  return (
    <MobileTutorialSteps
      key={store}
      flowDef={flowDef}
      images={images}
      afterImage={
        <div className="flex items-center gap-3">
          <SubTabButton active={store === "711"} onClick={() => setStore("711")}>7-11查詢</SubTabButton>
          <SubTabButton active={store === "family"} onClick={() => setStore("family")}>全家查詢</SubTabButton>
        </div>
      }
    />
  );
}

function AlipayBody({ images }: { images: Record<string, string | null> }) {
  const [sub, setSub] = useState<"教學影片" | "註冊流程" | "儲值流程">("教學影片");
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 overflow-x-auto px-4 pt-3">
        {(["教學影片", "註冊流程", "儲值流程"] as const).map((t) => (
          <SubTabButton key={t} active={sub === t} onClick={() => setSub(t)}>
            {t}
          </SubTabButton>
        ))}
      </div>
      {sub === "教學影片" ? (
        <div className="flex flex-col gap-3 p-4">
          {["國際支付寶註冊流程（一）", "國際支付寶儲值流程（二）"].map((label) => (
            <button key={label} type="button" className="rounded-[4px] bg-[#e06018] py-3 text-center text-[14px] font-medium text-white">
              {label}
            </button>
          ))}
        </div>
      ) : sub === "註冊流程" ? (
        <MobileTutorialSteps flowDef={ALIPAY_REGISTER_FLOW} images={images} />
      ) : (
        <MobileTutorialSteps flowDef={ALIPAY_DEPOSIT_FLOW} images={images} />
      )}
    </div>
  );
}

// Shared screen for all 4 step-by-step-screenshot 協助中心 sub-pages —
// confirmed live these are each just a paginated sequence of screenshots
// with no real text content, same underlying pattern already built for
// desktop HelpCenterModal, just wrapped in the mobile sub-page header
// instead of a modal tab panel. 雲支付綁定流程 (taiwan-pay, confirmed live at
// /taiwan_pay_illustrate) uses a single continuous 15-step counter sequence
// — its 3 label groups weren't individually re-verified step-by-step, so
// they aren't split into separate flows here.
export default function MobileHelpTutorialScreen({ images, variant }: Props) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title={TITLES[variant]} images={images} backHref="/my" />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5]">
        {variant === "usdt" ? <MobileTutorialSteps flowDef={USDT_DEPOSIT_FLOW} images={images} /> : null}
        {variant === "store-search" ? <StoreSearchBody images={images} /> : null}
        {variant === "taiwan-pay" ? <MobileTutorialSteps flowDef={TAIWAN_PAY_FLOW} images={images} /> : null}
        {variant === "alipay" ? <AlipayBody images={images} /> : null}
      </div>
    </div>
  );
}
