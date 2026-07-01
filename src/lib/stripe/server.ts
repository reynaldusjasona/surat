import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

// Event plan prices
export const EVENT_PLANS = {
  free: { price: 0, label: "Free" },
  standard: { price: 1900, label: "Standard", currency: "sgd" }, // 19.00 SGD in cents
  premium: { price: 4900, label: "Premium", currency: "sgd" },   // 49.00 SGD in cents
} as const;

// Photo unlock price
export const PHOTO_UNLOCK_PRICE = {
  sgd: { amount: 599, currency: "sgd" },   // 5.99 SGD
  idr: { amount: 4900000, currency: "idr" }, // 49,000 IDR
} as const;

// Angpao commission rates by plan
export const ANGPAO_COMMISSION = {
  free: 0.03,      // 3%
  standard: 0.02,  // 2%
  premium: 0.01,   // 1%
} as const;
