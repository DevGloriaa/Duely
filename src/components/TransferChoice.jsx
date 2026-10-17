import { useId } from "react";

const OPTIONS = [
  { value: false, label: "I did" },
  { value: true, label: "Someone else" },
];

export default function TransferChoice({ someoneElse, onChange }) {
  const name = useId();

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-zinc-900">Who made the transfer?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <label key={option.label} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm font-medium transition-colors ${someoneElse === option.value ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 hover:border-zinc-500"}`}>
            <input
              type="radio"
              name={name}
              checked={someoneElse === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
