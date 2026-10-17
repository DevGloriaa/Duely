import { useEffect, useState } from "react";
import { getSummary } from "../api.js";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ITEMS = [
  { key: "verified", label: "Total verified" },
  { key: "pending", label: "Pending" },
  { key: "flagged", label: "Flagged" },
  { key: "unclaimedTransactions", label: "Unclaimed" },
];

export default function SummaryLine({ refreshKey }) {
  const { toast } = useToast();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummary()
      .then((data) => {
        setSummary(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
        toast({ title: "Could not load summary", description: err.message, variant: "destructive" });
      });
  }, [refreshKey]);

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
      {ITEMS.map(({ key, label }) => (
        <Card key={key} className="border-zinc-200 shadow-none">
          <CardContent className="space-y-3 p-5">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="text-4xl font-semibold tracking-tight text-zinc-950">{summary ? summary[key] : "…"}</dd>
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
