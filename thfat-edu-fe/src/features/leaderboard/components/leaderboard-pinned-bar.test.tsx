import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardPinnedBar } from "./leaderboard-pinned-bar";

describe("LeaderboardPinnedBar", () => {
  const myRank: TLeaderboardItem = {
    rank: 42,
    userId: "my-id",
    fullName: "Học Viên A",
    avatarUrl: null,
    schoolName: "THPT Chuyên",
    totalScore: 78.5,
    totalExams: 5,
    totalDurationSeconds: 2100,
  };

  it("renders current user rank and score in sticky bar", () => {
    const html = renderToStaticMarkup(<LeaderboardPinnedBar myRank={myRank} />);
    expect(html).toContain("#42");
    expect(html).toContain("78.5");
    expect(html).toContain("Học Viên A");
  });

  it("renders null when myRank is null", () => {
    const html = renderToStaticMarkup(<LeaderboardPinnedBar myRank={null} />);
    expect(html).toBe("");
  });
});
