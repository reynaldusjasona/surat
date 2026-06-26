-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('host', 'photographer', 'admin');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('wedding', 'birthday', 'gathering', 'custom');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('attending', 'not_attending', 'maybe', 'pending');

-- CreateEnum
CREATE TYPE "UploaderRole" AS ENUM ('photographer', 'guest');

-- CreateEnum
CREATE TYPE "PassType" AS ENUM ('apple', 'google');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "host_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "location_url" TEXT,
    "description" TEXT,
    "cover_image_url" TEXT,
    "slug" TEXT NOT NULL,
    "features_enabled" JSONB NOT NULL DEFAULT '{}',
    "guest_capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rsvp_status" "RsvpStatus" NOT NULL DEFAULT 'pending',
    "plus_ones" JSONB,
    "dietary_notes" TEXT,
    "rsvp_at" TIMESTAMP(3),

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "angpao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_email" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SGD',
    "message" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "is_thanked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "angpao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registry_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "url" TEXT,
    "image_url" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "purchased_by_name" TEXT,
    "purchased_by_email" TEXT,
    "is_anonymous_purchase" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "uploader_id" UUID NOT NULL,
    "uploader_role" "UploaderRole" NOT NULL,
    "file_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "file_size" INTEGER,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_unlocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "guest_email" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SGD',

    CONSTRAINT "photo_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_passes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "pass_type" "PassType" NOT NULL,
    "pass_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_passes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_host_id_idx" ON "events"("host_id");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "guests_event_id_idx" ON "guests"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_event_id_email_key" ON "guests"("event_id", "email");

-- CreateIndex
CREATE INDEX "angpao_event_id_idx" ON "angpao"("event_id");

-- CreateIndex
CREATE INDEX "registry_items_event_id_idx" ON "registry_items"("event_id");

-- CreateIndex
CREATE INDEX "photos_event_id_idx" ON "photos"("event_id");

-- CreateIndex
CREATE INDEX "photos_uploader_id_idx" ON "photos"("uploader_id");

-- CreateIndex
CREATE INDEX "photo_unlocks_event_id_idx" ON "photo_unlocks"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "photo_unlocks_event_id_guest_email_key" ON "photo_unlocks"("event_id", "guest_email");

-- CreateIndex
CREATE INDEX "wallet_passes_event_id_idx" ON "wallet_passes"("event_id");

-- CreateIndex
CREATE INDEX "wallet_passes_guest_id_idx" ON "wallet_passes"("guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_passes_event_id_guest_id_pass_type_key" ON "wallet_passes"("event_id", "guest_id", "pass_type");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "angpao" ADD CONSTRAINT "angpao_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registry_items" ADD CONSTRAINT "registry_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_unlocks" ADD CONSTRAINT "photo_unlocks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_passes" ADD CONSTRAINT "wallet_passes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_passes" ADD CONSTRAINT "wallet_passes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

