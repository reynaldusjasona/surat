import { resend, FROM_EMAIL } from "./resend";
import {
  rsvpConfirmationEmail,
  newRsvpNotificationEmail,
  angpaoReceivedEmail,
  photoUnlockEmail,
} from "./templates";

// ─── Send RSVP confirmation to guest ─────────────────────────────

export async function sendRsvpConfirmation(data: {
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
  status: string;
}) {
  try {
    const { subject, html } = rsvpConfirmationEmail(data);
    await resend.emails.send({
      from: `Surat <${FROM_EMAIL}>`,
      to: data.guestEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send RSVP confirmation email:", error);
    // Don't throw — email failure shouldn't block the RSVP
  }
}

// ─── Notify host of new RSVP ─────────────────────────────────────

export async function sendNewRsvpNotification(data: {
  hostName: string;
  hostEmail: string;
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  status: string;
  plusOnes: number;
  dashboardUrl: string;
  totalRsvps: number;
}) {
  try {
    const { subject, html } = newRsvpNotificationEmail(data);
    await resend.emails.send({
      from: `Surat <${FROM_EMAIL}>`,
      to: data.hostEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send new RSVP notification:", error);
  }
}

// ─── Notify host of angpao received ──────────────────────────────

export async function sendAngpaoNotification(data: {
  hostName: string;
  hostEmail: string;
  eventTitle: string;
  amount: string;
  currency: string;
  senderName: string;
  message: string | null;
  isAnonymous: boolean;
  dashboardUrl: string;
}) {
  try {
    const { subject, html } = angpaoReceivedEmail(data);
    await resend.emails.send({
      from: `Surat <${FROM_EMAIL}>`,
      to: data.hostEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send angpao notification:", error);
  }
}

// ─── Send photo unlock confirmation to guest ─────────────────────

export async function sendPhotoUnlockConfirmation(data: {
  guestEmail: string;
  guestName: string;
  eventTitle: string;
  eventUrl: string;
}) {
  try {
    const { subject, html } = photoUnlockEmail(data);
    await resend.emails.send({
      from: `Surat <${FROM_EMAIL}>`,
      to: data.guestEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send photo unlock email:", error);
  }
}
