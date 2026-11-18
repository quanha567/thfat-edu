export type TNavigationItem = {
  label: string;
  href: string;
  active?: boolean;
  isResourceDropdown?: boolean;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export type THomeStat = {
  value: string;
  label: string;
  subLabel?: string;
  iconName: "GraduationCap" | "Users" | "Trophy";
  iconSrc?: string;
  countUp?: {
    end: number;
    decimals?: number;
    suffix?: string;
    prefix?: string;
    useDotSeparator?: boolean;
    countdownFrom?: number;
    finalText?: string;
  };
};

export type TFeatureItem = {
  id: string;
  title: string;
  description: string;
  iconName: "FileText" | "BarChart3" | "Target" | "Award";
  accent: "blue" | "purple" | "rose" | "amber";
  href: string;
  imageSrc?: string;
};

export type TLeaderboardStudent = {
  id: string;
  rank: 1 | 2 | 3;
  name: string;
  school: string;
  score: number;
  avatarText: string;
  avatarUrl?: string;
};

export type TExamMetric = {
  label: string;
  detail: string;
  iconName: "Calendar" | "Clock" | "CheckSquare" | "TrendingUp";
};

export const HOME_NAV_LINKS: TNavigationItem[] = [
  { label: "Trang chủ", href: "/", active: true },
  { label: "Bảng xếp hạng", href: "/leaderboard" },
  { label: "Thi thử", href: "/exams" },
  {
    label: "Tài nguyên",
    href: "/articles",
    isResourceDropdown: true,
  },
];

export const HOME_STATS: THomeStat[] = [
  {
    value: "96.8%",
    label: "Học viên đạt điểm",
    subLabel: "8+ sau 3 tháng",
    iconName: "GraduationCap",
    iconSrc: "/images/home/stat-cap-3d.png",
    countUp: {
      end: 96.8,
      decimals: 1,
      suffix: "%",
    },
  },
  {
    value: "15.000+",
    label: "Học sinh tin tưởng",
    iconName: "Users",
    iconSrc: "/images/home/stat-users-3d.png",
    countUp: {
      end: 15000,
      decimals: 0,
      suffix: "+",
      useDotSeparator: true,
    },
  },
  {
    value: "Top đầu",
    label: "Thí sinh đạt điểm cao",
    iconName: "Trophy",
    iconSrc: "/images/home/stat-trophy-3d.png",
    countUp: {
      end: 1,
      prefix: "Top ",
      countdownFrom: 50,
      finalText: "Top đầu",
    },
  },
];

export const HOME_FEATURES: TFeatureItem[] = [
  {
    id: "v-sat-exam",
    title: "Thi thử V-SAT",
    description: "Đề thi bám sát cấu trúc và định dạng mới nhất",
    iconName: "FileText",
    accent: "blue",
    href: "/exams",
    imageSrc: "/images/home/feature-exam-3d.png",
  },
  {
    id: "performance-analytics",
    title: "Phân tích năng lực",
    description: "Biết điểm mạnh, yếu để học đúng trọng tâm",
    iconName: "BarChart3",
    accent: "purple",
    href: "/analytics",
    imageSrc: "/images/home/feature-analytics-3d.png",
  },
  {
    id: "topic-practice",
    title: "Luyện tập theo chủ đề",
    description: "Hệ thống câu hỏi đa dạng, phân loại rõ ràng",
    iconName: "Target",
    accent: "rose",
    href: "/practice",
    imageSrc: "/images/home/feature-target-3d.png",
  },
  {
    id: "student-honor",
    title: "Vinh danh học sinh",
    description: "Cùng tỏa sáng và khẳng định bản thân",
    iconName: "Award",
    accent: "amber",
    href: "/leaderboard",
    imageSrc: "/images/home/feature-trophy-3d.png",
  },
];

export const HOME_ABOUT_DATA = {
  tagline: "Về ThFat Edu",
  title: "Luyện thi thông minh",
  subtitle: "Kiến tạo tương lai",
  description:
    "ThFat Edu mang đến giải pháp luyện thi V-SAT hiện đại, ứng dụng công nghệ tiên tiến, giúp học sinh ôn luyện hiệu quả, đánh giá chính xác và chinh phục ước mơ đại học.",
  ctaText: "Tìm hiểu thêm",
  ctaHref: "/about",
  imageSrc: "/images/home/chemistry-flask-3d.png",
};

export const HOME_LEADERBOARD_DATA = {
  title: "Bảng vinh danh",
  subtitle: "Những gương mặt xuất sắc trong kỳ thi V-SAT",
  viewAllHref: "/leaderboard",
  students: [
    {
      id: "std-1",
      rank: 1,
      name: "Nguyễn Minh Anh",
      school: "THPT Chuyên Lý Tự Trọng",
      score: 29.8,
      avatarText: "MA",
      avatarUrl: "/images/home/avatar-student-1.png",
    },
    {
      id: "std-2",
      rank: 2,
      name: "Trần Gia Huy",
      school: "THPT Phan Ngọc Hiển",
      score: 29.6,
      avatarText: "GH",
      avatarUrl: "/images/home/avatar-student-2.png",
    },
    {
      id: "std-3",
      rank: 3,
      name: "Lê Thảo Vy",
      school: "THPT Châu Văn Liêm",
      score: 29.4,
      avatarText: "TV",
      avatarUrl: "/images/home/avatar-student-3.png",
    },
  ] satisfies TLeaderboardStudent[],
};

export const HOME_EXAM_INFO_DATA = {
  tagline: "Thông tin kỳ thi V-SAT",
  title: "Cấu trúc đề thi đánh giá đầu vào V-SAT",
  ctaText: "Tìm hiểu chi tiết",
  ctaHref: "/exam-structure",
  metrics: [
    {
      label: "8 môn thi",
      detail: "Toán, Lý, Hóa, Sinh, Anh, Sử, Địa, Văn",
      iconName: "Calendar",
    },
    {
      label: "60 đến 90 phút",
      detail: "Thời gian làm bài",
      iconName: "Clock",
    },
    {
      label: "4 dạng câu hỏi",
      detail: "Đúng/sai, ghép đôi, nhiều lựa chọn, trả lời ngắn",
      iconName: "CheckSquare",
    },
    {
      label: "150 điểm",
      detail: "Tổng điểm tối đa",
      iconName: "TrendingUp",
    },
  ] satisfies TExamMetric[],
};

export const HOME_CTA_DATA = {
  title: "Kiểm tra năng lực với\nđề thi thử V-SAT",
  description: "Làm quen với cấu trúc câu hỏi, áp lực thời gian và hệ thống chấm điểm tự động.",
  ctaText: "Làm bài thi thử",
  ctaHref: "/exams",
  imageSrc: "/images/home/rocket-3d.jpg",
};

export const HOME_FOOTER_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Bảng xếp hạng", href: "/leaderboard" },
  { label: "Thi thử", href: "/exams" },
  { label: "Tài nguyên", href: "/articles" },
  { label: "Liên hệ", href: "/contact" },
];
