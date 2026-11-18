import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StudentExamEmptyState } from "./student-exam-empty-state";

describe("StudentExamEmptyState", () => {
  it("renders system-wide empty state with CTAs when no filters are active", () => {
    const html = renderToStaticMarkup(<StudentExamEmptyState hasActiveFilter={false} />);

    expect(html).toContain("Phòng thi đang chuẩn bị đề mới");
    expect(html).toContain("Đọc bài viết ôn tập");
    expect(html).toContain("/articles");
    expect(html).toContain("Xem Bảng xếp hạng");
    expect(html).toContain("/leaderboard");
  });

  it("renders filter empty state with reset button when filter is active", () => {
    const html = renderToStaticMarkup(
      <StudentExamEmptyState hasActiveFilter={true} onResetFilters={() => {}} />,
    );

    expect(html).toContain("Không tìm thấy đề thi phù hợp");
    expect(html).toContain("Xóa bộ lọc &amp; Xem tất cả");
  });
});
