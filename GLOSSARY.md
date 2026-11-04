# ThFat Edu

Nền tảng học tập trực tuyến dành cho học sinh Việt Nam, tập trung vào luyện đề và kiểm tra kiến thức.

## Language

**Design System**:
Tập hợp token, component, và hướng dẫn sử dụng tạo nên ngôn ngữ visual nhất quán của ThFat Edu. Bao gồm CSS token layer, branded components, và trang `/design`.
_Avoid_: UI kit, component library, style guide

**Token**:
Một CSS custom property (`--property-name`) mang giá trị nguyên thủy (màu sắc, khoảng cách, font-size) và được dùng thống nhất xuyên suốt codebase thay vì hardcode giá trị.
_Avoid_: variable, CSS variable, design variable

**Primitive Token**:
Token ở lớp thấp nhất định nghĩa giá trị cụ thể trong một scale — ví dụ `--primary-500: oklch(0.48 0.17 263)`. Không nên dùng trực tiếp trong component.
_Avoid_: raw token, base token

**Semantic Token**:
Token tham chiếu đến một primitive token và mang ý nghĩa use-case — ví dụ `--color-primary: var(--primary-700)`. Đây là token component nên dùng.
_Avoid_: alias token, reference token

**Primary Scale**:
Dải 11 sắc độ của màu navy blue thương hiệu (`--primary-50` đến `--primary-950`), dùng làm màu chính trong toàn bộ UI.

**Neutral Scale**:
Dải 11 sắc độ của màu xám (`--neutral-50` đến `--neutral-950`), dùng cho text, border, và background.

**Status Colors**:
Ba nhóm màu ngữ nghĩa phản hồi trạng thái: `--success-*` (xanh lá), `--warning-*` (vàng amber), `--error-*` (đỏ). Dùng trong feedback UI như thông báo đúng/sai câu trả lời.
_Avoid_: feedback colors, state colors

**Type Scale**:
Hệ thống 7 cấp typography semantic: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `body-sm`, `label`, `caption`. Mỗi cấp định nghĩa font-size, font-weight, và line-height.
_Avoid_: font scale, text scale

**Brand Color**:
Màu navy blue `#1C3480` (≈ `oklch(0.33 0.17 263)`) lấy từ logo ThFat Edu. Tương ứng với `--primary-700` trong primary scale.

**Decorative Color**:
Màu gold `#C9A448` từ logo, chỉ xuất hiện trong tài liệu marketing/branding — không phải token trong design system, không dùng trong component.

**Design Page**:
Route `/design` trong Next.js app, hiển thị toàn bộ token và component với visual examples. Là nguồn tham chiếu sống (living docs) cho developer và designer.
_Avoid_: Storybook, style guide page, component playground

**Auth Page**:
Trang xác thực tài khoản (`/login`) với kiến trúc split-screen hiển thị hero visual và form tương tác, dùng framer-motion để xử lý micro-interactions và hiệu ứng chuyển cảnh.
_Avoid_: sign-in screen, login view

**User**:
Học sinh, giáo viên hoặc quản trị viên tham gia vào nền tảng ThFat Edu.
_Avoid_: Account, client, customer

**Account**:
Phương thức liên kết xác thực (mật khẩu nội bộ hoặc nhà cung cấp OAuth như Google) gắn với một User.
_Avoid_: Profile, user credentials
