const env = import.meta.env || {};

export const APP_NAME = "DueSync";
export const ORG_NAME = env.VITE_ORG_NAME || "";
export const DUES_AMOUNT = env.VITE_DUES_AMOUNT || "";
export const BANK_NAME = env.VITE_BANK_NAME || "";
export const ACCOUNT_NAME = env.VITE_ACCOUNT_NAME || "";
export const ACCOUNT_NUMBER = env.VITE_ACCOUNT_NUMBER || "";
