CREATE TYPE "public"."filament_categories" AS ENUM('glitter', 'silk', 'tri_color', 'duo_color', 'shimmer', 'solid', 'rainbows');--> statement-breakpoint
CREATE TYPE "public"."paid" AS ENUM('paid', 'not_paid', 'needs_price');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_providerAccountId_provider_pk" PRIMARY KEY("providerAccountId","provider")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "filaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"isActive" boolean DEFAULT true,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text NOT NULL,
	"buyUrl" text,
	"stock" integer DEFAULT 1 NOT NULL,
	"tags" text[],
	"category" "filament_categories" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "filaments_to_products" (
	"product_id" integer NOT NULL,
	"filament_id" integer NOT NULL,
	CONSTRAINT "filaments_to_products_product_id_filament_id_pk" PRIMARY KEY("product_id","filament_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fonts" (
	"id" serial PRIMARY KEY NOT NULL,
	"isActive" boolean DEFAULT true,
	"name" text NOT NULL,
	"imageUrl" text NOT NULL,
	"tags" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fonts_to_products" (
	"product_id" integer NOT NULL,
	"font_id" integer NOT NULL,
	CONSTRAINT "fonts_to_products_product_id_font_id_pk" PRIMARY KEY("product_id","font_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerId" integer NOT NULL,
	"status" "status" NOT NULL,
	"orderPaid" "paid" NOT NULL,
	"price" numeric(10, 2),
	"submitted" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" NOT NULL,
	"price" numeric(10, 2),
	"description" text NOT NULL,
	"petsName" text,
	"font" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products_to_orders" (
	"product_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"qty" integer DEFAULT 1,
	CONSTRAINT "products_to_orders_product_id_order_id_pk" PRIMARY KEY("product_id","order_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"name" text,
	"roles" "role"[] DEFAULT '{"customer"}',
	"facebookId" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_facebookId_unique" UNIQUE("facebookId"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "filaments_to_products" ADD CONSTRAINT "filaments_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "filaments_to_products" ADD CONSTRAINT "filaments_to_products_filament_id_filaments_id_fk" FOREIGN KEY ("filament_id") REFERENCES "public"."filaments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fonts_to_products" ADD CONSTRAINT "fonts_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fonts_to_products" ADD CONSTRAINT "fonts_to_products_font_id_fonts_id_fk" FOREIGN KEY ("font_id") REFERENCES "public"."fonts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_to_orders" ADD CONSTRAINT "products_to_orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_to_orders" ADD CONSTRAINT "products_to_orders_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
