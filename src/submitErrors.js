import { TOO_BIG, receiptError } from "./receipts.js";

const FIELD_NAMES = {
  studentName: "Your full name",
  matricNumber: "Your matric number",
  payerName: "The account name",
};

export function validateSubmission({ studentName, matricNumber, receipt, someoneElse, payerName }) {
  const errors = {};
  if (!studentName.trim()) errors.studentName = "Enter your full name.";
  if (!matricNumber.trim()) errors.matricNumber = "Enter your matric number.";
  if (!receipt) errors.receipt = "Add a photo, screenshot or PDF of your receipt.";
  else if (receiptError(receipt)) errors.receipt = receiptError(receipt);
  if (someoneElse && !payerName.trim()) errors.payerName = "Enter the name on the account that paid.";
  return errors;
}

export function errorsFromServer(err) {
  if (err.status === 409) return { matricNumber: "We already have a submission for this matric number." };
  if (err.status === 413) return { receipt: TOO_BIG };
  if (/receipt/i.test(err.message)) return { receipt: err.message };
  const field = Object.keys(FIELD_NAMES).find((key) => err.message.startsWith(key));
  if (field) return { [field]: err.message.replace(field, FIELD_NAMES[field]) };
  return { form: err.message };
}
