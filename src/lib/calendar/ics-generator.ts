interface IcsEventInput {
  title: string;
  description?: string | null;
  location?: string;
  startDate: Date;
  durationMinutes?: number;
  url?: string | null;
}

export function generateIcs(event: IcsEventInput): string {
  const { title, description, location, startDate, durationMinutes = 60, url } = event;

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Surat//Event Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `DTSTAMP:${formatDate(now)}`,
    `UID:${crypto.randomUUID()}@surat.app`,
    `SUMMARY:${escapeIcsText(title)}`,
  ];

  if (location) {
    lines.push(`LOCATION:${escapeIcsText(location)}`);
  }

  if (description) {
    lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
  }

  if (url) {
    lines.push(`URL:${url}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
