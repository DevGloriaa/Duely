const SERVER_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "").replace(/\/api$/, "");
const API_URL = `${SERVER_URL}/api`;
const KEY_STORAGE = "duesync-admin-key";
export const KEY_REJECTED_EVENT = "duesync-admin-key-rejected";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function getAdminKey() {
  return sessionStorage.getItem(KEY_STORAGE) || "";
}

export function setAdminKey(key) {
  sessionStorage.setItem(KEY_STORAGE, key);
}

export function clearAdminKey() {
  sessionStorage.removeItem(KEY_STORAGE);
}

function fallbackMessage(status) {
  if (status === 401) return "Missing or invalid admin key.";
  if (status === 404) return "We could not find what you were looking for.";
  if (status === 413) return "The file is too large. The maximum size is 8MB.";
  return "Something went wrong. Please try again.";
}

async function readBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function readError(res) {
  const data = await readBody(res);
  return data?.message || fallbackMessage(res.status);
}

function filenameFrom(res) {
  const header = res.headers.get("Content-Disposition") || "";
  const match = header.match(/filename="?([^";]+)"?/i);
  return match ? match[1] : "";
}

async function readFile(res) {
  return { blob: await res.blob(), filename: filenameFrom(res) };
}

async function request(path, { method = "GET", body, admin = false, file = false } = {}) {
  const headers = {};
  let payload = body;

  if (admin) headers["X-Admin-Key"] = getAdminKey();
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(API_URL + path, { method, headers, body: payload });
  } catch {
    throw new ApiError("We could not reach the server. Check your connection and try again.", 0);
  }

  if (!res.ok) {
    if (admin && res.status === 401) {
      clearAdminKey();
      window.dispatchEvent(new Event(KEY_REJECTED_EVENT));
    }
    throw new ApiError(await readError(res), res.status);
  }

  return file ? readFile(res) : readBody(res);
}

export function submitProof({ studentName, matricNumber, payerName, receipt }) {
  const form = new FormData();
  form.append("studentName", studentName);
  form.append("matricNumber", matricNumber);
  form.append("payerName", payerName);
  form.append("receipt", receipt);
  return request("/submissions", { method: "POST", body: form });
}

export function getSubmissionStatus(matricNumber) {
  return request(`/submissions/status/${encodeURIComponent(matricNumber.trim())}`);
}

export async function getDuesAmount() {
  const data = await request("/admin/settings/dues-amount", { admin: true });
  return data.amount;
}

export async function setDuesAmount(amount) {
  const data = await request("/admin/settings/dues-amount", { method: "PUT", body: { amount }, admin: true });
  return data.amount;
}

export function uploadStatement(file) {
  const form = new FormData();
  form.append("file", file);
  return request("/admin/statements", { method: "POST", body: form, admin: true });
}

export function getSummary() {
  return request("/admin/summary", { admin: true });
}

export function getSubmissions(status) {
  const query = status ? `?status=${status}` : "";
  return request(`/admin/submissions${query}`, { admin: true });
}

export function getReceipt(id) {
  return request(`/admin/submissions/${id}/receipt`, { admin: true, file: true });
}

export function verifySubmission(id, transactionId) {
  return request(`/admin/submissions/${id}/verify`, { method: "POST", body: { transactionId }, admin: true });
}

export function rejectSubmission(id, note) {
  return request(`/admin/submissions/${id}/reject`, { method: "POST", body: { note }, admin: true });
}

export function getUnclaimedTransactions() {
  return request("/admin/transactions?unclaimed=true", { admin: true });
}

export function exportVerified() {
  return request("/admin/export", { admin: true, file: true });
}
