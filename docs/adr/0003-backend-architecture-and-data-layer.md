# Kiến trúc Backend, Data Layer, Vercel Services và Chiến lược Xác thực

Chúng ta quyết định thiết lập `thfat-edu-be` trên Bun runtime sử dụng framework ElysiaJS theo mô hình Feature-based Modular, tích hợp với cấu trúc Vercel Services Monorepo, kết hợp PostgreSQL + Drizzle ORM làm data layer và cơ chế xác thực kép (Local JWT với HttpOnly Cookie + Google OAuth 2.0 via `arctic`).

## Considered Options

**Option A — ElysiaJS + Feature-based Modules + Drizzle ORM + Vercel Services (chosen):**

- **Runtime & Web Framework**: Bun kết hợp ElysiaJS (`^1.4.x`) tận dụng tốc độ tối đa của Bun HTTP, TypeBox schema validation và kết nối Type-safe sang frontend qua Eden Treaty.
- **Tổ chức mã nguồn**: Cấu trúc Feature-based Modular (`src/modules/<feature>`), mỗi module đóng gói routes, service, schema riêng dưới dạng Elysia plugin độc lập.
- **Vercel Services Monorepo**: Triển khai theo cấu trúc `vercel.json` đa dịch vụ (root rewrite `/api/*` tới `thfat-edu-be`, `/*` tới `thfat-edu-fe`). Backend export default app cho Vercel Serverless Function và chỉ chạy `app.listen(3001)` khi dev độc lập ngoài Vercel.
- **Data Layer & Serverless Pooling**: PostgreSQL kết hợp Drizzle ORM (`drizzle-orm` + `postgres.js`). Cấu hình connection pool linh hoạt (`max: process.env.VERCEL ? 1 : 10`) tương thích tốt với môi trường serverless vô trạng thái.
- **Xác thực (Authentication)**:
  - Mô hình 3 bảng dữ liệu: `users` (thông tin người dùng), `accounts` (credentials / OAuth providers), `refresh_tokens` (quản lý phiên và thu hồi token).
  - Dual JWT (Access Token ngắn hạn + Refresh Token xoay vòng trong HttpOnly Cookie) qua `@elysiajs/jwt` và `Bun.password`.
  - Google OAuth 2.0 chuẩn Authorization Code Flow với PKCE/State sử dụng thư viện `arctic` v3.7, hỗ trợ dynamic redirect URI cho local, preview và production.

**Option B — NestJS / Express + Prisma + Serverful VPS:**

- Kiến trúc OOP đa tầng truyền thống. Khó tận dụng Vercel Services, startup time chậm hơn trên Bun, Prisma client nặng hơn và cần quản lý hạ tầng máy chủ riêng.

**Option C — Supabase BaaS thuần:**

- Ủy quyền toàn bộ DB và Auth cho dịch vụ ngoài. Tiết kiệm công đoạn ban đầu nhưng tạo sự phụ thuộc (vendor lock-in) và hạn chế khả năng tùy biến sâu logic chấm thi, xếp hạng và bảo mật học sinh.

## Why Option A

1. **Hiệu năng & Đồng bộ Type toàn diện**: Bun + Elysia cung cấp tốc độ phản hồi cực cao, Eden Treaty giúp frontend Next.js thừa hưởng toàn bộ kiểu dữ liệu backend mà không cần sinh code thủ công (code generation).
2. **Vercel Services loại bỏ CORS ở Production**: Nhờ Vercel reverse proxy ở tầng gateway, cả Frontend và Backend chạy chung một domain (Origin duy nhất). Cookie HttpOnly hoạt động như First-party Cookie, triệt tiêu hoàn toàn rủi ro bảo mật và phiền toái CORS.
3. **Drizzle ORM & Serverless Pooling nhẹ và linh hoạt**: Drizzle tiếp cận dạng SQL-first, không sinh binary ẩn, tương thích hoàn hảo với Bun và Vercel Serverless.
4. **Kiểm soát xác thực toàn diện**: Mô hình 3 bảng tách biệt giúp ThFat Edu dễ dàng hỗ trợ cả tài khoản email/mật khẩu và tài khoản mạng xã hội (Google, Apple sau này) mà không phá vỡ tính toàn vẹn dữ liệu.

## Consequences

- Mọi module mới trong backend phải tuân thủ mẫu plugin Elysia và đăng ký vào app router trung tâm.
- Việc kiểm thử, định dạng và linting (`bun:test`, `oxlint`, `oxfmt`) được đưa vào quy trình CI chung của root repository.
- Khi kết nối DB trên môi trường Vercel production/preview, bắt buộc sử dụng Connection Pooler (như PgBouncer / Supabase Pooler port 6543 / Neon) để tránh cạn kiệt connection.
