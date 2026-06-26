/**
 * Google Wallet Pass generation.
 *
 * In test mode, we generate a JWT that can be used to create a save link.
 * Requirements:
 * - Google Cloud service account with Wallet API enabled
 * - GOOGLE_WALLET_ISSUER_ID
 * - GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_WALLET_PRIVATE_KEY (base64 encoded)
 */

interface GooglePassInput {
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  guestId: string;
  guestName: string;
  eventId: string;
}

interface GooglePassResult {
  success: boolean;
  saveUrl?: string;
  error?: string;
}

export async function generateGooglePass(input: GooglePassInput): Promise<GooglePassResult> {
  const { eventName, eventDate, eventLocation, guestId, guestName, eventId } = input;

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL;
  const privateKeyBase64 = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  if (!issuerId || !serviceAccountEmail || !privateKeyBase64) {
    return {
      success: false,
      error: "Google Wallet credentials not configured. Set GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, and GOOGLE_WALLET_PRIVATE_KEY.",
    };
  }

  try {
    const { GoogleAuth } = await import("google-auth-library");

    const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf-8");

    const classId = `${issuerId}.surat-event-${eventId}`;
    const objectId = `${issuerId}.surat-guest-${guestId}`;

    const eventTicketClass = {
      id: classId,
      issuerName: "Surat",
      eventName: {
        defaultValue: { language: "en", value: eventName },
      },
      venue: {
        name: { defaultValue: { language: "en", value: eventLocation } },
      },
      dateTime: {
        start: eventDate.toISOString(),
      },
      reviewStatus: "UNDER_REVIEW",
    };

    const eventTicketObject = {
      id: objectId,
      classId: classId,
      state: "ACTIVE",
      ticketHolderName: guestName,
      barcode: {
        type: "QR_CODE",
        value: guestId,
      },
    };

    const claims = {
      iss: serviceAccountEmail,
      aud: "google",
      origins: [],
      typ: "savetowallet",
      payload: {
        eventTicketClasses: [eventTicketClass],
        eventTicketObjects: [eventTicketObject],
      },
    };

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
    });

    const client = await auth.getClient();
    // @ts-expect-error - sign method exists on JWT client
    const token = await client.sign(JSON.stringify(claims));

    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return { success: true, saveUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate Google Wallet pass",
    };
  }
}
