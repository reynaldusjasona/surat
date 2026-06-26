/**
 * Apple Wallet Pass generation using passkit-generator.
 *
 * Requirements:
 * - Apple Developer Certificate (.pem)
 * - Pass Type ID Certificate (.pem)
 * - WWDR Certificate
 * - Pass model directory with pass.json template
 *
 * These are configured via environment variables:
 * - APPLE_PASS_TYPE_ID
 * - APPLE_TEAM_ID
 * - Certificates in /certs/ directory
 *
 * Since Apple Wallet requires real certificates from Apple Developer Program,
 * this module will gracefully fail if certificates are not configured.
 */

interface ApplePassInput {
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  guestId: string;
  guestName: string;
}

interface ApplePassResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

export async function generateApplePass(input: ApplePassInput): Promise<ApplePassResult> {
  const { eventName, eventDate, eventLocation, guestId } = input;

  // Check if certificates are configured
  if (!process.env.APPLE_PASS_TYPE_ID || !process.env.APPLE_TEAM_ID) {
    return {
      success: false,
      error: "Apple Wallet certificates not configured. Set APPLE_PASS_TYPE_ID and APPLE_TEAM_ID environment variables.",
    };
  }

  try {
    // Dynamic import to avoid build errors when passkit-generator deps aren't fully configured
    const { PKPass } = await import("passkit-generator");

    const pass = new PKPass(
      {},
      {
        wwdr: process.env.APPLE_WWDR_CERT || "",
        signerCert: process.env.APPLE_SIGNER_CERT || "",
        signerKey: process.env.APPLE_SIGNER_KEY || "",
        signerKeyPassphrase: process.env.APPLE_SIGNER_KEY_PASSPHRASE || "",
      },
      {
        serialNumber: guestId,
        description: eventName,
        organizationName: "Surat",
        passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
        teamIdentifier: process.env.APPLE_TEAM_ID,
      }
    );

    pass.type = "eventTicket";

    pass.headerFields.push({
      key: "date",
      label: "DATE",
      value: eventDate.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });

    pass.primaryFields.push({
      key: "event",
      label: "EVENT",
      value: eventName,
    });

    pass.secondaryFields.push({
      key: "location",
      label: "LOCATION",
      value: eventLocation,
    });

    pass.setBarcodes({
      message: guestId,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    });

    const buffer = pass.getAsBuffer();
    return { success: true, buffer };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate Apple Wallet pass",
    };
  }
}
