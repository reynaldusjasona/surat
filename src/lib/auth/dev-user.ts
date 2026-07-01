import { cookies } from "next/headers";

/**
 * DEV ONLY: Predefined dev user IDs per role.
 * These are deterministic UUIDs so Prisma queries work consistently.
 */
const DEV_USERS: Record<string, { id: string; email: string; fullName: string }> = {
  host: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "dev-host@surat.local",
    fullName: "Dev Host",
  },
  organizer: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "dev-organizer@surat.local",
    fullName: "Dev Organizer",
  },
  photographer: {
    id: "00000000-0000-0000-0000-000000000003",
    email: "dev-photographer@surat.local",
    fullName: "Dev Photographer",
  },
  admin: {
    id: "00000000-0000-0000-0000-000000000004",
    email: "dev-admin@surat.local",
    fullName: "Dev Admin",
  },
};

export interface DevUser {
  id: string;
  email: string;
  user_metadata: { role: string };
}

export interface DevProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

/**
 * Returns a mock dev user if the dev-bypass-role cookie is present and we're not in production.
 * Returns null otherwise.
 */
export async function getDevUser(): Promise<{ user: DevUser; profile: DevProfile } | null> {
  if (process.env.NODE_ENV === "production") return null;

  const cookieStore = await cookies();
  const devRole = cookieStore.get("dev-bypass-role")?.value;

  if (!devRole || !DEV_USERS[devRole]) return null;

  const devData = DEV_USERS[devRole];

  return {
    user: {
      id: devData.id,
      email: devData.email,
      user_metadata: { role: devRole },
    },
    profile: {
      id: devData.id,
      fullName: devData.fullName,
      email: devData.email,
      role: devRole,
    },
  };
}
