import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { submitProof } from "../api.js";
import { MATRIC_HINT } from "../matric.js";
import { receiptError, withReceiptType } from "../receipts.js";
import { errorsFromServer, validateSubmission } from "../submitErrors.js";
import ReceiptPicker from "./ReceiptPicker.jsx";
import TransferChoice from "./TransferChoice.jsx";
import TextField from "./TextField.jsx";

export default function SubmitForm({ onSubmitted }) {
  const { toast } = useToast();
  const formRef = useRef(null);
  const [studentName, setStudentName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [someoneElse, setSomeoneElse] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function edit(setter, field) {
    return (value) => {
      setter(value);
      setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    };
  }

  function pickReceipt(file) {
    setReceipt(file);
    setErrors((current) => ({ ...current, receipt: receiptError(file) || undefined, form: undefined }));
  }

  function showErrors(next) {
    setErrors(next);
    const message = Object.values(next).find(Boolean);
    if (message) toast({ title: "Check your details", description: message, variant: "destructive" });
    requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateSubmission({ studentName, matricNumber, receipt, someoneElse, payerName });
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }

    const name = studentName.trim();
    setSubmitting(true);
    setErrors({});
    try {
      const data = await submitProof({
        studentName: name,
        matricNumber: matricNumber.trim(),
        payerName: someoneElse ? payerName.trim() : name,
        receipt: withReceiptType(receipt),
      });
      toast({ title: "Receipt submitted", description: "Your payment is now awaiting review." });
      onSubmitted(data?.studentName || name);
    } catch (err) {
      showErrors(errorsFromServer(err));
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Full name"
        hint="Your name as it appears on your school records"
        value={studentName}
        onChange={edit(setStudentName, "studentName")}
        error={errors.studentName}
        autoComplete="name"
        maxLength={150}
      />
      <TextField
        label="Matric number"
        hint={MATRIC_HINT}
        value={matricNumber}
        onChange={edit(setMatricNumber, "matricNumber")}
        error={errors.matricNumber}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        maxLength={50}
      />
      <ReceiptPicker file={receipt} onChange={pickReceipt} error={errors.receipt} />
      <TransferChoice someoneElse={someoneElse} onChange={edit(setSomeoneElse, "payerName")} />
      {someoneElse && (
        <TextField
          label="Name on the account that paid"
          hint="e.g. Name on the bank account that made the payment"
          value={payerName}
          onChange={edit(setPayerName, "payerName")}
          error={errors.payerName}
          maxLength={150}
        />
      )}

      <Button type="submit" className="h-14 w-full bg-zinc-950 text-base hover:bg-zinc-800 sm:w-auto sm:px-8" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit receipt"}
      </Button>
    </form>
  );
}
