# ThFat Edu

Nền tảng luyện thi & thi thử trực tuyến môn Hóa học dành cho học sinh lớp 12 và thí sinh tự do, xây dựng theo phương pháp và lộ trình của Thầy Fat.

## Language

**Design System**:
Tập hợp token, component, và hướng dẫn sử dụng tạo nên ngôn ngữ visual nhất quán của ThFat Edu. Bao gồm CSS token layer, branded components, và trang `/design`.
_Avoid_: UI kit, component library, style guide

**Token**:
Một CSS custom property (`--property-name`) mang giá trị nguyên thủy (màu sắc, khoảng cách, font-size) và được dùng thống nhất xuyên suốt codebase thay vì hardcode giá trị.
_Avoid_: variable, CSS variable, design variable

**Primitive Token**:
Token ở lớp thấp nhất định nghĩa giá trị cụ thể trong một scale — ví dụ `--primary-500: oklch(0.57 0.24 256)`. Không nên dùng trực tiếp trong component.
_Avoid_: raw token, base token

**Semantic Token**:
Token tham chiếu đến một primitive token và mang ý nghĩa use-case — ví dụ `--color-primary: var(--primary-700)`. Đây là token component nên dùng.
_Avoid_: alias token, reference token

**Primary Scale**:
Dải 11 sắc độ của xanh cobalt đậm thương hiệu (hue ~258, `--primary-50` đến `--primary-950`), dùng làm màu chính trong toàn bộ UI. Bậc nhạt (50–200) có chroma thấp để dùng cho mảng lớn trên nền sáng.

**Neutral Scale**:
Dải 11 sắc độ của màu xám pha xanh nhẹ theo hue thương hiệu (`--neutral-50` đến `--neutral-950`), dùng cho text, border, và background.

**Status Colors**:
Bốn nhóm màu ngữ nghĩa phản hồi trạng thái: `--success-*` (xanh lá), `--warning-*` (vàng amber), `--error-*` (đỏ), `--info-*` (xanh lam hue ~235, chỉ khai báo các bậc đang dùng). Dùng trong feedback UI như thông báo đúng/sai câu trả lời.
_Avoid_: feedback colors, state colors

**Type Scale**:
Hệ thống 9 cấp typography semantic: `display`, `h1`, `h2`, `h3`, `body-lg`, `body`, `body-sm`, `label`, `caption`. Mỗi cấp định nghĩa font-size, font-weight, và line-height.
_Avoid_: font scale, text scale

**Brand Color**:
Màu xanh cobalt đậm `--primary-700` (`oklch(0.4 0.22 258)`), dùng cho nút chính, link và chữ nhấn trên nền sáng. Là màu chính của hệ thống; logo ThFat Edu sáng hơn một chút (nằm quanh `--primary-500/600`).

**Accent Color**:
Màu gold hue ~70 (vàng cam, lấy từ ngôi sao trong logo), token `--gold-*` và `--highlight`. Chỉ dùng cho thành tích, xếp hạng và điểm nhấn — không dùng cho trạng thái hay nút chính. Làm chữ trên nền sáng phải dùng `--gold-700` trở lên.
_Avoid_: Decorative Color, màu phụ

**Glow Accent**:
Màu cyan (`--cyan-300/400/500`), hiệu ứng "hóa học/phát sáng". Chỉ dùng trên hero, auth và các bề mặt tối, không dùng cho UI thông thường.

**Logo-safe Surface**:
Bề mặt mà logo bản màu đọc rõ: nền sáng, hoặc nền rất tối (`--surface-dark`, `--surface-dark-mid`). Không đặt logo màu lên mảng `primary-600…800` (logo chìm); ở đó dùng bản logo viền trắng (`logo-white`).

**Primary on Dark**:
Cặp token `--primary-on-dark` / `--primary-on-dark-foreground` (`primary-400`) cho nút và link trên bề mặt tối cố định (hero, auth, sidebar).

**Elevation**:
Độ nổi của bề mặt. Ưu tiên đổi màu nền; shadow (`--elevation-1…3`) chỉ nhẹ và pha màu `primary-950`.

**Design Page**:
Route `/design` trong Next.js app, hiển thị toàn bộ token và component với visual examples. Là nguồn tham chiếu sống (living docs) cho developer và designer.
_Avoid_: Storybook, style guide page, component playground

**Auth Page**:
Trang xác thực tài khoản (`/login`) với kiến trúc split-screen hiển thị hero visual và form tương tác, dùng framer-motion để xử lý micro-interactions và hiệu ứng chuyển cảnh.
_Avoid_: sign-in screen, login view

**Exam Room**:
Màn hình phòng thi trực tuyến với đồng hồ đếm ngược, giao diện tập trung và danh sách câu hỏi trắc nghiệm, mô phỏng kỳ thi thử trên máy tính.
_Avoid_: quiz screen, test page

**Exam Management**:
Khu vực quản trị danh sách đề thi thử, theo dõi số liệu làm bài, tạo mới và cấu hình trạng thái phát hành đề thi trong hệ thống ThFat Edu.
_Avoid_: quiz management, test manager

**Exam Code**:
Định danh rút gọn duy nhất của đề thi (ví dụ `VSAT-0001`), hiển thị trong danh sách quản lý và hỗ trợ tìm kiếm nhanh.
_Avoid_: exam id, quiz id, mã bài thi

**User**:
Học sinh, giáo viên hoặc quản trị viên tham gia vào nền tảng ThFat Edu.
_Avoid_: Account, client, customer

**Account**:
Phương thức liên kết xác thực (mật khẩu nội bộ hoặc nhà cung cấp OAuth như Google) gắn với một User.
_Avoid_: Profile, user credentials

**Guest**:
Người truy cập chưa đăng nhập. Chỉ xem được nội dung công khai (trang chủ, bài viết, chuyên mục, bảng xếp hạng) và không được vào phần thi thử.
_Avoid_: Anonymous user, visitor, khách vãng lai

**Invite Code**:
Mã dùng một lần do quản trị viên phát hành, gửi cho Guest dưới dạng link mời; Guest bấm link để tạo một User có vai trò Student. Giáo viên và quản trị viên không đăng ký bằng mã mà do quản trị viên tạo thủ công. Hiện là đường tự đăng ký duy nhất: Guest không có mã thì không tự tạo được User. Mã hết hạn, đã dùng hoặc bị thu hồi thì không còn hiệu lực.
_Avoid_: Referral code, registration key, mã kích hoạt

**Session**:
Phiên đăng nhập của một User, có thời hạn 7 ngày kể từ lúc đăng nhập. Hết hạn hoặc bị đăng xuất thì User trở lại là Guest.
_Avoid_: Token, login state

**Optional Auth**:
Cách một nội dung công khai phục vụ cả Guest lẫn User đã đăng nhập: Guest xem bản chung, User có Session xem thêm phần riêng của mình (ví dụ thứ hạng cá nhân trên bảng xếp hạng).
_Avoid_: Soft auth, anonymous-friendly

**Student**:
User có vai trò học sinh, là người duy nhất làm bài thi thử. Hiển thị trên giao diện là "Học sinh".
_Avoid_: Learner, trainee

**Mock Exam**:
Đề thi thử mà Student làm trong Exam Room. Bắt buộc đã đăng nhập mới xem danh sách, bắt đầu, nộp bài và xem kết quả.
_Avoid_: Quiz, test, bài kiểm tra

**Exam Policy**:
Bộ quy tắc về số lần làm bài, cách tính điểm khi thi nhiều lần, thời gian nghỉ giữa các lần, thời điểm công bố điểm và thời điểm xem lời giải. Có một Exam Policy mặc định toàn hệ thống do quản trị viên đặt.
_Avoid_: Exam settings, quy định thi, cấu hình đề

**Exam Policy Override**:
Giá trị riêng của một Mock Exam cho một quy tắc trong Exam Policy; khi có thì thắng giá trị mặc định toàn hệ thống. Đổi Exam Policy mặc định có hiệu lực ngay với mọi Mock Exam không có override.
_Avoid_: Quiz setting, cấu hình riêng

**Site Info**:
Thông tin nhận diện và liên hệ của ThFat Edu hiển thị công khai cho mọi người (tên site, slogan, email liên hệ, liên kết mạng xã hội). Do quản trị viên chỉnh ở trang Cấu hình.
_Avoid_: Site settings, thông tin chung
