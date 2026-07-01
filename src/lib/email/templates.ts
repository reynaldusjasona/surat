// Simple HTML email templates for Surat notifications

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 560px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #171717;
`;

const buttonStyle = `
  display: inline-block;
  background: #DC2626;
  color: #ffffff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
`;

const footerStyle = `
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
  font-size: 12px;
  color: #737373;
`;

// ─── RSVP Confirmation (sent to guest) ────────────────────────────

export function rsvpConfirmationEmail(data: {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventUrl: string;
  status: string;
}) {
  const statusText = data.status === "attending" ? "You're confirmed!" : data.status === "maybe" ? "We'll keep a spot for you" : "We'll miss you";

  return {
    subject: `RSVP Confirmed — ${data.eventTitle}`,
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size: 24px; margin-bottom: 8px;">🎉 ${statusText}</h1>
        <p style="color: #525252; margin-bottom: 24px;">
          Hi ${data.guestName}, your RSVP for <strong>${data.eventTitle}</strong> has been received.
        </p>

        <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>📅 Date:</strong> ${data.eventDate}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>📍 Location:</strong> ${data.eventLocation}</p>
          <p style="margin: 0; font-size: 14px;"><strong>✅ Status:</strong> ${data.status}</p>
        </div>

        <a href="${data.eventUrl}" style="${buttonStyle}">View Event Page</a>

        <div style="${footerStyle}">
          <p>Sent by <strong>Surat</strong> — Event platform for Southeast Asia</p>
        </div>
      </div>
    `,
  };
}

// ─── New RSVP Notification (sent to host) ─────────────────────────

export function newRsvpNotificationEmail(data: {
  hostName: string;
  guestName: string;
  guestEmail: string;
  eventTitle: string;
  status: string;
  plusOnes: number;
  dashboardUrl: string;
  totalRsvps: number;
}) {
  return {
    subject: `New RSVP: ${data.guestName} — ${data.eventTitle}`,
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size: 24px; margin-bottom: 8px;">👋 New RSVP</h1>
        <p style="color: #525252; margin-bottom: 24px;">
          Hi ${data.hostName}, someone just responded to your event.
        </p>

        <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Name:</strong> ${data.guestName}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Email:</strong> ${data.guestEmail}</p>
          <p style="margin: 0 0 8px; font-size: 14px;"><strong>Status:</strong> ${data.status}</p>
          ${data.plusOnes > 0 ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Plus ones:</strong> +${data.plusOnes}</p>` : ""}
          <p style="margin: 0; font-size: 14px; color: #737373;"><strong>Total RSVPs:</strong> ${data.totalRsvps}</p>
        </div>

        <a href="${data.dashboardUrl}" style="${buttonStyle}">View Dashboard</a>

        <div style="${footerStyle}">
          <p>Sent by <strong>Surat</strong> — Event platform for Southeast Asia</p>
        </div>
      </div>
    `,
  };
}

// ─── Angpao Received (sent to host) ──────────────────────────────

export function angpaoReceivedEmail(data: {
  hostName: string;
  eventTitle: string;
  amount: string;
  currency: string;
  senderName: string;
  message: string | null;
  isAnonymous: boolean;
  dashboardUrl: string;
}) {
  const sender = data.isAnonymous ? "Someone (anonymous)" : data.senderName;

  return {
    subject: `🧧 You received ${data.currency} ${data.amount} — ${data.eventTitle}`,
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size: 24px; margin-bottom: 8px;">🧧 Angpao Received!</h1>
        <p style="color: #525252; margin-bottom: 24px;">
          Hi ${data.hostName}, you just received a digital angpao.
        </p>

        <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 14px; color: #525252;">Amount</p>
          <p style="margin: 0 0 12px; font-size: 28px; font-weight: bold; color: #DC2626;">${data.currency} ${data.amount}</p>
          <p style="margin: 0 0 4px; font-size: 14px; color: #525252;">From: <strong>${sender}</strong></p>
          ${data.message ? `<p style="margin: 8px 0 0; font-size: 13px; color: #737373; font-style: italic;">"${data.message}"</p>` : ""}
        </div>

        <a href="${data.dashboardUrl}" style="${buttonStyle}">View All Angpao</a>

        <div style="${footerStyle}">
          <p>Sent by <strong>Surat</strong> — Event platform for Southeast Asia</p>
        </div>
      </div>
    `,
  };
}

// ─── Photo Unlock Confirmation (sent to guest) ───────────────────

export function photoUnlockEmail(data: {
  guestName: string;
  eventTitle: string;
  eventUrl: string;
}) {
  return {
    subject: `📸 Gallery unlocked — ${data.eventTitle}`,
    html: `
      <div style="${baseStyle}">
        <h1 style="font-size: 24px; margin-bottom: 8px;">📸 Gallery Unlocked!</h1>
        <p style="color: #525252; margin-bottom: 24px;">
          Hi ${data.guestName}, you now have unlimited access to all photos from <strong>${data.eventTitle}</strong>.
        </p>

        <p style="color: #525252; margin-bottom: 24px;">
          You can download individual photos or grab them all as a ZIP file.
        </p>

        <a href="${data.eventUrl}" style="${buttonStyle}">Download Photos</a>

        <div style="${footerStyle}">
          <p>Sent by <strong>Surat</strong> — Event platform for Southeast Asia</p>
        </div>
      </div>
    `,
  };
}
