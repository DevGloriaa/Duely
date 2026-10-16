const MAX_BYTES = 8 * 1024 * 1024;

export const TOO_BIG = "That file is over 8MB. Try a screenshot of the receipt instead.";
export const WRONG_TYPE = "That file type isn't supported. Use a photo or screenshot (JPG, PNG, WEBP, HEIC) or a PDF.";

const TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  pdf: "application/pdf",
};

const PREVIEWABLE = ["image/jpeg", "image/png", "image/webp"];

export const RECEIPT_ACCEPT = Object.keys(TYPES)
  .map((ext) => `.${ext}`)
  .concat([...new Set(Object.values(TYPES))])
  .join(",");

export function fileExtension(name) {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot + 1).toLowerCase();
}

export function receiptError(file) {
  if (!TYPES[fileExtension(file.name)]) return WRONG_TYPE;
  if (file.size > MAX_BYTES) return TOO_BIG;
  return "";
}

export function withReceiptType(file) {
  if (file.type) return file;
  return new File([file], file.name, { type: TYPES[fileExtension(file.name)] });
}

export function canPreview(type) {
  return PREVIEWABLE.includes(type);
}
