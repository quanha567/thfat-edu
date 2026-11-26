-- Dọn dữ liệu trùng trước khi tạo unique index.
-- Giữ lại bản ghi mới nhất của mỗi cặp (attempt_id, sub_item_id).
DELETE FROM "exam_answers" a USING "exam_answers" b
WHERE a."attempt_id" = b."attempt_id" AND a."sub_item_id" = b."sub_item_id"
  AND (a."updated_at", a."id") < (b."updated_at", b."id");--> statement-breakpoint
-- Mỗi (quiz, user) chỉ giữ 1 lượt đang làm: các lượt cũ hơn chuyển sang 'abandoned'.
UPDATE "exam_attempts" a SET "status" = 'abandoned'
WHERE a."status" = 'in_progress' AND EXISTS (
  SELECT 1 FROM "exam_attempts" b
  WHERE b."quiz_id" = a."quiz_id" AND b."user_id" = a."user_id" AND b."status" = 'in_progress'
    AND (b."created_at", b."id") > (a."created_at", a."id")
);--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_expires_at" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_quiz_questions_section_id" ON "quiz_questions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "idx_quiz_sections_quiz_id" ON "quiz_sections" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "idx_quiz_sub_items_question_id" ON "quiz_sub_items" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_exam_answers_attempt_sub_item" ON "exam_answers" USING btree ("attempt_id","sub_item_id");--> statement-breakpoint
CREATE INDEX "idx_exam_answers_sub_item_id" ON "exam_answers" USING btree ("sub_item_id");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_quiz_user" ON "exam_attempts" USING btree ("quiz_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_exam_attempts_user_id" ON "exam_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_exam_attempts_one_in_progress" ON "exam_attempts" USING btree ("quiz_id","user_id") WHERE "exam_attempts"."status" = 'in_progress';