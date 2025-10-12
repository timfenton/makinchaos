CREATE TABLE IF NOT EXISTS "material_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"categories" text[],
	"tags" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"buy_url" text,
	"stock" integer DEFAULT 1 NOT NULL,
	"tags" text[],
	"categories" text[] NOT NULL,
	"material_type_id" integer NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"modified" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materials_to_products" (
	"product_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	CONSTRAINT "materials_to_products_product_id_material_id_pk" PRIMARY KEY("product_id","material_id")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "pets_name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "pets_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "size" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "size" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "qty" SET DATA TYPE smallint;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "qty" SET DEFAULT 1;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials_to_products" ADD CONSTRAINT "materials_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materials_to_products" ADD CONSTRAINT "materials_to_products_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "font";