import { useState } from "react";
import SummaryLine from "./SummaryLine.jsx";
import DuesAmountForm from "./DuesAmountForm.jsx";
import StatementUpload from "./StatementUpload.jsx";
import SubmissionsTable from "./SubmissionsTable.jsx";
import ExportButton from "./ExportButton.jsx";

export default function AdminDashboard({ onSignOut }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((n) => n + 1);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Administration</p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Dues ledger</h1>
        </div>
        <div className="flex items-center gap-4">
          <ExportButton />
          <button type="button" className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-zinc-950" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      <SummaryLine refreshKey={refreshKey} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DuesAmountForm />
        <StatementUpload onImported={refresh} />
      </div>

      <SubmissionsTable refreshKey={refreshKey} onChanged={refresh} />
    </div>
  );
}
