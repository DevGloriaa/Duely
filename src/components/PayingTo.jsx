import { useState } from "react";
import { ACCOUNT_NAME, ACCOUNT_NUMBER, BANK_NAME, DUES_AMOUNT, ORG_NAME } from "../config.js";
import { formatMoney } from "../format.js";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the account number", text);
    }
  }

  return (
    <button type="button" className="text-sm font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600" onClick={copy} aria-label="Copy account number">
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export default function PayingTo() {
  if (!ACCOUNT_NUMBER) return null;

  const rows = [
    ["Amount", DUES_AMOUNT && formatMoney(DUES_AMOUNT)],
    ["Bank", BANK_NAME],
    ["Account name", ACCOUNT_NAME],
  ].filter(([, value]) => value);

  return (
    <section className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5" aria-labelledby="paying-title">
      <h2 id="paying-title" className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {ORG_NAME ? `Paying to ${ORG_NAME}` : "Paying to"}
      </h2>
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium tabular-nums text-zinc-950">{value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-3 text-sm">
          <dt className="text-muted-foreground">Account number</dt>
          <dd className="flex items-center gap-3 text-right font-mono font-medium tracking-wide text-zinc-950">
            <span>{ACCOUNT_NUMBER}</span>
            <CopyButton text={ACCOUNT_NUMBER} />
          </dd>
        </div>
      </dl>
    </section>
  );
}
