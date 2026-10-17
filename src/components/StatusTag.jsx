import { statusLabel, statusTone } from "../statuses.js";
import { Badge } from "@/components/ui/badge";

export default function StatusTag({ status }) {
  const tone = statusTone(status);
  const className = {
    verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
    flagged: "border-amber-200 bg-amber-50 text-amber-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    pending: "border-zinc-200 bg-zinc-100 text-zinc-700",
  }[tone] || "border-zinc-200 bg-zinc-100 text-zinc-700";
  return <Badge className={className}>{statusLabel(status)}</Badge>;
}
