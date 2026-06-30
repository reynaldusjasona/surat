import { z } from "zod";

export const userRoles = ["host", "organizer", "photographer", "admin"] as const;
export const eventTypes = ["wedding", "birthday", "gathering", "custom"] as const;
export const rsvpStatuses = ["attending", "maybe", "not_attending"] as const;
export const eventPlans = ["free", "standard", "premium"] as const;

export type UserRole = (typeof userRoles)[number];
export type EventType = (typeof eventTypes)[number];
export type RsvpStatus = (typeof rsvpStatuses)[number];

// Profile
export const createProfileSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(255),
  role: z.enum(userRoles).default("host"),
});

// Event
export const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum(eventTypes),
  date: z.string(),
  time: z.string().optional(),
  location: z.string().min(1),
  mapsUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  plan: z.enum(eventPlans).default("free"),
  enableRsvp: z.boolean().default(true),
  enableAngpao: z.boolean().default(true),
  enableRegistry: z.boolean().default(true),
  enablePhotos: z.boolean().default(true),
  guestLimit: z.number().int().positive().default(50),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// RSVP
export const createRsvpSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  status: z.enum(rsvpStatuses),
  plusOnes: z.array(z.object({ name: z.string().min(1) })).optional(),
  dietaryNotes: z.string().max(500).optional(),
});

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;

// Angpao
export const createAngpaoSchema = z.object({
  senderName: z.string().min(1).max(255),
  senderEmail: z.string().email(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("SGD"),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
});

export type CreateAngpaoInput = z.infer<typeof createAngpaoSchema>;

// Registry
export const createRegistryItemSchema = z.object({
  name: z.string().min(1).max(255),
  brand: z.string().optional(),
  price: z.number().positive(),
  productUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  priority: z.number().int().min(1).max(10).default(5),
});

export const claimRegistryItemSchema = z.object({
  claimedBy: z.string().min(1).max(255),
  claimedByEmail: z.string().email(),
  claimedAnonymous: z.boolean().default(false),
});

export type CreateRegistryItemInput = z.infer<typeof createRegistryItemSchema>;
export type ClaimRegistryItemInput = z.infer<typeof claimRegistryItemSchema>;

// Photo upload
export const uploadPhotoSchema = z.object({
  uploaderName: z.string().min(1).max(255),
  uploaderEmail: z.string().email(),
  isPhotographer: z.boolean().default(false),
  originalUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  fileSize: z.number().int().positive().optional(),
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>;

// Auth
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(255),
  role: z.enum(["host", "organizer", "photographer"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
