import { formatDate } from "../format.js";
import { normalizeStatus } from "../statuses.js";
import StatusTag from "../components/StatusTag.jsx";
import { TableCell, TableRow } from "@/components/ui/table";

export default function SubmissionRow({ submission, onSelect }) {
  const status = normalizeStatus(submission.status);

  return (
    <TableRow className="cursor-pointer hover:bg-zinc-50" onClick={onSelect} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onSelect()}>
      <TableCell>
        <div>
          <strong className="block text-sm text-zinc-950">{submission.studentName}</strong>
          <span className="block text-xs text-muted-foreground">{submission.matricNumber}</span>
        </div>
      </TableCell>
      <TableCell>
        <span>{submission.payerName}</span>
      </TableCell>
      <TableCell>
        <span>{formatDate(submission.submittedAt)}</span>
      </TableCell>
      <TableCell>
        <div>
          <StatusTag status={submission.status} />
          {submission.note && <span className="mt-1 block max-w-xs truncate text-xs text-muted-foreground">{submission.note}</span>}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span>{submission.transactionId ? `#${submission.transactionId}` : "Not linked"}</span>
      </TableCell>
      <TableCell className="text-right text-xs font-medium text-muted-foreground">Review →</TableCell>
    </TableRow>
  );
}
