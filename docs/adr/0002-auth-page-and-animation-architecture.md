# Kiến trúc trang xác thực (Auth Page) và Animation Strategy

Chúng ta quyết định xây dựng trang xác thực (`/login`) theo mô hình split-screen 2 cột (Hero visual + Form tương tác), kết hợp thư viện Framer Motion để tạo chuyển động vi mô (micro-interactions), hiệu ứng chuyển cảnh mềm mại và tôn vinh ngôn ngữ nhận diện thương hiệu ThFat Edu.

## Considered Options

**Option A — Split-screen Hero & Form kết hợp Framer Motion (chosen):**

- Cột bên trái hiển thị hình ảnh giáo dục/phòng thí nghiệm hóa học chân thực với lớp phủ gradient nhận diện thương hiệu (`--primary-950` đến `--primary-700`), hiệu ứng orb phát sáng động, cùng các thẻ chỉ số xã hội (social proof float cards).
- Cột bên phải tập trung form đăng nhập, hỗ trợ Google OAuth (phía trên), ngăn cách bởi divider và form nhập email/mật khẩu, tích hợp `react-hook-form` + `zod` để hiển thị lỗi inline theo token `--error-*`.
- Sử dụng Framer Motion cho entrance animation, nút bấm phản hồi khi nhấn (`whileTap`), chuyển động thẻ nổi (`float`), và chuyển cảnh alert inline.

**Option B — Centered Single Card với CSS Keyframes:**

- Đặt form trong một card nằm giữa màn hình, hiệu ứng animation dựa hoàn toàn vào CSS `@keyframes`.

## Why Option A

1. **Trải nghiệm thị giác vượt trội**: ThFat Edu hướng tới nhóm học sinh ôn thi THPT/HSA, nơi sự tin cậy, cảm hứng học tập và tính chuyên nghiệp là yếu tố then chốt. Cột hero visual cùng ảnh chân thực kết hợp các chỉ số thành tích (96.8% điểm 8+, 12.000+ câu hỏi) giúp gia tăng độ tin cậy ngay từ điểm chạm đầu tiên.
2. **Khả năng kiểm soát animation mượt mà**: `framer-motion` cung cấp API trực quan cho việc stagger animation, exit animations thông qua `AnimatePresence` (cho phép thông báo lỗi bung ra và thu vào tự nhiên mà không gây giật layout), đồng thời tối ưu hóa GPU compositor.
3. **Tuân thủ chặt chẽ Design System**: Toàn bộ hệ màu tuân thủ CSS token layer đã thống nhất tại ADR 0001 (`--primary-*`, `--neutral-*`, `--error-*`), kiểu chữ Be Vietnam Pro cùng type-scale semantic (`text-display`, `text-h1`, `text-body-sm`, v.v.).

## Consequences

- Dự án bổ sung dependency `framer-motion`.
- Trên thiết bị di động (< 1024px), panel bên trái tự động ẩn để nhường trọn không gian cho form đăng nhập và logo thương hiệu ở đỉnh trang, tối ưu thời gian thao tác cho học sinh.
