import { openapi } from "@elysiajs/openapi";

export function scalarDocsPlugin(prefix = "") {
  return openapi({
    path: `${prefix}/docs`,
    specPath: `${prefix}/docs/json`,
    documentation: {
      info: {
        title: "ThFat Edu API",
        version: "1.0.0",
        description:
          "Tài liệu tương tác API chính thức của nền tảng học tập trực tuyến ThFat Edu. Được cung cấp bởi ElysiaJS và Scalar.",
      },
      tags: [
        {
          name: "System",
          description: "Kiểm tra trạng thái hệ thống và giám sát hoạt động",
        },
      ],
    },
    scalar: {
      theme: "purple",
      showSidebar: true,
    },
  });
}
