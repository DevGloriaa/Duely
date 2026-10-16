import { useState } from "react";
import { exportVerified } from "../api.js";
import { saveBlob } from "../download.js";

export default function ExportButton() {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const { blob, filename } = await exportVerified();
      saveBlob(blob, filename || "verified-students.csv");
    } catch (err) {
      window.alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="button button-secondary button-compact" onClick={handleClick} disabled={busy}>
      {busy ? "Exporting…" : "Export verified list"}
    </button>
  );
}
