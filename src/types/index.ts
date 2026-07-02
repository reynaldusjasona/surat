import { z } from "zod";

// ─── Event ────────────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["wedding", "birthday", "gathering", "custom"]).default("wedding"),
  date: z.string().min(1, "Date is required"), // ISO date string
  time: z.string().optional(),
  location: z.string().min(1, "Location is required").max(500),
  mapsUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  plan: z.enum(["free", "standard", "premium"]).default("free"),
  enableRsvp: z.boolean().default(true),
  enableAngpao: z.boolean().default(true),
  enableRegistry: z.boolean().default(true),
  enablePhotos: z.boolean().default(true),
  guestLimit: z.number().int().positive().default(50),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export const createRsvpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  status: z.enum(["attending", "maybe", "not_attending"]).default("attending"),
  plusOnes: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
      })
    )
    .optional(),
  dietaryNotes: z.string().max(500).optional(),
});

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;

// ─── Angpao ───────────────────────────────────────────────────────────────────

export const createAngpaoSchema = z.object({
  senderName: z.string().min(1, "Name is required").max(100),
  senderEmail: z.string().email("Valid email is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["SGD", "IDR", "MYR", "USD"]).default("SGD"),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
});

export type CreateAngpaoInput = z.infer<typeof createAngpaoSchema>;

// ─── Registry ─────────────────────────────────────────────────────────────────

export const createRegistryItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(200),
  brand: z.string().max(100).optional(),
  price: z.number().positive("Price must be positive"),
  productUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  priority: z.number().int().min(1).max(10).default(5),
});

export type CreateRegistryItemInput = z.infer<typeof createRegistryItemSchema>;

export const claimRegistryItemSchema = z.object({
  claimedBy: z.string().min(1, "Name is required").max(100),
  claimedByEmail: z.string().email("Valid email is required"),
  claimedAnonymous: z.boolean().default(false),
});

export type ClaimRegistryItemInput = z.infer<typeof claimRegistryItemSchema>;
