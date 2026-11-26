import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DataTablePagination } from "./data-table-pagination";
import { type TDataTableInstance } from "./data-table.types";

describe("DataTablePagination", () => {
  it("renders correct number of pages when totalCount is provided without table", () => {
    const html = renderToStaticMarkup(
      <DataTablePagination pageIndex={1} pageSize={10} totalCount={45} itemName="mục" />,
    );

    // Should display total items info
    expect(html).toContain("Hiển thị");
    expect(html).toContain("45");

    // 45 items with pageSize 10 should yield 5 pages: [1, 2, 3, 4, 5]
    expect(html).toContain(">1<");
    expect(html).toContain(">2<");
    expect(html).toContain(">5<");
  });

  it("calculates total pages correctly when table with manualPagination is passed", () => {
    // Simulate table instance from useReactTable({ manualPagination: true }) where getPageCount returns 1 because data only has 10 items
    const mockTable = {
      getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
      getFilteredRowModel: () => ({ rows: new Array(10) }),
      getPageCount: () => 1,
      setPageIndex: () => undefined,
      setPageSize: () => undefined,
    } as unknown as TDataTableInstance<{ id: string }>;

    const html = renderToStaticMarkup(
      <DataTablePagination
        table={mockTable}
        pageIndex={1}
        pageSize={10}
        totalCount={50}
        itemName="mục"
      />,
    );

    // totalCount is 50, pageSize is 10. There should be 5 pages (buttons 1, 2, 3, 4, 5), not just 1!
    expect(html).toContain(">5<");
  });

  it("handles zero items gracefully", () => {
    const html = renderToStaticMarkup(
      <DataTablePagination pageIndex={1} pageSize={10} totalCount={0} itemName="mục" />,
    );

    expect(html).toContain("0 – 0");
    expect(html).toContain(
      'trong tổng số <strong class="text-foreground font-semibold">0</strong> mục',
    );
  });

  it("renders middle page range and ellipsis when many pages exist", () => {
    const html = renderToStaticMarkup(
      <DataTablePagination pageIndex={5} pageSize={10} totalCount={100} itemName="mục" />,
    );

    // Page 5 of 10 pages -> [1, "...", 4, 5, 6, "...", 10]
    expect(html).toContain(">1<");
    expect(html).toContain(">4<");
    expect(html).toContain(">5<");
    expect(html).toContain(">6<");
    expect(html).toContain(">10<");
  });
});
