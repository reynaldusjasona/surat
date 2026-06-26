import { z } from "zod";

// ─── Zod Schemas ────────────────────────────────────────────────────────────────

export const userRoles = ["host", "photographer", "admin"] as const;
export const eventTypes = ["wedding", "birthday", "gathering", "custom"] as const;
export const rsvpStatuses = ["attending", "not_attending", "maybe", "pending"] as const;
export const uploaderRoles = ["photographer", "guest"] as const;
export const passTypes = ["apple", "google"] as const;

// User
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(userRoles),
});

// Event
export const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum(eventTypes),
  date: z.string().datetime(),
  location: z.string().min(1),
  locationUrl: z.string().url().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  featuresEnabled: z.record(z.boolean()).default({}),
  guestCapacity: z.number().int().positive().optional(),
});

// Guest / RSVP
export const createGuestSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  plusOnes: z
    .array(z.object({ name: z.string().min(1) }))
    .optional(),
  dietaryNotes: z.string().optional(),
});

export const updateRsvpSchema = z.object({
  rsvpStatus: z.enum(rsvpStatuses),
  plusOnes: z
    .array(z.object({ name: z.string().min(1) }))
    .optional(),
  dietaryNotes: z.string().optional(),
});

// Angpao (Digital Red Packet)
export const createAngpaoSchema = z.object({
  senderName: z.string().min(1).max(255),
  senderEmail: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("SGD"),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
});

// Registry Item
export const createRegistryItemSchema = z.object({
  name: z.string().min(1).max(255),
  brand: z.string().optional(),
  price: z.number().positive(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  priority: z.number().int().min(0).default(0),
});

export const purchaseRegistryItemSchema = z.object({
  purchasedByName: z.string().min(1).max(255),
  purchasedByEmail: z.string().email(),
  isAnonymousPurchase: z.boolean().default(false),
});

// Photo
export const createPhotoSchema = z.object({
  uploaderRole: z.enum(uploaderRoles),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  fileSize: z.number().int().positive().optional(),
  resolution: z.string().optional(),
});

// Photo Unlock
export const createPhotoUnlockSchema = z.object({
  guestEmail: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("SGD"),
});

// Wallet Pass
export const createWalletPassSchema = z.object({
  guestId: z.string().uuid(),
  passType: z.enum(passTypes),
  passData: z.record(z.unknown()),
});

// ─── Inferred Types ─────────────────────────────────────────────────────────────

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateRsvpInput = z.infer<typeof updateRsvpSchema>;
export type CreateAngpaoInput = z.infer<typeof createAngpaoSchema>;
export type CreateRegistryItemInput = z.infer<typeof createRegistryItemSchema>;
export type PurchaseRegistryItemInput = z.infer<typeof purchaseRegistryItemSchema>;
export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type CreatePhotoUnlockInput = z.infer<typeof createPhotoUnlockSchema>;
export type CreateWalletPassInput = z.infer<typeof createWalletPassSchema>;
