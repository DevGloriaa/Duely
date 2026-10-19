import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, FileQuestion, Search, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSubmissionStatus } from "../api.js";

const STATUS_DETAILS = {
  VERIFIED: {
    label: "Verified",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  FLAGGED: {
    label: "Flagged",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: TriangleAlert,
  },
  REJECTED: {
    label: "Rejected",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: TriangleAlert,
  },
  PENDING: {
    label: "Pending",
    className: "border-zinc-200 bg-zinc-100 text-zinc-700",
    icon: Clock3,
  },
};

function statusDetails(status) {
  return STATUS_DETAILS[String(status || "").toUpperCase()] || {
    label: status || "Unknown",
    className: "border-zinc-200 bg-zinc-100 text-zinc-700",
    icon: FileQuestion,
  };
}

export default function StatusLookupPage() {
  const [matricNumber, setMatricNumber] = useState("");
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const value = matricNumber.trim();
    if (!value) {
      setError("Enter your matric number to continue.");
      setSubmission(null);
      return;
    }

    setLoading(true);
    setError("");
    setSubmission(null);
    try {
      setSubmission(await getSubmissionStatus(value));
    } catch (err) {
      setError(err.status === 404 ? "No submission was found for that matric number." : err.message);
    } finally {
      setLoading(false);
    }
  }

  const details = submission && statusDetails(submission.status);
  const StatusIcon = details?.icon;

  return (
    <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white">
            <Search className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Check your status</h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
            Enter your matric number to see the latest update on your dues submission.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg">Submission lookup</CardTitle>
            <CardDescription>Your matric number is only used to find your submission.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="matric-number">
                Matric number
              </label>
              <Input
                id="matric-number"
                className="h-14 border-zinc-300 px-4 text-lg uppercase tracking-wide"
                value={matricNumber}
                onChange={(event) => {
                  setMatricNumber(event.target.value);
                  setError("");
                }}
                placeholder="e.g. CSC/2024/001"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
              />
              <Button className="h-12 w-full bg-zinc-950 text-base hover:bg-zinc-800" disabled={loading}>
                <Search className="h-4 w-4" aria-hidden="true" />
                {loading ? "Searching…" : "Find submission"}
              </Button>
              {error && <p className="text-sm font-medium text-rose-700" role="alert">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {submission && details && (
          <Card className="overflow-hidden border-zinc-200 shadow-sm">
            <CardContent className="p-0">
              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Submission record</p>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{submission.studentName}</h2>
                  </div>
                  <Badge className={details.className}>
                    <StatusIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {details.label}
                  </Badge>
                </div>
                <div className="border-t border-dashed border-zinc-200 pt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Matric number</p>
                  <p className="mt-2 font-mono text-sm tracking-wide text-zinc-800">{matricNumber.trim().toUpperCase()}</p>
                </div>
                {submission.note && (
                  <div className="border-l-2 border-zinc-300 pl-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Note from admin</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{submission.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Need to submit a receipt?{" "}
          <Link className="font-medium text-zinc-950 underline underline-offset-4 transition-colors hover:text-zinc-600" to="/">
            Return to submission
          </Link>
        </p>
      </div>
    </main>
  );
}
