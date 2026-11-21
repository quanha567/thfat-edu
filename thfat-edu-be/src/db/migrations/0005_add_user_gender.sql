DO $$ BEGIN
 CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gender" "user_gender";
