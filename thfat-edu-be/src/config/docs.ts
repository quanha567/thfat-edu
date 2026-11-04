import { openapi } from "@elysiajs/openapi";

export const scalarDocsPlugin = (prefix = "") =>
  openapi({
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
          name: "Auth",
          description:
            "Xác thực, phân quyền và phiên đăng nhập (Credentials & Google OAuth 2.0 PKCE)",
        },
        {
          name: "System",
          description: "Kiểm tra trạng thái hệ thống và giám sát hoạt động",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT Access Token được trả về sau khi đăng nhập/đăng ký",
          },
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "refreshToken",
            description: "HttpOnly Refresh Token cookie xoay vòng",
          },
        },
      },
    },
    scalar: {
      theme: "purple",
      showSidebar: true,
    },
  });
