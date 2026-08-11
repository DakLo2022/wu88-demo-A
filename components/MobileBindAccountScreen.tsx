"use client";

import { useState } from "react";
import MobileSubPageHeader from "./MobileSubPageHeader";

type Props = { images: Record<string, string | null> };

function FileField({ label, fileName, onPick }: { label: string; fileName: string | null; onPick: (name: string) => void }) {
  return (
    <label className="flex w-full cursor-pointer items-center rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/40">
      <span className={fileName ? "text-black/80" : ""}>{fileName || label}</span>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0]?.name ?? "")} />
    </label>
  );
}

const fieldClass =
  "w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none";

function BankCardTab() {
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [passbookFront, setPassbookFront] = useState<string | null>(null);

  if (!showForm) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-6">
        <div className="relative flex h-[140px] w-full flex-col justify-between rounded-[10px] bg-gradient-to-br from-[#2b2b2b] to-[#0d0d0d] p-4 text-white shadow-lg">
          <span className="text-[18px] font-extrabold tracking-wide">BANK</span>
          <span className="text-[22px]">💳</span>
          <span className="text-[14px] font-medium tracking-wide">004 臺灣銀行 1405******9300</span>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-[4px] bg-[#eb5e1a] py-3 text-[15px] font-medium text-white"
        >
          新增銀行卡
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-6">
      <select
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/70 outline-none"
      >
        <option value="">銀行名稱</option>
        <option value="004">004 臺灣銀行</option>
        <option value="822">822 中國信託</option>
        <option value="808">808 玉山銀行</option>
      </select>
      <input value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="分行名稱" className={fieldClass} />
      <input value={accountNo} onChange={(e) => setAccountNo(e.target.value)} placeholder="銀行帳號" className={fieldClass} />
      <input
        value={confirmAccountNo}
        onChange={(e) => setConfirmAccountNo(e.target.value)}
        placeholder="確認銀行帳號"
        className={fieldClass}
      />
      <FileField label="身分證正面" fileName={idFront} onPick={setIdFront} />
      <FileField label="身分證反面" fileName={idBack} onPick={setIdBack} />
      <FileField label="存摺正面" fileName={passbookFront} onPick={setPassbookFront} />
      <button type="button" className="w-full rounded-[4px] bg-[#1976d2] py-3 text-[15px] font-medium text-white">
        新增確認
      </button>
    </div>
  );
}

function UsdtTab() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [chain, setChain] = useState("TRC20");
  const [address, setAddress] = useState("");

  if (!showForm) {
    return (
      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-[4px] bg-[#1976d2] py-3 text-[15px] font-medium text-white"
        >
          新增USDT
        </button>
      </div>
    );
  }

  const canSubmit = name.trim() && address.trim().length === 34;

  return (
    <div className="flex flex-col gap-3 px-4 py-6">
      <div>
        <div className="mb-1 text-[13px] text-black/50">請輸入錢包名稱：</div>
        <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <div className="mb-1 text-[13px] text-black/50">請上傳錢包地址截圖：</div>
        <label className="flex cursor-pointer items-center gap-2 rounded border border-black/15 px-3 py-3 text-[14px] text-black/40">
          📎 選擇檔案
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-medium text-black">幣種：</span>
        <span className="rounded-full bg-[#f39800] px-3 py-1 text-[12px] font-bold text-white">USDT</span>
      </div>

      <div>
        <div className="mb-1 text-[13px] text-black/50">鏈別：</div>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="w-full rounded border border-black/15 px-3 py-3 text-[14px] text-black/80 outline-none"
        >
          <option>TRC20</option>
          <option>ERC20</option>
        </select>
      </div>

      <div>
        <div className="mb-1 text-[13px] text-black/50">錢包地址：</div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full resize-none rounded border border-black/15 px-3 py-3 text-[14px] text-black/80 outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-[12px]">
          <span className="text-red-500">{address.length !== 34 ? "請輸入正確格式" : ""}</span>
          <span className="text-black/40">{address.length}/ 34</span>
        </div>
      </div>

      <div className="text-[12px] text-red-500">
        <p className="mb-1 font-medium">⚠️ 注意事項</p>
        <p>＊僅支援新增以上區塊鏈鏈別</p>
        <p>＊請新增本人開立之交易所虛擬錢包</p>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        className={`rounded-[4px] py-3 text-[15px] font-medium text-white ${canSubmit ? "bg-[#1976d2]" : "bg-black/20"}`}
      >
        立即申請
      </button>
      <p className="text-center text-[12px] text-black/40">
        如需幫助，請<span className="text-[#1976d2]">聯繫客服</span>
      </p>
    </div>
  );
}

// 綁定帳戶 — mobile "卡片管理" page. Confirmed live: 銀行卡/USDT toggle at
// top, matching the same two payout-method flows already built for the
// desktop MemberCentreModal (BindBankCardTab/BindUsdtTab), rebuilt here as a
// single-column mobile layout instead of the desktop's centered form.
export default function MobileBindAccountScreen({ images }: Props) {
  const [tab, setTab] = useState<"銀行卡" | "USDT">("銀行卡");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <MobileSubPageHeader title="綁定帳戶" images={images} />

      <div className="flex flex-shrink-0 bg-white">
        {(["銀行卡", "USDT"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex h-11 flex-1 items-center justify-center border-b-[3px] text-[14px] font-bold ${
              tab === t ? "border-[#eb5e1a] text-[#eb5e1a]" : "border-transparent text-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f0eff5]">
        {tab === "銀行卡" ? <BankCardTab /> : <UsdtTab />}
      </div>
    </div>
  );
}
