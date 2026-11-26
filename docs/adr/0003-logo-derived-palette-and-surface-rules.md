# Palette bám logo và quy tắc bề mặt cho logo

Giữ cobalt đậm (`--primary-700`) làm màu chính, nhưng các màu còn lại lấy theo logo và phối quanh nó: gold dịch hue 82 → ~70 (vàng cam như ngôi sao), neutral nhuộm xanh hue 258, cyan là Glow Accent, thêm `info`. Logo bản màu chỉ đặt trên Logo-safe Surface; dark mode được thiết kế riêng (không đảo từ light).

## Considered Options

**A — Chỉ nhuộm neutral, giữ nguyên gold/primary:** ít đổi nhất nhưng gold hue 82 vẫn đục trên nền trắng và logo vẫn chìm trên nền xanh trung bình.

**B — Palette bám logo + quy tắc bề mặt (chosen):** sửa gốc thay vì vá từng chỗ (halo trắng/cyan quanh logo).

**C — Đổi màu thương hiệu mới:** loại vì logo và nhận diện hiện tại đã dùng cobalt.

## Why B

Quyết định khó đảo ngược (token đi vào toàn bộ UI) và dễ gây thắc mắc về sau ("sao gold không phải #C9A448 / sao logo không đặt lên nút xanh?"). Cobalt trung bình trùng độ sáng với logo nên logo chìm; tách "logo-safe" khỏi "interactive" giải quyết được mà không đổi nhận diện.

## Consequences

- WCAG 2.2 AA là cổng bắt buộc cho các cặp semantic; test `tokens-contrast.test.ts` tính trên sRGB đã render. APCA chỉ tham khảo.
- Gold làm chữ trên nền sáng phải từ `gold-700`.
- Shadow nhẹ hoặc đổi nền; không shadow đậm.
- Hero/navbar phải đặt logo trên `surface-dark` hoặc `surface-dark-mid`.
