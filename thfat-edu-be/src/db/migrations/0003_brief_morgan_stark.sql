CREATE TABLE "system_settings" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"category" varchar(64) NOT NULL,
	"description" text,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "max_attempts" integer;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "score_policy" varchar(32);--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "cooldown_minutes" integer;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "show_score_immediately" boolean;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "show_explanation_policy" varchar(32);--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;