# Structured logging với pino và AsyncLocalStorage

Backend dùng `pino` ghi log JSON một dòng ra stdout (Vercel Runtime Logs), không tích hợp dịch vụ log ngoài ở giai đoạn này. `requestId` và `userId` của request hiện tại đi qua `AsyncLocalStorage` và được `pino` `mixin` gắn tự động vào mọi dòng log, kể cả trong service, nên service không nhận logger hay context qua tham số (repo giới hạn tối đa 3 tham số mỗi hàm). Logger nằm ở `src/config/logger.ts`, request log và `requestId` ở `src/middlewares/request-logger.ts`.

## Considered Options

- **Truyền logger theo request vào từng hàm service:** bị loại vì làm chữ ký hàm phình ra và phải sửa mọi service. Đừng "sửa" `AsyncLocalStorage` thành truyền tham số.
- **Wrapper mỏng quanh `console`:** không có redact, child logger hay level theo môi trường.
- **Dịch vụ log ngoài (Sentry, Axiom, Better Stack):** hoãn lại. JSON trên stdout dễ forward sang log drain sau này mà không phải sửa code gọi logger.

## Consequences

- Không log body, query string, PII (email, họ tên) hay nội dung đề, đáp án, bài làm. Chỉ log `userId` (uuid). Danh sách trường bị redact nằm trong `logger.ts`.
- Mọi response có header `x-request-id`, mọi body lỗi có trường `requestId`. Body lỗi chưa theo RFC 7807 nhất quán, việc đó làm riêng.
- `userId` chỉ có sau khi `AuthService.login` hoặc `getCurrentUser` chạy, nên dòng log trước bước xác thực không có `userId`.
- `enterWith` được gọi ở `onRequest`. Đã kiểm tra trên Bun: 3 request song song không lẫn context. Chưa kiểm chứng riêng trên Vercel service.
- `no-console` là `error` cho toàn bộ `thfat-edu-be`. Dùng `createModuleLogger("<module>")`.
