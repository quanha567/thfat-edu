import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardPodium } from "./leaderboard-podium";

describe("LeaderboardPodium", () => {
  const mockTop3: TLeaderboardItem[] = [
    {
      rank: 1,
      userId: "u1",
      fullName: "Nguyễn Văn Nhất",
      avatarUrl: null,
      schoolName: "THPT Chuyên Hà Nội",
      totalScore: 99.5,
      totalExams: 12,
      totalDurationSeconds: 4200,
    },
    {
      rank: 2,
      userId: "u2",
      fullName: "Trần Thị Nhì",
      avatarUrl: null,
      schoolName: "THPT Lê Hồng Phong",
      totalScore: 95.0,
      totalExams: 10,
      totalDurationSeconds: 4500,
    },
  ];

  it("renders top students names and scores", () => {
    const html = renderToStaticMarkup(<LeaderboardPodium topItems={mockTop3} />);
    expect(html).toContain("Nguyễn Văn Nhất");
    expect(html).toContain("Trần Thị Nhì");
    expect(html).toContain("99.5");
    expect(html).toContain("95");
  });
});
