# CSS Custom Property token architecture cho design system

Chúng ta quyết định định nghĩa toàn bộ design token dưới dạng CSS custom properties (`--primary-*`, `--neutral-*`, `--success-*`, v.v.) trong `globals.css` thay vì mở rộng Tailwind config (`tailwind.config.ts`).

## Considered Options

**Option A — CSS custom properties (chosen):** Định nghĩa primitive scale và semantic tokens trong `:root {}` của `globals.css`. Tailwind v4 đọc các biến này qua `@theme inline`. Component và utility classes tham chiếu đến semantic token.

**Option B — Tailwind config extension:** Thêm màu vào `theme.extend.colors` trong `tailwind.config.ts`. Tailwind generate utility classes tương ứng (`bg-primary-700`, `text-neutral-500`).

## Why Option A

Tailwind v4 đã dịch chuyển sang CSS-first configuration; `@theme inline` là cơ chế chính thức để map CSS variables vào utility classes. Việc dùng CSS custom properties cho phép shadcn/ui component đọc token qua `var()` mà không cần Tailwind class, nhất quán với cách shadcn/ui hoạt động natively. Ngoài ra, semantic token (`--color-primary: var(--primary-700)`) tách biệt khỏi primitive value, cho phép thay màu brand mà không sửa component code.

## Consequences

Mọi token mới phải được khai báo trong `globals.css` trước khi dùng trong component. Không được hardcode giá trị màu hay kích thước — luôn tham chiếu qua `var(--token-name)` hoặc Tailwind utility tương ứng.
