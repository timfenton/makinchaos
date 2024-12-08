ALTER TABLE "products" RENAME COLUMN "status" TO "size";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "qty" numeric(10, 0);--> statement-breakpoint
ALTER TABLE "public"."filaments" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."filament_categories";--> statement-breakpoint
CREATE TYPE "public"."filament_categories" AS ENUM('glitter', 'silk', 'tri_color', 'duo_color', 'shimmer', 'solid', 'rainbow');--> statement-breakpoint
ALTER TABLE "public"."filaments" ALTER COLUMN "category" SET DATA TYPE "public"."filament_categories" USING "category"::"public"."filament_categories";--> statement-breakpoint
ALTER TABLE "public"."orders" ALTER COLUMN "order_paid" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."paid";--> statement-breakpoint
CREATE TYPE "public"."paid" AS ENUM('order_paid', 'not_paid', 'needs_price');--> statement-breakpoint
ALTER TABLE "public"."orders" ALTER COLUMN "order_paid" SET DATA TYPE "public"."paid" USING "order_paid"::"public"."paid";