ALTER TABLE "services" RENAME COLUMN "budget" TO "budget_amount";--> statement-breakpoint
ALTER TABLE "tasks" RENAME COLUMN "budget" TO "budget_amount";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name_ar" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "title_en" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "title_ar" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "title_en" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "icon" varchar;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "image" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;