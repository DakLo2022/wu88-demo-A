"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function ReadOnlyField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 pb-1.5 pt-2">
        <div className="text-[11px] text-black/50">{label}</div>
        <div className="text-[14px] text-black/85">{value}</div>
      </div>
      {note ? <p className="mt-1 text-[11px] text-red-500">{note}</p> : null}
    </div>
  );
}

// 帳戶管理 (under 會員資料) — reuses the same field set as desktop
// MemberCentreModal's MemberProfileTab (confirmed against pc.wu88.live's
// real 會員資料 form), rebuilt as a single-column mobile layout.
export default function MobileAccountManageScreen({ images }: Props) {
  const [showRealName, setShowRealName] = useState(false);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyDeposit, setNotifyDeposit] = useState(true);
  const [notifyGift, setNotifyGift] = useState(true);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="帳戶管理" images={images} backHref="/my" />
      <div className="flex-1 overflow-y-auto bg-[#f0eff5] px-4 py-4">
        <div className="flex flex-col gap-3 rounded-[10px] bg-white p-4">
          <ReadOnlyField label="帳號" value="Heather003" />

          <div className="flex items-center justify-between rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 pb-1.5 pt-2">
            <div>
              <div className="text-[11px] text-black/50">姓名</div>
              <div className="text-[14px] text-black/85">{showRealName ? "王小明" : "•••"}</div>
            </div>
            <button
              type="button"
              aria-label={showRealName ? "隱藏姓名" : "顯示姓名"}
              onClick={() => setShowRealName((v) => !v)}
              className="text-black/40"
            >
              {showRealName ? "🙈" : "👁"}
            </button>
          </div>

          <ReadOnlyField label="暱稱" value="H" />
          <ReadOnlyField label="手機號碼" value="u79" />
          <ReadOnlyField label="Line ID" value="123" note="（若需要修改請聯繫客服）" />

          <div>
            <div className="mb-1 text-[11px] text-black/50">生日</div>
            <input
              type="date"
              className="w-full rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 py-2.5 text-[14px] text-black/85 outline-none"
            />
          </div>

          <ReadOnlyField label="超商地址" value="1:024736-板橋文化-新北市板橋區文化路一段280號" />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/70 outline-none"
          >
            <option value="">城市</option>
            <option value="taipei">台北市</option>
            <option value="new-taipei">新北市</option>
            <option value="taichung">台中市</option>
            <option value="kaohsiung">高雄市</option>
          </select>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/70 outline-none"
          >
            <option value="">鄉鎮市區</option>
            <option value="district-1">示範區 A</option>
            <option value="district-2">示範區 B</option>
          </select>
          <input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="詳細地址"
            className="w-full rounded-t-[4px] border-b-2 border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
          />

          <div className="flex flex-col gap-3 pt-1">
            {[
              { checked: notifySms, set: setNotifySms, title: "接收手機訊息", sub: "是否通過手機接收優惠訊息" },
              { checked: notifyDeposit, set: setNotifyDeposit, title: "接收存、託售通知", sub: "是否通過個人訊息接收通知" },
              { checked: notifyGift, set: setNotifyGift, title: "主播贈禮功能", sub: "聊天室是否開啟贈送禮物" },
            ].map((item) => (
              <label key={item.title} className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.set(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#f39800]"
                />
                <span>
                  <span className="block text-[13px] font-medium text-black">{item.title}</span>
                  <span className="block text-[11px] text-black/50">{item.sub}</span>
                </span>
              </label>
            ))}
          </div>

          <button type="button" className="mt-2 w-full rounded-[3px] bg-[#1976d2] py-2.5 text-[14px] text-white">
            新增確認
          </button>
        </div>
      </div>
    </div>
  );
}
