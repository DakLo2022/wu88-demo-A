"use client";

import { useEffect, useState } from "react";

// This demo has no real backend/session. Login state used to live purely as
// component-local `useState`, reset by `?loggedIn=1` from MobileAuthCard's
// fake login/register — which only worked on the home page itself, since
// MobileHeader was the only component reading that query param. Every other
// page (MobileTradeScreen, MobileBottomNav, etc.) had no way to know the
// visitor was "logged in", which is why 帳務/存提/我的 never gated access
// the way the real site does. Persisting the flag to localStorage instead
// lets every page share the same state without a real backend — each page
// in this project is its own route (not a shared client-side layout), so a
// plain `useState` initialized from localStorage on mount is enough; no
// cross-tab/live-sync listener needed since a login always happens via a
// full navigation (router.push) that remounts the next page anyway.
const STORAGE_KEY = "wu88DemoLoggedIn";

export function useLoggedIn(): [boolean, (value: boolean) => void] {
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    setLoggedInState(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function setLoggedIn(value: boolean) {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    setLoggedInState(value);
  }

  return [loggedIn, setLoggedIn];
}
