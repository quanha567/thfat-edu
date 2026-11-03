# Hướng dẫn Thiết lập & Triển khai Vercel Services (Deployment Guide)

Tài liệu này hướng dẫn chi tiết quy trình thiết lập Continuous Deployment (CD) cho repository **`thfat-edu`** lên **Vercel Services** (dự án đơn nhất với đa dịch vụ: Frontend Next.js + Backend ElysiaJS) thông qua **GitHub Actions**.

---

## 1. Kiến trúc Tổng quan (Vercel Services)

Monorepo được triển khai như một **Vercel Project duy nhất** sử dụng tính năng **Vercel Services**:

| Service Name       | Thư mục Root   | Framework | Trạng thái truy cập   | Mount Path / Routing                                       |
| :----------------- | :------------- | :-------- | :-------------------- | :--------------------------------------------------------- |
| **`thfat-edu-fe`** | `thfat-edu-fe` | `nextjs`  | **Public**            | `/(.*)` (Trang chủ & ứng dụng web)                         |
| **`thfat-edu-be`** | `thfat-edu-be` | `elysia`  | **Public & Internal** | • Public: `/api/(.*)`<br>• Internal: Binding `BACKEND_URL` |

### Service Bindings:

- Service `thfat-edu-fe` được liên kết với `thfat-edu-be` thông qua Service Binding.
- Vercel tự động inject URL nội bộ của `thfat-edu-be` vào biến môi trường `BACKEND_URL` tại runtime trong Serverless Functions của Frontend.

---

## 2. Vô hiệu hóa Auto Build trên Vercel (Disabled Auto Deployments)

Để đảm bảo quy trình kiểm soát chất lượng nghiêm ngặt (chỉ deploy khi CI lint/test/typecheck/scan hoàn toàn vượt qua), cơ chế tự động build khi push Git trên Vercel đã được **tắt hoàn toàn** trong file `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

- Vercel sẽ **không** tự động tạo deployment khi bạn push commit lên bất kỳ nhánh nào hoặc mở Pull Request.
- Toàn bộ quá trình build và deploy sẽ được điều phối **100% bởi GitHub Actions** (`.github/workflows/cd.yml`) thông qua Vercel CLI sau khi workflow CI thành công.

---

## 3. Bước 1: Tạo Project trên Vercel Dashboard

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard).
2. Nhấn **Add New...** $\rightarrow$ **Project**.
3. Chọn repository `thfat-edu`.
4. **Cấu hình:**
   - **Project Name:** `thfat-edu` (hoặc tên tùy chọn).
   - **Root Directory:** Giữ nguyên thư mục gốc `.` (không đổi sang thư mục con).
5. Vercel sẽ tự động đọc file `vercel.json` ở root để nhận diện cấu trúc đa dịch vụ (`services`) và vô hiệu hóa auto deploy.
6. Nhấn **Deploy** (hoặc Save).

---

## 4. Bước 2: Lấy thông tin Credentials từ Vercel

Bạn chỉ cần thu thập **3 thông số**:

### 1. `VERCEL_TOKEN`

- Tạo tại [Vercel Tokens Settings](https://vercel.com/account/tokens).

### 2. `VERCEL_ORG_ID`

- Lấy tại [Vercel Account Settings](https://vercel.com/account) (mục **Your ID**).

### 3. `VERCEL_PROJECT_ID`

- Vào project vừa tạo trên Vercel Dashboard $\rightarrow$ **Settings** $\rightarrow$ **General** $\rightarrow$ sao chép **Project ID** (`prj_...`).

---

## 5. Bước 3: Cấu hình GitHub Repository Secrets

Vào GitHub Repo $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ thêm 3 secrets:

| Tên Secret          | Mô tả                     |
| :------------------ | :------------------------ |
| `VERCEL_TOKEN`      | Token xác thực Vercel CLI |
| `VERCEL_ORG_ID`     | Team ID hoặc User ID      |
| `VERCEL_PROJECT_ID` | ID của dự án Vercel chung |

---

## 6. Kiểm thử tại máy Local (`vercel dev`)

Nhờ cấu trúc Vercel Services, bạn có thể chạy đồng thời cả Frontend và Backend bằng một lệnh duy nhất:

```bash
vercel dev
```

Lệnh này sẽ tự động khởi chạy cả 2 dịch vụ, thiết lập proxy routing `/api` và inject biến môi trường `BACKEND_URL` mô phỏng môi trường production.
