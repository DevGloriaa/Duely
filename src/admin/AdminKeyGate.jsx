import { useState } from "react";
import { clearAdminKey, getSummary, setAdminKey } from "../api.js";
import TextField from "../components/TextField.jsx";

export default function AdminKeyGate({ onUnlock }) {
  const [key, setKey] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!key.trim()) {
      setError("Enter the admin key.");
      return;
    }

    setChecking(true);
    setError("");
    setAdminKey(key.trim());
    try {
      await getSummary();
      onUnlock();
    } catch (err) {
      clearAdminKey();
      setError(err.message);
      setChecking(false);
    }
  }

  return (
    <div className="page">
      <h1>Admin</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Admin key"
          hint="Kept only for this browser tab."
          type="password"
          value={key}
          onChange={(value) => {
            setKey(value);
            setError("");
          }}
          error={error}
          autoComplete="off"
        />
        <button type="submit" className="button button-primary button-submit" disabled={checking}>
          {checking ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
