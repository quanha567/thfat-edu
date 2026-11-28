CREATE SEQUENCE "public"."quiz_code_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "quizzes" ADD COLUMN "code" varchar(16);--> statement-breakpoint
-- Gán mã VSAT-0001, 0002, ... cho các đề hiện có theo thứ tự tạo (kể cả đề đã xóa mềm).
UPDATE "quizzes" q SET "code" = 'VSAT-' || lpad(r."n"::text, 4, '0')
FROM (
  SELECT "id", row_number() OVER (ORDER BY "created_at", "id") AS "n" FROM "quizzes"
) r
WHERE q."id" = r."id";--> statement-breakpoint
-- Đề tiếp theo sẽ nhận số kế tiếp.
SELECT setval('"public"."quiz_code_seq"', (SELECT count(*) FROM "quizzes") + 1, false);--> statement-breakpoint
ALTER TABLE "quizzes" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_code_unique" UNIQUE("code");
