"use client";

import { useEffect, useRef, useState } from "react";
import { navCategories } from "@/data/nav";

type Props = {
  open: boolean;
  onClose: () => void;
  username: string;
  images: Record<string, string | null>;
  /** Which tab to jump to the next time the modal opens (e.g. clicking
   * 平台轉點/儲值/託售 in the post-login TopBar should land directly on that
   * tab instead of always opening to 會員資料). Only applied on the
   * open-transition, since the modal component stays mounted (and its
   * activeTab state persists) even while `open` is false. */
  initialTab?: string;
};

// Tab list, in the same order as pc.wu88.live's real /memberCentre header
// (confirmed via live DOM inspection while logged in).
const TABS = [
  "會員資料",
  "託售",
  "儲值",
  "平台轉點",
  "帳務",
  "安全中心",
  "帳戶明細",
  "投注紀錄",
  "會員等級",
  "邀請好友",
  "投注彩金",
  "綁定帳戶(USDT)",
  "綁定帳戶(銀行卡)",
];

// Flat "XX錢包" list for the wallet-transfer grid shared by 託售 and
// 平台轉點 — the real site's grid isn't grouped by category (no section
// headers), just every provider's wallet in one flat 3-column list, so this
// flattens all non-熱門 categories' providers into a single array.
const ALL_WALLETS = navCategories.filter((c) => c.key !== "hot").flatMap((c) => c.providers);

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// VIP tier reference table — static data, confirmed against pc.wu88.live's
// real 會員等級 > VIP 詳情 table (all 10 tiers).
const VIP_TIERS = [
  { tier: "VIP1", name: "銅", bet: "0", keepBet: "0", upgradeBonus: "0", birthdayBonus: "88", sportsRebate: "0.3%", otherRebate: "0.4%", depositBonus: "1%" },
  { tier: "VIP2", name: "銀", bet: "60,000", keepBet: "20,000", upgradeBonus: "88", birthdayBonus: "188", sportsRebate: "0.3%", otherRebate: "0.4%", depositBonus: "2%" },
  { tier: "VIP3", name: "金", bet: "500,000", keepBet: "250,000", upgradeBonus: "188", birthdayBonus: "388", sportsRebate: "0.35%", otherRebate: "0.45%", depositBonus: "3%" },
  { tier: "VIP4", name: "白金", bet: "1,000,000", keepBet: "500,000", upgradeBonus: "688", birthdayBonus: "888", sportsRebate: "0.4%", otherRebate: "0.5%", depositBonus: "4%" },
  { tier: "VIP5", name: "鑽", bet: "5,000,000", keepBet: "2,500,000", upgradeBonus: "1,888", birthdayBonus: "1,088", sportsRebate: "0.45%", otherRebate: "0.55%", depositBonus: "5%" },
  { tier: "VIP6", name: "金鑽", bet: "10,000,000", keepBet: "5,000,000", upgradeBonus: "2,888", birthdayBonus: "1,288", sportsRebate: "0.5%", otherRebate: "0.6%", depositBonus: "6%" },
  { tier: "VIP7", name: "鬼推磨", bet: "15,000,000", keepBet: "7,500,000", upgradeBonus: "5,888", birthdayBonus: "3,888", sportsRebate: "0.6%", otherRebate: "0.7%", depositBonus: "7%" },
  { tier: "VIP8", name: "傳說", bet: "30,000,000", keepBet: "15,000,000", upgradeBonus: "8,888", birthdayBonus: "5,888", sportsRebate: "0.65%", otherRebate: "0.75%", depositBonus: "8%" },
  { tier: "VIP9", name: "至尊", bet: "60,000,000", keepBet: "30,000,000", upgradeBonus: "13,888", birthdayBonus: "8,888", sportsRebate: "0.8%", otherRebate: "0.8%", depositBonus: "9%" },
  { tier: "VIP10", name: "王者", bet: "平台誠邀", keepBet: "平台誠邀", upgradeBonus: "18,888", birthdayBonus: "13,888", sportsRebate: "1%", otherRebate: "1%", depositBonus: "10%" },
];

// ---------- Small shared field components ----------

function ReadOnlyField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-1.5 pt-2">
        <div className="text-[12px] text-black/50">{label}</div>
        <div className="text-[15px] text-black/85">{value}</div>
      </div>
      {note ? <p className="mt-1 text-[12px] text-red-600">{note}</p> : null}
    </div>
  );
}

function LabeledInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[12px] text-black/50">{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none placeholder:text-black/40"
      />
    </div>
  );
}

// Countdown text used by both wallet-transfer grids ("$ 299 倒數 X 秒" at the
// top of 託售/平台轉點's grid — a fake auto-refresh indicator, loops 3→1).
function useLoopingCountdown(seconds: number) {
  const [n, setN] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v <= 1 ? seconds : v - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  return n;
}

// ---------- Wallet transfer grid (shared by 託售 + 平台轉點) ----------

function WalletTransferGrid({ actionLabel, recoverLabel }: { actionLabel: string; recoverLabel: string }) {
  const countdown = useLoopingCountdown(3);
  const rows = chunk(ALL_WALLETS, 3);

  return (
    // Wide enough for the longest full provider names (e.g. "Slotmill電子
    // 錢包", "永續高登彩球錢包") to render without truncation — intentionally
    // wider than the ~500px form below it, so it's centered independently by
    // its parent tab rather than being capped to the form's width.
    <div className="w-full max-w-[820px] rounded-[5px] bg-[#2b2b2b] p-4 text-white">
      <div className="mb-2 text-center text-[15px]">
        <span className="text-white/70">$</span> <span className="font-semibold">299</span>{" "}
        <span className="text-white/50">倒數 {countdown} 秒</span>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            {row.map((name) => (
              <div key={name} className="flex items-center border-b border-white/10 py-1.5 text-[13px]">
                <span className="flex-1 whitespace-nowrap pr-2 text-white/90">{name}錢包</span>
                <span className="mr-4 flex-shrink-0 text-right text-yellow-400">{name === "雷火" ? 1 : 0}</span>
                <button className="flex-shrink-0 rounded-[3px] border border-[#eb5e1a] px-2 py-0.5 text-[11px] text-[#eb5e1a] hover:bg-[#eb5e1a]/10">
                  {actionLabel}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-[14px]">
        <span>我的錢包</span>
        <span className="text-yellow-400">299</span>
        <button className="rounded-[3px] border border-[#eb5e1a] px-2 py-1 text-[#eb5e1a] hover:bg-[#eb5e1a]/10">
          {recoverLabel}
        </button>
      </div>
    </div>
  );
}

// ---------- Simple filter + table (帳務 / 帳戶明細 / 投注紀錄) ----------

function RecordsTable({
  columns,
  showStatusToggle,
  typeOptions,
}: {
  columns: string[];
  showStatusToggle?: boolean;
  typeOptions: string[];
}) {
  const [statusTab, setStatusTab] = useState<"未完成" | "已完成">("未完成");
  const countdown = useLoopingCountdown(60);

  return (
    // Two separate blocks, screenshot-confirmed: the filter/tab row keeps its
    // own cream background, and the results table sits in its own plain
    // white card below it (not sharing one bordered/tinted container).
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] bg-[#fbf1dd] px-4 py-3">
        <select className="rounded border border-black/10 bg-white px-2 py-1 text-[13px] text-black/70 outline-none">
          <option>今日</option>
          <option>近 7 天</option>
          <option>近 30 天</option>
        </select>

        {showStatusToggle ? (
          <div className="flex gap-6 text-[14px]">
            {(["未完成", "已完成"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStatusTab(t)}
                className={`border-b-2 pb-1 ${
                  statusTab === t ? "border-[#eb5e1a] font-medium text-[#eb5e1a]" : "border-transparent text-black/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <select className="rounded border border-black/10 bg-white px-2 py-1 text-[13px] text-black/70 outline-none">
            {typeOptions.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {showStatusToggle ? <span className="text-[13px] font-medium text-[#eb5e1a]">{countdown} s</span> : null}
        </div>
      </div>

      <div className="rounded-[4px] border border-black/10 bg-white">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/10 text-black/70">
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-black/60">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden>⚠️</span> 沒有資料
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Tab panels ----------

function MemberProfileTab({ username }: { username: string }) {
  const [showRealName, setShowRealName] = useState(false);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [notifySms, setNotifySms] = useState(true);
  const [notifyDeposit, setNotifyDeposit] = useState(true);
  const [notifyGift, setNotifyGift] = useState(true);

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <h2 className="text-[20px] font-medium text-black">會員資料</h2>

      <ReadOnlyField label="帳號" value={username || "會員001"} />

      <div className="flex items-center justify-between rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-1.5 pt-2">
        <div>
          <div className="text-[12px] text-black/50">姓名</div>
          <div className="text-[15px] text-black/85">{showRealName ? "王小明" : "•••"}</div>
        </div>
        <button
          type="button"
          aria-label={showRealName ? "隱藏姓名" : "顯示姓名"}
          onClick={() => setShowRealName((v) => !v)}
          className="text-black/40 hover:text-black/70"
        >
          {showRealName ? "🙈" : "👁"}
        </button>
      </div>

      <ReadOnlyField label="暱稱" value="H" />
      <ReadOnlyField label="手機號碼" value="u79" />
      <ReadOnlyField label="Line ID" value="123" note="（若需要修改請聯繫客服）" />

      <div>
        <div className="text-[12px] text-black/50">生日</div>
        <input
          type="date"
          className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none"
        />
      </div>

      <ReadOnlyField label="超商地址" value="1:024736-板橋文化-新北市板橋區文化路一段280號" />

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
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
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
      >
        <option value="">鄉鎮市區</option>
        <option value="district-1">示範區 A</option>
        <option value="district-2">示範區 B</option>
      </select>
      <input
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        placeholder="詳細地址"
        className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
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
              <span className="block text-[14px] font-medium text-black">{item.title}</span>
              <span className="block text-[12px] text-black/50">{item.sub}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex justify-center pb-2 pt-2">
        <button
          type="button"
          className="rounded-[3px] bg-[#1976d2] px-4 py-1 text-[14px] text-white hover:brightness-110"
        >
          新增確認
        </button>
      </div>
    </div>
  );
}

function ConsignTab() {
  const [method, setMethod] = useState<"銀行卡" | "USDT錢包">("銀行卡");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const infoRows = [
    { icon: "💲", label: "單筆最高金額", value: "490000" },
    { icon: "📈", label: "流水量", value: "可領取" },
    { icon: "💳", label: "可提現額度", value: "0" },
    { icon: "🕐", label: "今日提現次數剩餘", value: "5" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

      <div className="w-full max-w-[500px] rounded-[4px] border border-black/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-medium text-[#1976d2]">
          <span>ℹ️</span> 您的帳號資訊
        </div>
        <div className="flex flex-col divide-y divide-black/10">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center gap-3 py-2 text-[14px]">
              <span>{row.icon}</span>
              <span className="text-black/80">
                {row.label}：{row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[500px] rounded-[4px] border border-black/10 p-4">
        <div className="mb-3 flex gap-6 border-b border-black/10 text-[14px]">
          {(["銀行卡", "USDT錢包"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`border-b-2 pb-2 ${
                method === m ? "border-[#eb5e1a] font-medium text-[#eb5e1a]" : "border-transparent text-black/50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {method === "銀行卡" ? (
          <>
            <div className="flex flex-col gap-1">
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none"
              >
                <option value="">選擇託售帳號</option>
                <option value="a">004 臺灣銀行 1405******9300</option>
              </select>
              {!account ? <p className="text-[12px] text-red-600">請選擇一個託售帳號</p> : null}
            </div>

            <div className="mt-3 flex flex-col gap-1">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="輸入金額"
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
              />
              {!amount ? <p className="text-[12px] text-red-600">請輸入託售的金額(必須為整數)</p> : null}
            </div>

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="交易安全碼"
              className="mt-3 w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/85 placeholder-black/50 outline-none"
            />

            <div className="mt-4 flex justify-center">
              <button className="rounded-[3px] bg-[#1976d2] px-5 py-1.5 text-[14px] text-white hover:brightness-110">
                送出託售
              </button>
            </div>
          </>
        ) : (
          // USDT錢包 sub-tab has no form of its own on the real site — just a
          // single centered "新增USDT錢包" button prompting the member to add
          // a wallet first (screenshot-confirmed).
          <div className="flex h-[220px] items-center justify-center">
            <button className="rounded-[4px] bg-[#1976d2] px-6 py-2.5 text-[14px] font-bold text-white hover:brightness-110">
              新增USDT錢包
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Boxed amount/text field styled after pc.wu88.live's real 儲值 inputs: a
// light-gray box with a small red label + warning badge along the top and
// the value beneath it, rather than a plain placeholder input.
function DepositField({
  label,
  value,
  onChange,
  labelColor = "text-red-500",
  rightIcon = "!",
  onClear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  labelColor?: string;
  rightIcon?: "!" | "⚠";
  onClear?: () => void;
}) {
  return (
    <div className="rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 pb-2 pt-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-[13px] ${labelColor}`}>{label}</span>
        <div className="flex items-center gap-2">
          {rightIcon === "!" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              !
            </span>
          ) : (
            <span className="text-[14px] text-red-500">⚠</span>
          )}
          {onClear ? (
            <button type="button" onClick={onClear} aria-label="清除" className="text-black/30 hover:text-black/60">
              ✕
            </button>
          ) : null}
        </div>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full bg-transparent text-[15px] text-black/85 outline-none"
      />
    </div>
  );
}

function DepositTab() {
  const [method, setMethod] = useState<"USDT" | "銀行轉點">("USDT");
  const [amount, setAmount] = useState("0");
  const [remitterName, setRemitterName] = useState("");
  const quickAmounts = [100, 500, 1000, 3000, 5000, 10000, 15000, 20000];

  const notices: { title: string; items: string[] }[] = [
    {
      title: "銀行卡儲值注意事項",
      items: [
        "採實名制，限定「綁定在平台的帳戶」進行儲值",
        "不支持 ATM 現金存入及電子支付軟件轉帳",
        "轉帳切勿進行任何備註，設置備註將一律退款",
        "匯款金額須與提單金額完全相符",
      ],
    },
    {
      title: "USDT 儲值注意事項",
      items: ["交易所會收取單筆手續費，扣除手續費金額須與提單金額相符", "輸入的金額為 USDT【顆數】", "建議使用冷錢包，避免風控"],
    },
    {
      title: "超商儲值注意事項",
      items: ["需使用設置的門市進行繳費，僅支持設置一間門市", "使用非設置門市繳費，將導致系統無法自動上分"],
    },
    {
      title: "支付寶儲值注意事項",
      items: ["自動換算人民幣，超過 200 元會有 3% 手續費", "每卡可綁 3 帳號，每帳號最多刷 15000 RMB", "支持信用卡（VISA / Master / JCB）"],
    },
  ];

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <p className="text-[14px] font-medium text-red-600">點數錢包支付方式</p>
      {(["USDT", "銀行轉點"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMethod(m)}
          className={`rounded-[3px] py-2 text-[15px] font-medium text-white ${
            method === m ? "bg-[#f39800]" : "bg-[#1976d2]"
          } hover:brightness-110`}
        >
          {m === "銀行轉點" ? "銀行轉點(第三方金流)" : m}
        </button>
      ))}

      {/* Amount box + limit line differ per method: USDT shows a live
          exchange-rate label and a "看儲值流程" link; 銀行轉點 shows a
          plainer limit range and no link (screenshot-confirmed against the
          real site's two payment flows). */}
      <DepositField
        label={method === "USDT" ? "儲值金額 1USDT:32.5" : "儲值金額"}
        value={amount}
        onChange={setAmount}
        onClear={() => setAmount("")}
      />
      <div className="-mt-2 flex items-center justify-between">
        <p className="text-[12px] text-[#c0392b]">存款限額{method === "USDT" ? "10~500000" : "1001~49999"}</p>
        {method === "USDT" ? (
          <button type="button" className="flex items-center gap-1 text-[12px] text-[#eb5e1a] hover:underline">
            <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-sm bg-[#1976d2] text-[9px] font-bold text-white">
              i
            </span>
            點我看USDT儲值流程
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((v) => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            className="rounded-[4px] bg-[#f39800] py-2 text-[14px] font-medium text-white hover:brightness-105"
          >
            {v}
          </button>
        ))}
      </div>

      {method === "USDT" ? (
        <div className="flex flex-col gap-1">
          <select className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/70 outline-none">
            <option>TRC20 (限額 10-500000 USDT)</option>
          </select>
          <p className="text-[12px] text-red-600">請選擇付款通道</p>
        </div>
      ) : (
        <>
          <DepositField label="匯款人姓名" value={remitterName} onChange={setRemitterName} labelColor="text-black/70" rightIcon="⚠" />
          <p className="-mt-2 text-[12px] text-[#c0392b]">為及時到帳，請務必輸入正確的匯款人姓名</p>

          <div className="flex flex-col gap-1">
            <select className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-3 text-[15px] text-black/40 outline-none">
              <option>選擇儲值帳號</option>
              <option>004 臺灣銀行 1405******9300</option>
            </select>
            <p className="text-[12px] text-[#c0392b]">再次提醒，請選擇轉帳時會使用的銀行號碼和本人帳戶，否則可能會導致失敗，謝謝！</p>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3">
        {notices.map((n) => (
          <div key={n.title}>
            <p className="mb-1 flex items-center gap-1 text-[14px] font-medium text-black">✅ {n.title}</p>
            <ul className="flex flex-col gap-0.5 pl-4 text-[13px] text-black/70">
              {n.items.map((it) => (
                <li key={it}>■ {it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="w-full rounded-[3px] bg-[#f39800] py-2.5 text-[15px] font-medium text-white hover:brightness-105">
        提交
      </button>
    </div>
  );
}

function TransferTab() {
  const [autoConvert, setAutoConvert] = useState(false);
  const [fromWallet, setFromWallet] = useState("我的錢包");
  const [toWallet, setToWallet] = useState(ALL_WALLETS[0] ?? "Super錢包");
  const [amount, setAmount] = useState("0");

  return (
    <div className="flex flex-col items-center gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

      <div className="flex w-full max-w-[820px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-black">自動轉換</span>
          <button
            onClick={() => setAutoConvert((v) => !v)}
            className={`h-6 w-11 flex-shrink-0 rounded-full transition-colors ${autoConvert ? "bg-[#f39800]" : "bg-black/20"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                autoConvert ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div>
          <p className="mb-2 text-[12px] text-black/50">選擇轉點場館錢包</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="mb-1 text-[13px] font-medium text-[#eb5e1a]">┃ 轉出錢包</p>
              <select
                value={fromWallet}
                onChange={(e) => setFromWallet(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[14px] text-black/80 outline-none"
              >
                <option>我的錢包</option>
              </select>
            </div>
            <span className="pt-5 text-black/40">»</span>
            <div className="flex-1">
              <p className="mb-1 text-[13px] font-medium text-[#eb5e1a]">┃ 轉入錢包</p>
              <select
                value={toWallet}
                onChange={(e) => setToWallet(e.target.value)}
                className="w-full rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[14px] text-black/80 outline-none"
              >
                {ALL_WALLETS.map((w) => (
                  <option key={w}>{w}錢包</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-1 text-[12px] text-black/40">ⓘ *場館錢包間不可互轉</p>
        </div>

        <div>
          <p className="mb-1 text-[14px] text-black">金額</p>
          <div className="flex items-center gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-t-[4px] border-b-2 border-black/20 bg-black/5 px-3 py-2 text-[15px] text-black/85 outline-none"
            />
            <button
              onClick={() => setAmount("299")}
              className="rounded-[3px] bg-[#f39800] px-3 py-1.5 text-[13px] text-white hover:brightness-105"
            >
              最大
            </button>
          </div>
        </div>

        <button className="rounded-[3px] bg-[#f39800] py-2.5 text-[15px] font-medium text-white hover:brightness-105">
          送出
        </button>
      </div>
    </div>
  );
}

function SecurityTab({ username }: { username: string }) {
  const [sub, setSub] = useState<"登入" | "託售" | "重設">("登入");

  // Colors + tab-bar/border tint measured directly off pc.wu88.live's real
  // 安全中心 page via getComputedStyle(): each sub-tab's icon+label keeps its
  // own fixed color at all times (purple/orange/teal) — only the 2px
  // underline toggles on/off to show which is active. The whole card is
  // outlined in the same translucent orange used for the tab-row fill
  // (measured as rgba(255,165,0,0.2)).
  const subTabs = [
    { key: "登入" as const, icon: "🔑", label: "修改登入密碼", color: "text-[#9c27b0]", underline: "border-[#9c27b0]" },
    { key: "託售" as const, icon: "🔒", label: "修改託售密碼", color: "text-[#ff9800]", underline: "border-[#ff9800]" },
    { key: "重設" as const, icon: "🔄", label: "重設託售密碼", color: "text-[#009688]", underline: "border-[#009688]" },
  ];

  const fieldClass =
    "w-full rounded-[4px] border border-black/20 px-3 py-2.5 text-[14px] text-black/85 outline-none placeholder-black/40";

  return (
    <div className="mx-auto w-full max-w-[720px] border border-[rgba(255,165,0,0.3)]">
      <div className="flex bg-[rgba(255,165,0,0.15)]">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSub(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-4 text-[15px] font-medium ${t.color} ${
              sub === t.key ? t.underline : "border-transparent"
            }`}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 bg-white px-10 py-8">
        {/* 重設託售密碼 uses an entirely different field set from the other
            two sub-tabs (phone + SMS-code verification instead of an
            original-password check) — screenshot/DOM-confirmed against the
            real site, which was previously missed. */}
        {sub === "重設" ? (
          <>
            <div className="flex items-center gap-3 rounded-[4px] border border-black/20 px-3 py-1.5">
              <div className="flex-1">
                <div className="text-[11px] text-black/50">手機號碼</div>
                <div className="text-[14px] text-black/80">{username ? username.slice(0, 3) : "u79"}</div>
              </div>
              <button className="flex-shrink-0 rounded-[3px] bg-[#2196f3] px-3 py-1.5 text-[13px] font-medium text-white hover:brightness-105">
                取得驗證碼
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-[4px] border border-black/20 px-3 py-1.5">
              <input placeholder="驗證碼" className="flex-1 py-1.5 text-[14px] text-black/85 outline-none placeholder-black/40" />
              <button className="flex-shrink-0 rounded-[3px] bg-[#9c27b0] px-3 py-1.5 text-[13px] font-medium text-white hover:brightness-105">
                驗證
              </button>
            </div>
            <input type="password" placeholder="新密碼" className={fieldClass} />
            <input type="password" placeholder="確認新密碼" className={fieldClass} />
          </>
        ) : (
          <>
            <input type="password" placeholder="原始密碼" className={fieldClass} />
            <input type="password" placeholder="新密碼" className={fieldClass} />
            <input type="password" placeholder="確認新密碼" className={fieldClass} />
          </>
        )}

        <div className="flex justify-center pt-1">
          <button className="w-[200px] rounded-[3px] bg-[#ff9800] py-2 text-[14px] font-medium text-white hover:brightness-105">
            修改
          </button>
        </div>
      </div>
    </div>
  );
}

// Representative color per tier (the real site uses its own badge artwork
// per tier; this is a close visual stand-in — bronze/silver/gold and then
// progressively more distinct colors up through 王者).
const TIER_COLORS: Record<string, string> = {
  銅: "#b08d57",
  銀: "#b8bcc2",
  金: "#d9b44a",
  白金: "#cfd8dc",
  鑽: "#4fc3f7",
  金鑽: "#e0c15c",
  鬼推磨: "#7e57c2",
  傳說: "#5c6bc0",
  至尊: "#c0392b",
  王者: "#212121",
};

const TIER_ICONS: Record<string, string> = {
  銅: "🥉",
  銀: "🥈",
  金: "🥇",
  白金: "🔷",
  鑽: "💎",
  金鑽: "✨",
  鬼推磨: "🌀",
  傳說: "🐲",
  至尊: "🔱",
  王者: "👑",
};

// Hero rendered flush against the tab-bar above it — a direct child of the
// scrollable content pane (not the padded max-w-[1000px] wrapper the other
// tabs share), with negative margins that exactly cancel that pane's own
// padding so it bleeds edge-to-edge and has zero gap under the tab-bar,
// matching pc.wu88.live's real 會員等級 page (screenshot-confirmed).
function VipHero({ username }: { username: string }) {
  const currentIdx = 0;
  const nextIdx = Math.min(currentIdx + 1, VIP_TIERS.length - 1);
  const current = VIP_TIERS[currentIdx];
  const next = VIP_TIERS[nextIdx];

  return (
    // Single continuous orange card (no cut-out) split into two side-by-side
    // regions with a flex row: the personal-info block takes 3/4 of the
    // width, the badge gets its own 1/4 column on the right — two blocks
    // sharing one orange container, rather than a notch that punched a hole
    // in the background.
    <div className="relative mx-auto -mt-6 mb-6 flex w-full max-w-[1000px] items-start rounded-b-[60px] bg-[#ffa62f] pb-8 pt-5 text-white">
      <div className="w-3/4 flex-shrink-0 pl-6">
        <div className="flex items-center gap-2 text-[16px] font-medium">
          {username || "會員001"}
          <span className="rounded bg-[#f39800] px-2 py-0.5 text-[11px] font-medium text-white">
            vip{currentIdx + 1} {current.name}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[13px]">
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white shadow"
            style={{ backgroundColor: TIER_COLORS[current.name] }}
          >
            {current.name}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-[5%] rounded-full bg-white" />
          </div>
          <span
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white shadow"
            style={{ backgroundColor: TIER_COLORS[next.name] }}
          >
            {next.name}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-white/85">
          <span>
            vip{currentIdx + 1} {current.name}
          </span>
          <span>
            vip{nextIdx + 1} {next.name}
          </span>
        </div>

        <p className="mt-3 text-[12px] text-white/90">
          ① 所需流水：{next.bet.replace(/,/g, "")}，晉級至VIP{nextIdx + 1}
        </p>
        <p className="text-[12px] text-white/90">等級有效流水：0</p>
      </div>

      {/* Badge block — its own 1/4-width column within the same orange
          card, rather than overlapping the personal-info block. Silver tone
          since the account's actual tier (VIP1) is still low. */}
      <div className="flex w-1/4 flex-shrink-0 items-start justify-center pt-2">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-white/70 bg-gradient-to-br from-[#f2f2f2] to-[#a3a3a3] text-center text-[10px] font-bold leading-tight text-white shadow-lg">
          <span>
            VIP
            <br />
            {currentIdx + 1}
          </span>
        </div>
      </div>
    </div>
  );
}

function VipTab({ username }: { username: string }) {
  // pc.wu88.live's own 會員等級 page defaults its tier-preview stepper/card
  // row to VIP3, independent of the account's actual tier shown up in the
  // hero (VIP1 here) — confirmed by clicking through the real page while
  // logged in as this same demo account, so it's reproduced as-is (a real
  // quirk of the live site) rather than "corrected" to match progress.
  const [selectedIdx, setSelectedIdx] = useState(2);
  const currentIdx = 0;
  const selected = VIP_TIERS[selectedIdx];
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current[selectedIdx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedIdx]);

  return (
    <div className="flex flex-col gap-6">
      {/* Tier stepper — each column pairs its tier name (top) with its VIPn
          label (bottom) as a single unit, so they always line up together
          rather than being two independently-scrolling rows. Only the VIPn
          label changes color for the selected tier; the name pill above it
          stays the same neutral tone for every column, matching the real
          site. Clicking a column scrolls the gold card row below to that
          tier's card and updates the benefits panel further down. */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {VIP_TIERS.map((t, idx) => (
          <button
            key={t.tier}
            onClick={() => setSelectedIdx(idx)}
            className="flex w-[76px] flex-shrink-0 flex-col items-center gap-1"
          >
            <span className="flex w-full items-center justify-center gap-1 rounded-[3px] bg-[#fff6df] py-1.5 text-[13px] text-black/70">
              <span aria-hidden>{TIER_ICONS[t.name]}</span> {t.name}
            </span>
            <span
              className={`w-full rounded-[3px] py-1 text-center text-[12px] font-medium transition-colors ${
                idx === selectedIdx ? "bg-[#ff9800] text-white" : "bg-black/5 text-black/40"
              }`}
            >
              {t.tier}
            </span>
          </button>
        ))}
      </div>

      {/* Gold tier-preview cards — every card shows both stats (screenshot
          of VIP4 confirmed it also has 流水需求, just clipped off-screen at
          the row's edge; it isn't exclusive to the current tier's card).
          Clicking a tier above scrolls this row so the matching card comes
          into view, rather than just tinting it in place. */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {VIP_TIERS.map((t, idx) => (
          <div
            key={t.tier}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className={`relative flex h-[130px] w-[220px] flex-shrink-0 flex-col justify-end rounded-[8px] bg-gradient-to-br from-[#f7d774] to-[#c9962f] px-4 py-3 text-white ${
              idx === selectedIdx ? "ring-2 ring-[#eb5e1a] ring-offset-2" : ""
            }`}
          >
            {idx === currentIdx ? (
              <span className="absolute left-0 top-0 rounded-br-[8px] rounded-tl-[8px] bg-black/30 px-2 py-0.5 text-[11px]">
                當前等級
              </span>
            ) : null}
            <p className="text-[26px] font-extrabold italic">{t.tier}</p>
            <div className="mt-2 flex gap-8 text-[12px]">
              <span className="flex flex-col">
                <span>0</span>
                <span>累積儲值積分</span>
              </span>
              <span className="flex flex-col">
                <span>{t.bet}</span>
                <span>流水需求</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">
          {selected.tier} {selected.name}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "💳", value: "1次", label: "每日託售次數" },
            { icon: "💰", value: "1000000", label: "每日點數託售額度" },
            { icon: "🎁", value: selected.upgradeBonus, label: "升級獎金（晉級自動存入）" },
            { icon: "🎂", value: selected.birthdayBonus, label: "生日禮（聯絡客服發送）" },
          ].map((s) => (
            <div key={s.label} className="flex items-start gap-2 text-[13px]">
              <span>{s.icon}</span>
              <span>
                <span className="block font-semibold text-[#eb5e1a]">{s.value}</span>
                <span className="text-black/50">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">VIP 詳情</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-black/5 text-black/60">
                <th className="px-3 py-2 font-medium"> </th>
                {VIP_TIERS.map((t) => (
                  <th key={t.tier} className="px-3 py-2 font-medium">
                    {t.tier}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-black/70">
              {[
                { label: "累計有效投注", key: "bet" as const },
                { label: "保級有效投注", key: "keepBet" as const },
                { label: "晉升彩金", key: "upgradeBonus" as const },
                { label: "生日彩金", key: "birthdayBonus" as const },
                { label: "體育返水", key: "sportsRebate" as const },
                { label: "其他返水", key: "otherRebate" as const },
                { label: "VIP 專屬日儲值", key: "depositBonus" as const },
              ].map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-3 py-2 font-medium text-black/60">{row.label}</td>
                  {VIP_TIERS.map((t) => (
                    <td key={t.tier} className="px-3 py-2">
                      {t[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-[13px] text-black/70">
        您若已經達到最高等級VIP10，請直接與客服聯繫獲取專屬VVIP禮遇。
        <br />
        WU88娛樂城一定將會員的福利放在第一位，竭盡所能服務各位VIP會員。
      </p>

      <div>
        <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">晉升條件</p>
        <div className="flex flex-col gap-2 text-[13px] text-black/70">
          <p>累計儲值與累計流水同時達到目標等級的門檻後，系統會在隔日凌晨 0 點前自動完成升級，晉升彩金也會一併自動發放，不需另外申請。</p>
          <p>每次最多只能往上晉升一個等級，即使流水已經達到更高等級的門檻，也不能跳級一次升到該等級。</p>
          <p>用來判斷是否保級的有效投注，採 90 天為一個週期滾動計算；不論這期間是晉升還是維持原等級，週期結束都會歸零重新累計。</p>
          <p>只要在週期內同時達成保級流水與累計流水兩項門檻，帳號會在 24 小時內自動升級；若只達成保級流水、累計流水未達標，則維持在原本的等級，不會被降級。</p>
        </div>
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">生日彩金</p>
        <div className="flex flex-col gap-2 text-[13px] text-black/70">
          <p className="text-red-600">
            嚴禁利用本活動進行對沖下注、多人集體投注，或串通其他娛樂城同時下注等任何方式套利，一經查獲將直接取消活動資格。
          </p>
          <p>生日彩金每位會員一年僅能領取一次，需提供身份證明文件並透過線上客服 Line 提出申請。</p>
          <p>領到的生日彩金點數必須完成一倍有效流水，才能申請託售提領。</p>
          <p>
            申請僅限於會員生日當月提出，且需在提出申請前 30 天內（含申請當天）累積儲值滿新台幣 5,000
            元、並完成一倍流水；不接受跨月補申請，逾期未申請則視同放棄該次生日彩金。
          </p>
        </div>
      </div>
    </div>
  );
}

function InviteFriendsTab({ images }: { images: Record<string, string | null> }) {
  const bannerSrc = images["invite-friends-banner"];

  // The whole page is just the uploaded image, full width and full height —
  // no overlaid text, cards, or tables. The design lives entirely in the
  // image itself (uploaded via the "邀請好友 滿版banner圖" slot in
  // /image-manager).
  return bannerSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={bannerSrc} alt="邀請好友" className="block h-full w-full object-cover" />
  ) : (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-black/5 text-[12px] text-black/40">
      邀請好友 Banner（請至 /image-manager 上傳）
    </div>
  );
}

function BettingBonusTab() {
  const bars = [
    { need: 5888, have: 0, reward: 88 },
    { need: 68888, have: 0, reward: 188 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {bars.map((b) => (
          <div key={b.need} className="rounded-[4px] border border-black/10 bg-[#eef5fb] p-4">
            <div className="flex items-center justify-between text-[13px] text-black/60">
              <span>每日有效投注 {b.need}</span>
              <span>
                {b.have}/{b.need}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
              <div className="h-full rounded-full bg-[#1976d2]" style={{ width: `${Math.min(100, (b.have / b.need) * 100)}%` }} />
            </div>
            <button className="mt-3 w-full rounded-[3px] bg-[#f39800] py-1.5 text-[14px] font-medium text-white hover:brightness-105">
              領取{b.reward}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 text-[13px] text-black/70">
        <div>
          <p className="mb-1 font-medium text-black">活動內容</p>
          <ol className="list-decimal pl-5">
            <li>每天可申請一次簽到彩金，需當日申請，逾時不補發</li>
            <li>當日完成每日有效投注條件，即可進行申請</li>
            <li>活動贈送彩金只須滿足一倍流水即可提款</li>
          </ol>
        </div>
        <div>
          <p className="mb-1 font-medium text-black">注意事項</p>
          <p className="mb-1">若當天沒有在期限內完成領取，彩金不會被補發，必須等到隔天重新累積投注額度才能再次申請。</p>
          <ol className="list-decimal pl-5">
            <li>
              有效投注是依照各遊戲館結算派彩後才會產生，如果因為體育賽事派彩延遲，導致當天投注額度來不及達標或會員忘記手動申請，系統都不會事後補發簽到彩金。
            </li>
            <li>
              投注額度大約需要 15
              分鐘才會更新到系統，不是下注後立刻反映，所以請盡量在每天
              23:45
              前完成投注並申請領取；一旦到了
              00:00，就會視為新的一天重新累計投注，先前未達標的部分不能要求補發或合併計算。
            </li>
          </ol>
        </div>
        <div>
          <p className="mb-1 font-medium text-black">WU88規則與條款</p>
          <ol className="list-decimal pl-5">
            <li>
              優惠使用限制：不得將此優惠點數投入德州撲克、Black
              jack21點，賽車/飛艇類彩票單局下注不得超過7台；體育投注賠率則不得低於歐盤1.5倍或亞盤0.5盤口。若違反上述限制，平台有權取消或收回已發放的優惠點數。
            </li>
            <li>
              不得利用真人娛樂、電子遊藝、彩票等遊戲進行無風險對沖投注（例如同時買大小、單雙、紅黑，或在百家樂同時下莊家與閒家），對沖或對打的投注不列入有效投注計算，賽果為和局的注單也不予採計。經風控部門查核違規者，平台將回收優惠與贈點，情節嚴重者可能被凍結帳戶。
            </li>
            <li>
              同一玩家、同一住址、同一電子郵件、同一電話號碼、相同付款方式或相同 IP
              位址，僅能領取一次優惠；若查獲重複註冊或申請，平台保留取消優惠並扣回已領取點數的權利。
            </li>
            <li>
              所有優惠僅提供給真實玩家本人使用，若發現任何團體或個人以不實方式套取贈點、進行威脅或濫用優惠機制，平台有權凍結或關閉相關帳戶並沒收帳戶餘額。
            </li>
            <li>若對優惠資格有爭議，為保障雙方權益、防止冒用身份，平台有權要求會員提供充分有效的證明文件以核實資格。</li>
            <li>
              若會員以任何方式規避規則、刻意安排一連串下注來確保無論輸贏都能穩賺優惠點數，平台有權終止該會員（或團隊）的優惠資格，並追回已發放的全部點數。
            </li>
            <li>本活動最終解釋權歸 WU88 所有，平台可在不另行通知的情況下修改或終止本優惠。</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function BindUsdtTab() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [chain, setChain] = useState("TRC20");
  const [address, setAddress] = useState("");

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-[4px] bg-[#1976d2] py-3 text-[15px] font-medium text-white hover:brightness-105"
      >
        新增USDT
      </button>
    );
  }

  const canSubmit = name.trim() && address.trim().length === 34;

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <LabeledInput label="請輸入錢包名稱：" value={name} onChange={setName} />

      <div>
        <div className="text-[14px] font-medium text-black">請上傳錢包地址截圖：</div>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded border border-black/20 px-3 py-2 text-[14px] text-black/40">
          📎 選擇檔案
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-medium text-black">幣種：</span>
        <span className="rounded-full bg-[#f39800] px-3 py-1 text-[12px] font-bold text-white">USDT</span>
      </div>

      <div>
        <div className="text-[14px] font-medium text-black">鏈別：</div>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-[14px] text-black/80 outline-none"
        >
          <option>TRC20</option>
          <option>ERC20</option>
        </select>
      </div>

      <div>
        <div className="text-[14px] font-medium text-black">錢包地址：</div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded border border-black/20 px-3 py-2 text-[14px] text-black/80 outline-none"
        />
        <div className="mt-1 flex items-center justify-between text-[12px]">
          <span className="text-red-500">{address.length !== 34 ? "請輸入正確格式" : ""}</span>
          <span className="text-black/40">{address.length}/ 34</span>
        </div>
      </div>

      <div className="text-[13px] text-red-500">
        <p className="mb-1 font-medium">⚠️ 注意事項</p>
        <p>＊僅支援新增以上區塊鏈鏈別</p>
        <p>＊請新增本人開立之交易所虛擬錢包</p>
      </div>

      <button
        disabled={!canSubmit}
        className={`rounded-[3px] py-2.5 text-[14px] font-medium text-white ${
          canSubmit ? "bg-[#1976d2] hover:brightness-105" : "bg-black/20"
        }`}
      >
        立即申請
      </button>
      <p className="text-center text-[12px] text-black/40">
        如需幫助，請<span className="text-[#1976d2]">聯繫客服</span>
      </p>
    </div>
  );
}

// File-picker field styled to match pc.wu88.live's real 新增銀行卡 form:
// a plain bordered box whose placeholder text (e.g. "身分證正面") IS the
// label — no separate caption above it, no upload icon.
function FileField({ label, fileName, onPick }: { label: string; fileName: string | null; onPick: (name: string) => void }) {
  return (
    <label className="flex w-full cursor-pointer items-center rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/40">
      <span className={fileName ? "text-black/80" : ""}>{fileName || label}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

function BindBankCardTab() {
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
      <div className="mx-auto flex max-w-[400px] flex-col items-center gap-4">
        <p className="text-[16px] font-medium text-black">銀行卡</p>
        <div className="relative flex h-[140px] w-full flex-col justify-between rounded-[10px] bg-gradient-to-br from-[#2b2b2b] to-[#0d0d0d] p-4 text-white shadow-lg">
          <span className="text-[18px] font-extrabold tracking-wide">BANK</span>
          <span className="text-[22px]">💳</span>
          <span className="text-[14px] font-medium tracking-wide">004 臺灣銀行 1405******9300</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-[4px] bg-[#eb5e1a] py-2.5 text-[15px] font-medium text-white hover:brightness-105"
        >
          新增銀行卡
        </button>
      </div>
    );
  }

  // Real site's 新增銀行卡 flow (screenshot/DOM-confirmed): 銀行名稱 select,
  // 分行名稱 + 銀行帳號 + 確認銀行帳號 text fields, then three file uploads
  // (身分證正面／身分證反面／存摺正面), then a blue 新增確認 submit button —
  // not a single button that does nothing, as it was before.
  return (
    <div className="mx-auto flex max-w-[400px] flex-col gap-4">
      <p className="text-center text-[16px] font-medium text-black">銀行卡</p>

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

      <input
        value={branchName}
        onChange={(e) => setBranchName(e.target.value)}
        placeholder="分行名稱"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <input
        value={accountNo}
        onChange={(e) => setAccountNo(e.target.value)}
        placeholder="銀行帳號"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <input
        value={confirmAccountNo}
        onChange={(e) => setConfirmAccountNo(e.target.value)}
        placeholder="確認銀行帳號"
        className="w-full rounded-[4px] border border-black/15 bg-black/[0.03] px-3 py-3 text-[14px] text-black/85 placeholder-black/40 outline-none"
      />

      <FileField label="身分證正面" fileName={idFront} onPick={setIdFront} />
      <FileField label="身分證反面" fileName={idBack} onPick={setIdBack} />
      <FileField label="存摺正面" fileName={passbookFront} onPick={setPassbookFront} />

      <button className="w-full rounded-[4px] bg-[#1976d2] py-2.5 text-[15px] font-medium text-white hover:brightness-105">
        新增確認
      </button>
    </div>
  );
}

// ---------- Main modal ----------

export default function MemberCentreModal({ open, onClose, username, images, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState("會員資料");
  const logoSrc = images["membercentre-logo"];

  useEffect(() => {
    if (open && initialTab) setActiveTab(initialTab);
    // Only re-jump when the modal transitions to open, not on every
    // initialTab change while it's already open (that would fight the
    // user's own in-modal tab clicks).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // Full-page overlay — matches how pc.wu88.live's real /memberCentre
  // actually renders (a dedicated full-viewport route, not a centered
  // dialog card): the orange tab header spans the full width, and the
  // content area below it scrolls independently and fills the rest of the
  // screen, rather than being capped to a floating 1000px card.
  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#f2f2f2]">
      <div className="flex flex-wrap items-center gap-1 bg-gradient-to-b from-brand-from to-brand-to px-4 py-2">
        {/* White rounded block wrapping the logo + "會員中心" label,
            both centered inside it — matches pc.wu88.live's real
            /memberCentre header treatment (screenshot-confirmed), rather
            than the plain white-text logo used in the site's main TopBar. */}
        <div className="mr-3 flex h-[52px] w-[150px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-[10px] bg-white px-2 py-1">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="Logo" className="h-7 w-auto max-w-[130px] object-contain" />
          ) : (
            <span className="text-lg font-extrabold leading-none text-[#eb5e1a]">WU88</span>
          )}
          <span className="text-[11px] font-medium leading-none text-[#eb5e1a]">會員中心</span>
        </div>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-[4px] px-3 py-2 text-[14px] transition-colors ${
              activeTab === tab ? "bg-white font-medium text-[#eb5e1a]" : "text-white hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={onClose}
          aria-label="關閉"
          className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15"
        >
          ✕
        </button>
      </div>

      {activeTab === "邀請好友" ? (
        // Full-bleed: no padding, no max-width cap, fills 100% of the
        // remaining pane both directions — this tab is just the uploaded
        // image with nothing else on the page.
        <div className="flex-1 overflow-hidden">
          <InviteFriendsTab images={images} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10">
          {activeTab === "會員等級" ? <VipHero username={username} /> : null}
          <div className="mx-auto w-full max-w-[1000px]">
            {activeTab === "會員資料" ? <MemberProfileTab username={username} /> : null}
            {activeTab === "託售" ? <ConsignTab /> : null}
            {activeTab === "儲值" ? <DepositTab /> : null}
            {activeTab === "平台轉點" ? <TransferTab /> : null}
            {activeTab === "帳務" ? (
              <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期", "金額"]} showStatusToggle typeOptions={["選擇類型", "儲值", "託售"]} />
            ) : null}
            {activeTab === "安全中心" ? <SecurityTab username={username} /> : null}
            {activeTab === "帳戶明細" ? (
              <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期"]} typeOptions={["儲值", "託售", "轉點"]} />
            ) : null}
            {activeTab === "投注紀錄" ? (
              <RecordsTable columns={["訂單編號", "平台", "狀態", "遊戲名稱", "獲利金額", "日期"]} typeOptions={["全部", "電子", "體育", "真人"]} />
            ) : null}
            {activeTab === "會員等級" ? <VipTab username={username} /> : null}
            {activeTab === "投注彩金" ? <BettingBonusTab /> : null}
            {activeTab === "綁定帳戶(USDT)" ? <BindUsdtTab /> : null}
            {activeTab === "綁定帳戶(銀行卡)" ? <BindBankCardTab /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
