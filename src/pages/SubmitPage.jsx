import { useState } from "react";
import { Link } from "react-router-dom";
import PayingTo from "../components/PayingTo.jsx";
import SubmitConfirmation from "../components/SubmitConfirmation.jsx";
import SubmitForm from "../components/SubmitForm.jsx";

export default function SubmitPage() {
  const [submittedName, setSubmittedName] = useState("");

  if (submittedName) {
    return <SubmitConfirmation studentName={submittedName} onReset={() => setSubmittedName("")} />;
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-8 py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Submit your dues receipt</h1>
      <PayingTo />
      <SubmitForm onSubmitted={setSubmittedName} />
      <Link to="/status" className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
        Already submitted? Check your status <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
