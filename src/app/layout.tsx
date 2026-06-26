import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surat - Event Platform for Southeast Asia",
  description:
    "All-in-one event management platform. RSVP, digital angpao, gift registry, photo sharing, and wallet passes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
