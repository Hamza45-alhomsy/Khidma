ALTER TYPE "public"."user_role" ADD VALUE 'superadmin' BEFORE 'admin';--> statement-breakpoint
CREATE TABLE "landing_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"display_order" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "landing_categories_category_id_unique" UNIQUE("category_id"),
	CONSTRAINT "landing_categories_display_order_unique" UNIQUE("display_order")
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "image" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" varchar(700);--> statement-breakpoint
ALTER TABLE "landing_categories" ADD CONSTRAINT "landing_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;