export const siteConfig = {
  name: "TH FAT EDU",
  titleTemplate: "%s | TH FAT EDU",
  defaultTitle: "TH FAT EDU - Nền Tảng Học & Khảo Thí Hóa Học Trực Tuyến",
  description:
    "Hệ thống luyện thi trắc nghiệm Hóa học hiện đại, bài viết chuyên sâu về Hóa học phổ thông và đề thi chất lượng cao.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thfat-edu.vercel.app",
  ogImage: "/brand/logo-full.png",
  keywords: [
    "Hóa học",
    "Luyện thi Hóa học",
    "Trắc nghiệm Hóa",
    "Đề thi Hóa THPT",
    "ThFat Edu",
    "Bảng tuần hoàn",
    "Hóa vô cơ",
    "Hóa hữu cơ",
  ],
  author: {
    name: "ThFat Edu Team",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://thfat-edu.vercel.app",
  },
} as const;

export type TSiteConfig = typeof siteConfig;
