"use client";

import { useRouter } from "next/navigation";

type Props = { onClose: () => void };

// Reproduces wu88.live's real "請先登入" alert — confirmed live it's a
// SweetAlert2 popup (`.swal2-popup`), not a custom component: 200px wide
// white card (5px radius), an orange #eb5e1a title bar ("提醒您", white
// 20px/700), body text "請先登入" (#333, 18px/700), and a white "關閉"
// button (1px solid black border, 5px radius, 64×24) on a rgba(0,0,0,.4)
// backdrop. Confirmed live that tapping 關閉 does two things at once: closes
// the alert AND navigates to /user-login — reproduced here the same way,
// closing the modal and pushing to /login together.
export default function LoginRequiredModal({ onClose }: Props) {
  const router = useRouter();

  function handleClose() {
    onClose();
    router.push("/login");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-[200px] overflow-hidden rounded-[5px] bg-white pb-[15px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="bg-[#eb5e1a] py-[3px] text-[20px] font-bold text-white">提醒您</h2>
        <p className="mt-5 text-[18px] font-bold text-[#333]">請先登入</p>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="h-6 rounded-[5px] border border-black bg-white px-[15px] text-[16px] font-medium text-[#333]"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
