import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import EventPageClient from "./event-page-client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, coverImage: true },
  });

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description ?? `Join us for ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description ?? `Join us for ${event.title}`,
      images: event.coverImage ? [event.coverImage] : [],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      host: { select: { fullName: true } },
      _count: { select: { rsvps: true } },
    },
  });

  if (!event || event.status === "removed") notFound();

  return <EventPageClient event={event} />;
}
