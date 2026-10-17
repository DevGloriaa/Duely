import { useId, useState } from "react";
import { uploadStatement } from "../api.js";
import Alert from "../components/Alert.jsx";

const RESULT_ITEMS = [
  { key: "imported", label: "Imported" },
  { key: "skipped", label: "Already imported" },
  { key: "newlyVerified", label: "Verified automatically" },
  { key: "flagged", label: "Flagged" },
];

function ImportResult({ result }) {
  return (
    <div className="field" role="status">
      <Alert tone="success">Statement imported.</Alert>
      <dl className="mini-tally">
        {RESULT_ITEMS.map(({ key, label }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{result[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function StatementUpload({ onImported }) {
  const id = useId();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setUploading(true);
    setError("");
    setResult(null);
    try {
      setResult(await uploadStatement(file));
      form.reset();
      setFile(null);
      onImported();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="settings-section" onSubmit={handleSubmit}>
      <h2>Bank statement</h2>
      <div className="field">
        <label htmlFor={id} className="label">
          Statement CSV
        </label>
        <div className="inline-form">
          <input
            id={id}
            className="input"
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <button type="submit" className="button button-secondary" disabled={uploading || !file}>
            {uploading ? "Importing…" : "Import"}
          </button>
        </div>
        <p className="hint">Payments already imported are skipped.</p>
      </div>
      <Alert>{error}</Alert>
      {result && <ImportResult result={result} />}
    </form>
  );
}
