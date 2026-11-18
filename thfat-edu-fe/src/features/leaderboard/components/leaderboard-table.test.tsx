import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardTable } from "./leaderboard-table";

describe("LeaderboardTable", () => {
  const mockItems: TLeaderboardItem[] = [
    {
      rank: 1,
      userId: "u1",
      fullName: "Nguyễn Văn A",
      avatarUrl: null,
      schoolName: "THPT Chuyên Lý Tự Trọng",
      totalScore: 149.25,
      totalExams: 15,
      totalDurationSeconds: 1712,
    },
    {
      rank: 4,
      userId: "u4",
      fullName: "Phạm Hoàng D",
      avatarUrl: null,
      schoolName: "THPT Thực hành Sư phạm",
      totalScore: 146.5,
      totalExams: 12,
      totalDurationSeconds: 1992,
    },
  ];

  it("renders rank, student name, school and score with 2 decimals", () => {
    const html = renderToStaticMarkup(<LeaderboardTable items={mockItems} timeframe="this_week" />);
    expect(html).toContain("Nguyễn Văn A");
    expect(html).toContain("THPT Chuyên Lý Tự Trọng");
    expect(html).toContain("149.25");
    expect(html).toContain("28 phút 32 giây");

    expect(html).toContain("Phạm Hoàng D");
    expect(html).toContain("146.50");
    expect(html).toContain("33 phút 12 giây");
  });

  it("renders empty state when items list is empty", () => {
    const html = renderToStaticMarkup(<LeaderboardTable items={[]} />);
    expect(html).toContain("Chưa có bảng xếp hạng cho khoảng thời gian này.");
  });
});
