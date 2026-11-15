export type TNavigationItem = {
  label: string;
  href: string;
  active?: boolean;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export type THomeStat = {
  value: string;
  label: string;
  iconName: "GraduationCap" | "Users" | "Trophy";
};

export type TFeatureItem = {
  id: string;
  title: string;
  description: string;
  iconName: "FileText" | "BarChart3" | "Target" | "Award";
  accent: "blue" | "purple" | "rose" | "amber";
  href: string;
};

export type TLeaderboardStudent = {
  id: string;
  rank: 1 | 2 | 3;
  name: string;
  school: string;
  score: number;
  avatarText: string;
};

export type TExamMetric = {
  label: string;
  detail: string;
  iconName: "Calendar" | "Clock" | "CheckSquare" | "TrendingUp";
};

export const HOME_NAV_LINKS: TNavigationItem[] = [
  { label: "Trang chủ", href: "/", active: true },
  { label: "Giới thiệu", href: "/about" },
  { label: "Vinh danh", href: "/leaderboard" },
  { label: "Thi thử", href: "/exams" },
  {
    label: "Tài nguyên",
    href: "/resources",
    children: [
      { label: "Cấu trúc đề thi & Công thức Hóa học", href: "/resources/formulas" },
      { label: "Bộ đề thi thử V-SAT có giải thích", href: "/resources/past-papers" },
      { label: "Mẹo làm bài & Chiến lược đạt điểm 9+", href: "/resources/tips" },
    ],
  },
];

export const HOME_STATS: THomeStat[] = [
  {
    value: "96.8%",
    label: "Học viên đạt điểm 8+ sau 3 tháng",
    iconName: "GraduationCap",
  },
  {
    value: "15.000+",
    label: "Câu hỏi ôn luyện chất lượng",
    iconName: "Users",
  },
  {
    value: "Top đầu",
    label: "Thí sinh đạt điểm cao",
    iconName: "Trophy",
  },
];

export const HOME_FEATURES: TFeatureItem[] = [
  {
    id: "v-sat-exam",
    title: "Thi thử chuẩn V-SAT",
    description: "Đề thi bám sát cấu trúc và định dạng mới nhất",
    iconName: "FileText",
    accent: "blue",
    href: "/exams",
  },
  {
    id: "performance-analytics",
    title: "Phân tích năng lực",
    description: "Biết điểm mạnh, yếu để học đúng trọng tâm",
    iconName: "BarChart3",
    accent: "purple",
    href: "/analytics",
  },
  {
    id: "topic-practice",
    title: "Luyện tập theo chủ đề",
    description: "Hệ thống câu hỏi đa dạng, phân loại rõ ràng",
    iconName: "Target",
    accent: "rose",
    href: "/practice",
  },
  {
    id: "student-honor",
    title: "Vinh danh học sinh",
    description: "Cùng tỏa sáng và khẳng định bản thân",
    iconName: "Award",
    accent: "amber",
    href: "/leaderboard",
  },
];

export const HOME_ABOUT_DATA = {
  tagline: "Về ThFat Edu",
  title: "Luyện thi thông minh",
  subtitle: "Kiến tạo tương lai",
  description:
    "ThFat Edu mang đến giải pháp luyện thi V-SAT hiện đại, ứng dụng công nghệ tiên tiến, giúp học sinh ôn luyện hiệu quả, đánh giá chính xác và chinh phục ước mơ đại học.",
  ctaText: "Khám phá thêm",
  ctaHref: "/about",
  imageSrc: "/images/home/chemistry-flask-3d.jpg",
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
    },
    {
      id: "std-2",
      rank: 2,
      name: "Trần Gia Huy",
      school: "THPT Phan Ngọc Hiển",
      score: 29.6,
      avatarText: "GH",
    },
    {
      id: "std-3",
      rank: 3,
      name: "Lê Thảo Vy",
      school: "THPT Châu Văn Liêm",
      score: 29.4,
      avatarText: "TV",
    },
  ] satisfies TLeaderboardStudent[],
};

export const HOME_EXAM_INFO_DATA = {
  tagline: "Thông tin kỳ thi V-SAT",
  title: "Nắm vững cấu trúc – Tự tin làm bài",
  ctaText: "Tìm hiểu chi tiết",
  ctaHref: "/exam-structure",
  metrics: [
    {
      label: "8 môn thi",
      detail: "Toán, Lý, Hóa, Sinh, Anh, Sử, Địa, Văn",
      iconName: "Calendar",
    },
    {
      label: "60 – 90 phút",
      detail: "Thời gian làm bài",
      iconName: "Clock",
    },
    {
      label: "4 dạng câu hỏi",
      detail: "Đúng/Sai, Ghép hợp, MCQs, Trả lời ngắn",
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
  title: "Sẵn sàng chinh phục\nkỳ thi V-SAT?",
  description: "Bắt đầu luyện tập ngay hôm nay để đạt kết quả tốt nhất!",
  ctaText: "Thi thử ngay",
  ctaHref: "/exams",
  imageSrc: "/images/home/rocket-3d.jpg",
};

export const HOME_FOOTER_LINKS = [
  { label: "Giới thiệu", href: "/about" },
  { label: "Vinh danh", href: "/leaderboard" },
  { label: "Câu hỏi thường gặp", href: "/faq" },
  { label: "Liên hệ", href: "/contact" },
];
