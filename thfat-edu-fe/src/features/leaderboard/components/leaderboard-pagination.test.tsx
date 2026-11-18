import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LeaderboardPagination } from "./leaderboard-pagination";

describe("LeaderboardPagination", () => {
  it("renders page info summary correctly", () => {
    const html = renderToStaticMarkup(
      <LeaderboardPagination
        page={1}
        limit={10}
        total={248}
        onPageChange={() => undefined}
      />,
    );
    expect(html).toContain("Hiển thị");
    expect(html).toContain("1");
    expect(html).toContain("10");
    expect(html).toContain("248");
  });
});
