const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const date = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

export function formatMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? money.format(number) : "";
}

export function formatDate(value) {
  if (!value) return "";
  const parsed = new Date(String(value).replace(/(\.\d{3})\d+/, "$1"));
  return Number.isNaN(parsed.getTime()) ? String(value) : date.format(parsed);
}

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
