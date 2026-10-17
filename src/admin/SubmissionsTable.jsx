import { useEffect, useId, useState } from "react";
import { getSubmissions } from "../api.js";
import { STATUSES, statusLabel } from "../statuses.js";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import SubmissionRow from "./SubmissionRow.jsx";
import ReviewSheet from "./ReviewSheet.jsx";

export default function SubmissionsTable({ refreshKey, onChanged }) {
  const filterId = useId();
  const { toast } = useToast();
  const [status, setStatus] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    setLoading(true);
    getSubmissions(status)
      .then((data) => {
        setSubmissions(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        toast({ title: "Could not load submissions", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [status, refreshKey]);

  function handleDone() {
    setActive(null);
    onChanged();
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Submissions</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor={filterId} className="text-sm text-muted-foreground">
            Show
          </Label>
          <select id={filterId} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-rose-700" role="alert">{error}</p>}

      {loading && <p className="muted">Loading submissions…</p>}
      {!loading && !error && submissions.length === 0 && <p className="muted">No submissions here yet.</p>}

      {!loading && submissions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 hover:bg-zinc-50">
              <TableHead>Student</TableHead>
              <TableHead>Paid by</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Payment
              </TableHead>
              <TableHead>
                <span className="visually-hidden">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                onSelect={() => setActive(submission)}
              />
            ))}
          </TableBody>
          </Table>
        </div>
      )}

      <ReviewSheet submission={active} open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)} onDone={handleDone} />
    </section>
  );
}
