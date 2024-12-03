ALTER TABLE "filaments" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "filaments" RENAME COLUMN "imageUrl" TO "image_url";--> statement-breakpoint
ALTER TABLE "filaments" RENAME COLUMN "buyUrl" TO "buy_url";--> statement-breakpoint
ALTER TABLE "fonts" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "fonts" RENAME COLUMN "imageUrl" TO "image_url";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "customerId" TO "customer_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "orderPaid" TO "order_paid";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "petsName" TO "pets_name";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "facebookId" TO "facebook_id";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_facebookId_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "firstName";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "lastName";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_facebookId_unique" UNIQUE("facebook_id");