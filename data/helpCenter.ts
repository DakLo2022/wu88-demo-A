// Content for the 協助中心 (Help Center) popup. The FAQ list is reproduced
// verbatim from pc.wu88.live — short functional Q&A copy, consistent with
// how the rest of this demo handles UI/marketing text. The 關於我們 legal
// pages (規則與條款 / 隱私權政策) are long-form legal text on the real site,
// so they're paraphrased/condensed here rather than reproduced at length,
// per this project's standing copyright policy.

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "允許我在WU88遊戲嗎？",
    a: "您必須已經年滿18歲或所在當地多數的法定年齡，以最大年齡為準，並且已經閱讀並同意WU88規則與條款。",
  },
  {
    q: "如果我要玩體育博彩以外的其他遊戲，還需要註冊新的帳號嗎？",
    a: "不需要，一旦閣下註冊並完成會員資料，可以在網站提供的所有產品中遊戲。",
  },
  {
    q: "在WU88儲值與託售，我的註冊姓名是否需要與身分證上面的姓名一致？",
    a: "您在WU88註冊帳戶，必須使用真實合法的姓名和身份，且您在WU88的投注帳戶用於接收資金的銀行帳戶必須保持一致。",
  },
  {
    q: "我每天可以提交多少筆儲值交易？",
    a: "平台沒有對儲值交易進行次數限制，託售次數是根據您所在的vip等級而定。但為了您銀行卡的安全考慮，建議您盡量選擇少筆大額的儲值避免多筆小額的情況。",
  },
  {
    q: "如果我不投注可以託售嗎？",
    a: "您所有的儲值須進行全額投注後（即滿足儲值）方可託售帳戶的所有餘額。如有參與優惠活動，投注額要求請遵循特定的優惠規則與條款。",
  },
  {
    q: "每天最高託售金額是多少？",
    a: "每日最高託售額度由會員所在VIP等級決定。詳情請見VIP等級規則。",
  },
  {
    q: "為什麼託售狀態顯示「成功」而我的銀行卡卻沒有收到錢？",
    a: "託售狀態顯示「成功」表示我們已經出款，有時銀行延遲會導致您不能馬上收到款項。如果已經超過24個小時，請及時聯絡線上客服。",
  },
  {
    q: "什麼是「未完成流水」？",
    a: "「未完成流水」是您仍需要下注的金額，以達到託售的要求。",
  },
  {
    q: "支援存取WU88服務網站的瀏覽器是什麼？",
    a: "我們的網站是最佳的兼容瀏覽器，提供廣泛的網頁瀏覽器支援；更重要的是4大最受歡迎的瀏覽器：IE瀏覽器，火狐，蘋果的Safari和谷歌瀏覽器。然而一些舊的瀏覽器可能不支援新的網頁標準，因此您有可能會在我們網站上遇到一些問題，如果使用這些瀏覽器的舊版本，我們建議您升級到最新版本，因為可能不僅有體驗瀏覽限制，也有可能會容易受到安全威脅。",
  },
  {
    q: "什麼是滾球？",
    a: "滾球是指投注正在進行中的相關賽事。當賽事正在進行時，滾球投注將被接受；而當賽事結束或賽事盤口不在投注頁面顯示時，投注將會停止。",
  },
  {
    q: "我如何確認賽事是否將會開出滾球盤口？",
    a: "並非每場賽事都會提供滾球投注。若查看滾球投注盤口，請至【滾球】中查看賽事清單。",
  },
  {
    q: "「未確認」顯示在投注單是什麼意思？",
    a: "所有投注都須遵守系統程序，在系統完成確認或拒絕前會呈現“未確認”狀態，請您投注後及時檢查注單狀態，只有顯示【已確認】的注單才代表投注成功。",
  },
  {
    q: "盤口及滾球賽事相關資訊一直都是正確的嗎？",
    a: "我們力求提供正確數據，但是賽事相關信息（例如，日期，時間，比分，數據，新聞，紅卡，中立場信息，等）僅供一般參考之用。本公司對所提供資訊的準確性概不負責。",
  },
  {
    q: "如果您在投注中失去網路連線時，請注單將如何處理？",
    a: "如果您已經投注成功，即使您失去網絡連接，投注依然有效。當您可以重新登入時，可以進入投注記錄中查看您的注單。如果您的投注不成功，然後失去網路連接，您的餘額並不會被扣除。您只需要在可以連接網路時重新登入繼續投注即可。若您不確定投注是否成功，您可以在投注記錄中查看投注狀態。",
  },
  {
    q: "如何更改和取消已確認的注單？",
    a: "閣下有責任確保投注的正確性，一旦您的投注經由我們確認並接受，注單將不能取消，撤消及更改；您的投注被認為確認無誤。所有WU88輸入的投注記錄將存入WU88交易資料庫，並作為任何時間任何交易的有效依據。",
  },
  {
    q: "如果一場賽事中斷或取消，注單是否會取消？",
    a: "如果比賽或賽事取消，中斷或延遲並且沒有在官方指定開球時間的36小時內重新開始，所有該場賽事的投注即被視為無效且取消，除非在個別體育規則裡另有指定註明。一些無條件決定的賽事將會根據這些賽事所註明的各自的體育規則進行結算。本公司取消該賽事所有注單的結果被視為最終決定，無需參考官方賽事裁判或相關部門的決定。連串投注將會繼續依照注單剩餘賽事的賽果結算。",
  },
  {
    q: "為什麼會出現重新派彩的情況？",
    a: "WU88最初公佈的比分或結果需要修正時，將會出現賽果變更。出於結算的目的，賽事的結果將會在當天確定，除非在個別的體育或賽事規則有說明。賽果均在賽事結束後判定，除非在個別運動規則裡另有註明。賽果公佈72小時後，若對任何賽果有爭議，本公司將不認可。在賽果公佈72小時內,除了任何體育紀律委員會所重新裁決之賽果，本公司只會修正人為、系統或參考賽果的相關網頁失誤等原因的錯誤。",
  },
  {
    q: "WU88哪個管道取得賽事結果？",
    a: "我們確保現場的結果或訊息是來自官方體育權威機構，且都會以官方結果為準。",
  },
  {
    q: "如何提前結算？",
    a: "目前我們暫不支援此功能，上半場注單將會在上半場完成後進行結算，全場注單在賽事結束後的第一時間我們會進行結算。",
  },
  {
    q: "為什麼下注後的賠率跟我看到的不一樣？",
    a: "賠率都是即時接收官方的數據，每個階段賠率都有可能發生變動，尤其是在滾球盤的投注中。我們盡可能的在您投注時遇到變動的情況已彈出窗口的形式告知您，但您點擊：更新並投注的時候，代表您已知曉並接受該賠率。但若遇特殊情況，系統可能會以最新的賠率為您處理注單，我們必須保證您投注時的賠率都是以當下最新的賠率進行下注。",
  },
];

export type AboutDoc = { title: string; paragraphs: string[] };

export const RULES_AND_TERMS: AboutDoc = {
  title: "規則與條款",
  paragraphs: [
    "本頁說明會員存取與使用WU88網站服務所應遵循的權利義務。請在接受本站服務前詳細閱讀本協議；一旦完成註冊或使用本站服務，即代表您已閱讀並同意本協議（以下稱「網站」或「本站」）的所有規則與條款，以及站內不時公告或更新的優惠規則與其他相關政策。",
    "若違反本協議或站內其他規則條款，本站有權視情節輕重，對會員帳戶採取包括但不限於資格取消、帳戶關閉、資金沒收在內的處置，並保留追究相關法律責任的權利。",
    "會員同意在使用本站服務時遵守法紀、不侵犯他人權利，不從事騷擾、傳播猥褻/帶攻擊性言論、干擾站內正常溝通秩序或對他人造成不良影響的行為。",
    "本站將不定期更新規則與條款，會員應自行留意頁面更新；若您不同意更新後的內容，應停止使用本站服務。",
  ],
};

export const PRIVACY_POLICY: AboutDoc = {
  title: "隱私權政策",
  paragraphs: [
    "本站重視會員的個人資料保護，僅於會員註冊、身分驗證、儲值/託售、客服聯繫及法規遵循等必要目的範圍內，蒐集、處理及利用會員提供的個人資料。",
    "會員的個人資料將被妥善保存，本站採取合理的技術與管理措施防止資料遭未經授權的存取、洩漏、竄改或毀損；除法律要求或會員同意外，本站不會將會員個人資料提供予無關第三方。",
    "會員有權就其個人資料行使查詢、更正、補充或請求停止處理等權利；如需行使前述權利，請透過線上客服聯繫本站。",
    "本站可能因法規或營運需要不定期修訂本隱私權政策，修訂後將公告於本頁，請會員自行留意最新版本。",
  ],
};

export type TutorialFlow = {
  flow: string;
  count: number;
  /** "dots" = numbered page buttons (1 2 3 4 5); "counter" = "X / Y" with prev/next arrows, matching the real site's two different pagination styles. */
  pagination: "dots" | "counter";
};

// 超商搜尋流程 splits into two independent screenshot sequences depending on
// which convenience-store chain is selected via the 7-11查詢/全家查詢
// buttons below the tutorial image on the real site.
export const STORE_SEARCH_711_FLOW: TutorialFlow = { flow: "storesearch-711", count: 5, pagination: "dots" };
export const STORE_SEARCH_FAMILY_FLOW: TutorialFlow = { flow: "storesearch-family", count: 7, pagination: "dots" };
export const USDT_DEPOSIT_FLOW: TutorialFlow = { flow: "usdt", count: 6, pagination: "dots" };
export const ALIPAY_REGISTER_FLOW: TutorialFlow = { flow: "alipay-register", count: 13, pagination: "counter" };
export const ALIPAY_DEPOSIT_FLOW: TutorialFlow = { flow: "alipay-deposit", count: 2, pagination: "counter" };
// 雲支付綁定流程 — confirmed live at wu88.live's /taiwan_pay_illustrate: a
// 15-step phone-screenshot tutorial using the "X / Y" counter pagination
// style (same as the Alipay flows above).
export const TAIWAN_PAY_FLOW: TutorialFlow = { flow: "taiwan-pay", count: 15, pagination: "counter" };
