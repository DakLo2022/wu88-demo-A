"use client";

import { useEffect, useState } from "react";
import { navCategories } from "@/data/nav";

type Props = {
  open: boolean;
  onClose: () => void;
  username: string;
  images: Record<string, string | null>;
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
    <div className="rounded-[5px] bg-[#2b2b2b] p-4 text-white">
      <div className="mb-2 text-center text-[15px]">
        <span className="text-white/70">$</span> <span className="font-semibold">299</span>{" "}
        <span className="text-white/50">倒數 {countdown} 秒</span>
      </div>
      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2">
            {row.map((name) => (
              <div key={name} className="flex items-center justify-between gap-2 border-b border-white/10 py-1.5 text-[13px]">
                <span className="truncate text-white/90">{name}錢包</span>
                <span className="w-6 flex-shrink-0 text-right text-yellow-400">{name === "雷火" ? 1 : 0}</span>
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
    <div className="rounded-[4px] border border-black/10 bg-[#fdf6ec]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
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
          {showStatusToggle ? <span className="text-[13px] text-[#eb5e1a]">{countdown} s</span> : null}
        </div>
      </div>
      <table className="w-full border-t border-black/10 text-left text-[13px]">
        <thead>
          <tr className="text-black/60">
            {columns.map((c) => (
              <th key={c} className="px-4 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-4 py-6 text-black/40">
              ⚠️ 沒有資料
            </td>
          </tr>
        </tbody>
      </table>
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
    <div className="mx-auto flex max-w-[500px] flex-col gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

      <div className="rounded-[4px] border border-black/10 p-4">
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

      <div className="rounded-[4px] border border-black/10 p-4">
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
      </div>
    </div>
  );
}

function DepositTab() {
  const [method, setMethod] = useState<"USDT" | "銀行轉點">("USDT");
  const [amount, setAmount] = useState("");
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
            method === m ? "bg-[#1565c0]" : "bg-[#1976d2]"
          } hover:brightness-110`}
        >
          {m === "銀行轉點" ? "銀行轉點(第三方金流)" : m}
        </button>
      ))}

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="儲值金額"
        className="w-full border-b border-dashed border-black/30 bg-transparent px-1 py-3 text-[15px] text-black/85 placeholder-black/40 outline-none"
      />

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
    <div className="mx-auto flex max-w-[500px] flex-col gap-6">
      <WalletTransferGrid actionLabel="一鍵轉入" recoverLabel="一鍵回收" />

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
  );
}

function SecurityTab() {
  const [sub, setSub] = useState<"登入" | "託售" | "重設">("登入");
  const subTabs = [
    { key: "登入" as const, icon: "🔑", label: "修改登入密碼", color: "text-purple-600 border-purple-600" },
    { key: "託售" as const, icon: "🔒", label: "修改託售密碼", color: "text-[#eb5e1a] border-[#eb5e1a]" },
    { key: "重設" as const, icon: "🔄", label: "重設託售密碼", color: "text-teal-600 border-teal-600" },
  ];

  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-4">
      <div className="flex justify-around border-b border-black/10">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSub(t.key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-[14px] ${
              sub === t.key ? t.color : "border-transparent text-black/50"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <input type="password" placeholder="原始密碼" className="rounded border border-black/20 px-3 py-2 text-[14px] outline-none placeholder-black/40" />
        <input type="password" placeholder="新密碼" className="rounded border border-black/20 px-3 py-2 text-[14px] outline-none placeholder-black/40" />
        <input type="password" placeholder="確認新密碼" className="rounded border border-black/20 px-3 py-2 text-[14px] outline-none placeholder-black/40" />
        <div className="flex justify-center pt-1">
          <button className="rounded-[3px] bg-[#f39800] px-8 py-2 text-[14px] font-medium text-white hover:brightness-105">
            修改
          </button>
        </div>
      </div>
    </div>
  );
}

function VipTab({ username }: { username: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[8px] bg-gradient-to-r from-[#f5820c] to-[#ffb04c] px-6 py-4 text-white">
        <div className="flex items-center gap-2 text-[16px] font-medium">
          {username || "會員001"} <span className="rounded bg-black/20 px-2 py-0.5 text-[12px]">vip1 銅</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[13px]">
          <span className="rounded-full bg-black/30 px-2 py-1">銅</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/20">
            <div className="h-full w-[10%] rounded-full bg-white" />
          </div>
          <span className="rounded-full bg-black/20 px-2 py-1">銀</span>
        </div>
        <p className="mt-2 text-[12px]">ⓘ 所需流水：60000，晉級至 VIP2</p>
        <p className="text-[12px]">等級有效流水：0</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-black/10 pb-1 text-[13px]">
        {VIP_TIERS.map((t, idx) => (
          <div
            key={t.tier}
            className={`flex-shrink-0 rounded-t-[4px] px-3 py-2 text-center ${
              idx === 0 ? "bg-[#f39800] font-medium text-white" : "bg-black/5 text-black/50"
            }`}
          >
            <div>{t.name}</div>
            <div className="text-[11px]">{t.tier}</div>
          </div>
        ))}
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {VIP_TIERS.slice(0, 4).map((t, idx) => (
          <div
            key={t.tier}
            className="relative flex h-[130px] w-[220px] flex-shrink-0 flex-col justify-end rounded-[8px] bg-gradient-to-br from-[#f7d774] to-[#c9962f] px-4 py-3 text-white"
          >
            {idx === 0 ? (
              <span className="absolute left-0 top-0 rounded-br-[8px] rounded-tl-[8px] bg-black/30 px-2 py-0.5 text-[11px]">
                當前等級
              </span>
            ) : null}
            <p className="text-[26px] font-extrabold italic">{t.tier}</p>
            <div className="mt-2 flex gap-4 text-[12px]">
              <span>0 累積儲值積分</span>
              {idx === 0 ? <span>0 流水需求</span> : null}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-3 border-l-4 border-[#eb5e1a] pl-2 text-[16px] font-medium text-black">VIP1 銅</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "💳", value: "1次", label: "每日託售次數" },
            { icon: "💰", value: "1000000", label: "每日點數託售額度" },
            { icon: "🎁", value: "0", label: "升級獎金（晉級自動存入）" },
            { icon: "🎂", value: "88", label: "生日禮（聯絡客服發送）" },
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

      <div className="rounded-[4px] bg-black/5 p-4 text-[13px] text-black/70">
        <p className="mb-2 font-medium text-black">晉升條件（摘要）</p>
        <p>達成對應等級的累計儲值與流水門檻後，系統會於隔日自動晉級；保級流水以 90 天為週期重新計算，逾期未達標將維持原等級。</p>
        <p className="mt-2 font-medium text-black">生日彩金（摘要）</p>
        <p>每位會員一年限領一次，需於生日當月申請並提供身份證明，領取後彩金需滿一倍流水才可提領。</p>
      </div>
    </div>
  );
}

function InviteFriendsTab({ username }: { username: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const referralCode = (username || "WU88").toUpperCase().slice(0, 8);

  const copy = async (text: string, which: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard permission denied — no-op for this demo
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-[#fde6cf] via-[#fef3e6] to-[#fde6cf] px-6 py-8 text-center">
        <p className="text-[22px] font-extrabold text-[#eb5e1a]">好友邀請領取獎勵</p>
        <p className="mt-1 text-[15px] text-black/70">每邀請到一位好友註冊，推薦人最高可領 688 彩禮</p>
        <p className="mt-2 text-[40px] font-black text-[#f39800]">688</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[6px] border border-black/10 p-4 text-center">
          <div className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded bg-black/5 text-[12px] text-black/40">
            QR CODE
          </div>
          <p className="mt-2 text-[14px] font-medium text-black">領取專屬推薦碼</p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={() => copy(referralCode, "code")}
              className="rounded-[4px] bg-[#f39800] py-1.5 text-[13px] text-white hover:brightness-105"
            >
              {copied === "code" ? "已複製！" : "複製 QR CODE"}
            </button>
            <button
              onClick={() => copy(`https://wu88-demo.example/?ref=${referralCode}`, "link")}
              className="rounded-[4px] bg-[#f39800] py-1.5 text-[13px] text-white hover:brightness-105"
            >
              {copied === "link" ? "已複製！" : "複製專屬連結"}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-[6px] border border-black/10 p-4">
          <div className="flex items-center justify-between text-[14px]">
            <span>待領取首儲彩禮：0</span>
            <button className="rounded-[3px] bg-black/10 px-3 py-1 text-[13px] text-black/50">領取</button>
          </div>
          <p className="text-[12px] text-black/40">已領免費彩禮：0</p>
          <div className="flex items-center justify-between text-[14px]">
            <span>待領取流水分成：0</span>
            <button className="rounded-[3px] bg-black/10 px-3 py-1 text-[13px] text-black/50">領取</button>
          </div>
          <p className="text-[12px] text-black/40">已領取流水：0</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[6px] border border-black/10">
        <table className="w-full min-w-[600px] text-left text-[13px]">
          <thead className="bg-black/5 text-black/60">
            <tr>
              {["參與條件", "邀請好友贈點", "領取時效", "投入倍數", "介紹人"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-black/70">
              <td className="px-3 py-3">好友註冊並完成身分證，銀行帳戶綁定單筆儲值達 2000</td>
              <td className="px-3 py-3">688</td>
              <td className="px-3 py-3">
                完成註冊綁定單筆儲值滿 2000
                <br />
                <span className="text-red-500">十天內領取</span>
              </td>
              <td className="px-3 py-3">3 倍</td>
              <td className="px-3 py-3">轉入點數量 ≥5000 點數並轉入點數量超過三筆</td>
            </tr>
          </tbody>
        </table>
      </div>
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
          <p className="mb-1 font-medium text-black">注意事項（摘要）</p>
          <p>體育賽事因結算延遲可能導致當日未即時符合簽到需求；系統約每 15 分鐘更新一次有效投注，請於每日 23:45 前完成領取，逾期不予補發。</p>
        </div>
        <div>
          <p className="mb-1 font-medium text-black">規則與條款（摘要）</p>
          <p>
            百家樂、廿一點、Black jack 等指定遊戲及低賠率體育投注不計入有效投注；對沖、對賭或無風險投入不列入贈點資格，違規將由風控部門審核並保留取消優惠的權利。
          </p>
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

function BindBankCardTab() {
  return (
    <div className="mx-auto flex max-w-[400px] flex-col items-center gap-4">
      <p className="text-[16px] font-medium text-black">銀行卡</p>
      <div className="relative flex h-[140px] w-full flex-col justify-between rounded-[10px] bg-gradient-to-br from-[#2b2b2b] to-[#0d0d0d] p-4 text-white shadow-lg">
        <span className="text-[18px] font-extrabold tracking-wide">BANK</span>
        <span className="text-[22px]">💳</span>
        <span className="text-[14px] font-medium tracking-wide">004 臺灣銀行 1405******9300</span>
      </div>
      <button className="w-full rounded-[4px] bg-[#eb5e1a] py-2.5 text-[15px] font-medium text-white hover:brightness-105">
        新增銀行卡
      </button>
    </div>
  );
}

// ---------- Main modal ----------

export default function MemberCentreModal({ open, onClose, username, images }: Props) {
  const [activeTab, setActiveTab] = useState("會員資料");
  const logoSrc = images["logo"];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/60 py-10">
      <div className="w-full max-w-[1000px] rounded-[6px] bg-white shadow-xl">
        <div className="flex flex-wrap items-center gap-1 rounded-t-[6px] bg-gradient-to-b from-brand-from to-brand-to px-4 py-2">
          <div className="mr-3 flex items-center gap-2 text-white">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="Logo" className="h-7 w-auto max-w-[100px] object-contain" />
            ) : (
              <span className="text-lg font-extrabold leading-none">WU88</span>
            )}
            <span className="text-[11px] leading-none">會員中心</span>
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

        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-10">
          {activeTab === "會員資料" ? <MemberProfileTab username={username} /> : null}
          {activeTab === "託售" ? <ConsignTab /> : null}
          {activeTab === "儲值" ? <DepositTab /> : null}
          {activeTab === "平台轉點" ? <TransferTab /> : null}
          {activeTab === "帳務" ? (
            <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期", "金額"]} showStatusToggle typeOptions={["選擇類型", "儲值", "託售"]} />
          ) : null}
          {activeTab === "安全中心" ? <SecurityTab /> : null}
          {activeTab === "帳戶明細" ? (
            <RecordsTable columns={["訂單編號", "類型", "狀態", "金額", "日期"]} typeOptions={["儲值", "託售", "轉點"]} />
          ) : null}
          {activeTab === "投注紀錄" ? (
            <RecordsTable columns={["訂單編號", "平台", "狀態", "遊戲名稱", "獲利金額", "日期"]} typeOptions={["全部", "電子", "體育", "真人"]} />
          ) : null}
          {activeTab === "會員等級" ? <VipTab username={username} /> : null}
          {activeTab === "邀請好友" ? <InviteFriendsTab username={username} /> : null}
          {activeTab === "投注彩金" ? <BettingBonusTab /> : null}
          {activeTab === "綁定帳戶(USDT)" ? <BindUsdtTab /> : null}
          {activeTab === "綁定帳戶(銀行卡)" ? <BindBankCardTab /> : null}
        </div>
      </div>
    </div>
  );
}
