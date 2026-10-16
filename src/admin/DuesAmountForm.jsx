import { useEffect, useId, useState } from "react";
import { getDuesAmount, setDuesAmount } from "../api.js";
import { formatMoney } from "../format.js";
import Alert from "../components/Alert.jsx";

export default function DuesAmountForm() {
  const id = useId();
  const [current, setCurrent] = useState(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDuesAmount()
      .then((value) => {
        setCurrent(value);
        setAmount(String(value));
      })
      .catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);
    if (!(Number(amount) > 0)) {
      setError("The dues amount must be greater than zero.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      setCurrent(await setDuesAmount(Number(amount)));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="settings-section" onSubmit={handleSubmit} noValidate>
      <h2>Dues amount</h2>
      <div className="field">
        <label htmlFor={id} className="label">
          Amount in naira
        </label>
        <div className="inline-form">
          <input
            id={id}
            className="input"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSaved(false);
              setError("");
            }}
            aria-invalid={error ? true : undefined}
          />
          <button type="submit" className="button button-secondary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
        {current != null && <p className="hint">Currently {formatMoney(current)}</p>}
      </div>
      <Alert>{error}</Alert>
      {saved && <Alert tone="success">Dues amount saved.</Alert>}
    </form>
  );
}
