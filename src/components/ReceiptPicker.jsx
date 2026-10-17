import { useEffect, useId, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RECEIPT_ACCEPT, canPreview, fileExtension } from "../receipts.js";
import { formatBytes } from "../format.js";

function DocThumb({ name }) {
  return (
    <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-zinc-100 text-zinc-500" aria-hidden="true">
      <FileText className="h-5 w-5" />
      {fileExtension(name).toUpperCase()}
    </span>
  );
}

function usePreview(file) {
  const [url, setUrl] = useState("");
  const show = file && canPreview(file.type);

  useEffect(() => {
    if (!show) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, show]);

  return show ? url : "";
}

export default function ReceiptPicker({ file, onChange, error }) {
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const previewUrl = usePreview(file);

  return (
    <div className="space-y-3" data-invalid={error ? true : undefined}>
      <Label id={labelId} className="text-sm font-medium text-zinc-900">
        Payment receipt
      </Label>
      <input
        id={id}
        type="file"
        className="sr-only"
        accept={RECEIPT_ACCEPT}
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />
      {file ? (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          {previewUrl ? <img src={previewUrl} alt="" className="h-14 w-14 shrink-0 rounded-md border border-zinc-200 object-cover" /> : <DocThumb name={file.name} />}
          <span className="min-w-0 flex-1 space-y-1">
            <span className="block truncate text-sm font-medium text-zinc-900">{file.name}</span>
            <span className="block text-sm text-muted-foreground">{formatBytes(file.size)}</span>
          </span>
          <label htmlFor={id} className="cursor-pointer text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600">
            Change
          </label>
        </div>
      ) : (
        <label htmlFor={id} className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center transition-colors hover:border-zinc-950 hover:bg-zinc-50">
          <UploadCloud className="h-8 w-8 text-zinc-500" aria-hidden="true" />
          <span className="text-sm font-medium text-zinc-900">Upload payment receipt</span>
          <span className="text-sm text-muted-foreground">Photo, screenshot or PDF · 8MB max</span>
        </label>
      )}
    </div>
  );
}
