export const STATUSES = ["PENDING", "VERIFIED", "FLAGGED", "REJECTED"];

const LABELS = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  FLAGGED: "Flagged",
  REJECTED: "Rejected",
};

export function normalizeStatus(status) {
  return String(status || "").toUpperCase();
}

export function statusTone(status) {
  return normalizeStatus(status).toLowerCase();
}

export function statusLabel(status) {
  return LABELS[normalizeStatus(status)] || status || "Unknown";
}
