import { useEffect, useRef } from "react";

export default function SubmitConfirmation({ studentName, onReset }) {
  const headingRef = useRef(null);
  const firstName = studentName.split(" ")[0];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl space-y-5 py-8">
      <h1 ref={headingRef} className="text-3xl font-semibold tracking-tight text-zinc-950" tabIndex={-1}>
        Receipt received
      </h1>
      <p>Thanks, {firstName}. The financial secretary will confirm your payment.</p>
      <p>
        <button type="button" className="text-sm font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600" onClick={onReset}>
          Submit for someone else
        </button>
      </p>
    </div>
  );
}
