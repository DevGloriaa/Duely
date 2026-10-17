import { useEffect, useId, useState } from "react";
import { Check, FileText, Loader2, X } from "lucide-react";
import { getDuesAmount, getReceipt, getUnclaimedTransactions, rejectSubmission, verifySubmission } from "../api.js";
import { canPreview } from "../receipts.js";
import { formatMoney } from "../format.js";
import { isStrongMatch, nameScore } from "../nameMatch.js";
import { normalizeStatus, statusLabel } from "../statuses.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const MAX_NOTE = 255;

export default function ReviewSheet({ submission, open, onOpenChange, onDone }) {
  const searchId = useId();
  const noteId = useId();
  const { toast } = useToast();
  const [receipt, setReceipt] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [dues, setDues] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!submission || !open) return undefined;
    let receiptUrl = "";
    setReceipt(null);
    setSelectedId(submission.transactionId || null);
    setNote("");
    setSearch("");
    setLoading(true);
    Promise.all([
      getReceipt(submission.id).then(({ blob, filename }) => {
        receiptUrl = URL.createObjectURL(blob);
        setReceipt({ url: receiptUrl, type: blob.type, filename });
      }),
      getUnclaimedTransactions().then(setTransactions),
      getDuesAmount().then(setDues),
    ])
      .catch((err) => toast({ title: "Could not load review", description: err.message, variant: "destructive" }))
      .finally(() => setLoading(false));
    return () => receiptUrl && URL.revokeObjectURL(receiptUrl);
  }, [submission, open, toast]);

  if (!submission) return null;

  const query = search.trim().toLowerCase();
  const visibleTransactions = transactions
    .filter((transaction) => !query || transaction.narration.toLowerCase().includes(query) || `#${transaction.id}` === query)
    .map((transaction) => ({ ...transaction, score: nameScore(submission.payerName, transaction.narration) }))
    .sort((a, b) => b.score - a.score);

  async function handleVerify() {
    if (!selectedId) return;
    setSaving(true);
    try {
      await verifySubmission(submission.id, selectedId);
      toast({ title: "Submission verified", description: `${submission.studentName} is now verified.` });
      onDone();
    } catch (err) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    const trimmed = note.trim();
    if (!trimmed || trimmed.length > MAX_NOTE) {
      toast({ title: "Add a rejection note", description: `Use between 1 and ${MAX_NOTE} characters.`, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await rejectSubmission(submission.id, trimmed);
      toast({ title: "Submission rejected", description: "The student can now see your note." });
      onDone();
    } catch (err) {
      toast({ title: "Rejection failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const previewable = receipt && (canPreview(receipt.type) || receipt.type === "application/pdf");
  const status = normalizeStatus(submission.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto border-zinc-200 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-zinc-200 px-6 py-6 text-left">
          <SheetTitle className="text-2xl tracking-tight">{submission.studentName}</SheetTitle>
          <SheetDescription>{submission.matricNumber} · {statusLabel(status)}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-8 px-6 py-6">
          <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {loading && <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />}
            {!loading && receipt && canPreview(receipt.type) && <img src={receipt.url} alt={`Receipt from ${submission.studentName}`} className="max-h-80 w-full object-contain" />}
            {!loading && receipt?.type === "application/pdf" && <iframe src={receipt.url} title="Payment receipt" className="h-80 w-full" />}
            {!loading && receipt && !previewable && <div className="space-y-3 text-center"><FileText className="mx-auto h-8 w-8 text-zinc-400" /><p className="text-sm text-muted-foreground">Preview unavailable</p><a className="text-sm font-medium underline underline-offset-4" href={receipt.url} download={receipt.filename}>Download receipt</a></div>}
          </div>
          <div className="grid gap-4 rounded-xl border border-zinc-200 p-5 sm:grid-cols-2">
            <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Paid by</p><p className="mt-1 font-medium text-zinc-950">{submission.payerName}</p></div>
            <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Payment</p><p className="mt-1 font-medium text-zinc-950">{submission.transactionId ? `#${submission.transactionId}` : "Not linked"}</p></div>
          </div>
          <div className="space-y-3">
            <Label htmlFor={searchId}>Match bank payment</Label>
            <Input id={searchId} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or #number" />
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {visibleTransactions.map((transaction) => {
                const strong = isStrongMatch(submission.payerName, transaction.narration);
                const belowDues = dues != null && Number(transaction.amount) < Number(dues);
                return (
                  <button key={transaction.id} type="button" onClick={() => setSelectedId(transaction.id)} className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedId === transaction.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 hover:border-zinc-400"}`}>
                    <span className="flex justify-between gap-4 text-sm font-medium"><span className="truncate">{transaction.narration}</span><span>{formatMoney(transaction.amount)}</span></span>
                    <span className={`mt-1 block text-xs ${selectedId === transaction.id ? "text-zinc-300" : "text-muted-foreground"}`}>#{transaction.id} {strong ? "· Name match" : belowDues ? "· Below dues" : ""}</span>
                  </button>
                );
              })}
              {!visibleTransactions.length && <p className="text-sm text-muted-foreground">No unclaimed payments found.</p>}
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor={noteId}>Rejection note</Label>
            <textarea id={noteId} value={note} onChange={(event) => setNote(event.target.value)} maxLength={MAX_NOTE} rows={4} placeholder="Tell the student what needs to be fixed." className="w-full resize-none rounded-md border border-zinc-300 bg-background px-3 py-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
            <p className="text-xs text-muted-foreground">{note.trim().length}/{MAX_NOTE}</p>
          </div>
        </div>
        <SheetFooter className="grid grid-cols-2 gap-3 border-t border-zinc-200 px-6 py-5 sm:flex sm:flex-row">
          <Button type="button" className="h-12 bg-zinc-950 hover:bg-zinc-800" disabled={saving || !selectedId} onClick={handleVerify}><Check className="h-4 w-4" />{saving ? "Saving…" : "Verify"}</Button>
          <Button type="button" variant="outline" className="h-12 border-zinc-300" disabled={saving || status === "REJECTED"} onClick={handleReject}><X className="h-4 w-4" />Reject</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
