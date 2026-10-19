import { useEffect, useState } from "react";
import { KEY_REJECTED_EVENT, clearAdminKey, getAdminKey } from "../api.js";
import AdminKeyGate from "../admin/AdminKeyGate.jsx";
import AdminDashboard from "../admin/AdminDashboard.jsx";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(Boolean(getAdminKey()));

  useEffect(() => {
    const lock = () => setUnlocked(false);
    window.addEventListener(KEY_REJECTED_EVENT, lock);
    return () => window.removeEventListener(KEY_REJECTED_EVENT, lock);
  }, []);

  function signOut() {
    clearAdminKey();
    setUnlocked(false);
  }

  if (!unlocked) return <AdminKeyGate onUnlock={() => setUnlocked(true)} />;
  return <AdminDashboard onSignOut={signOut} />;
}
