import {
  Atom,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Info,
  Layers,
  Palette,
  Sparkles,
  Type,
  type LucideIcon,
} from "lucide-react";

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type TColorScale = {
  name: string;
  key: string;
  desc: string;
};

export const COLOR_SCALES: TColorScale[] = [
  { name: "Primary", key: "primary", desc: "Brand navy blue — #1C3480" },
  { name: "Neutral", key: "neutral", desc: "Gray scale — text, borders, backgrounds" },
  { name: "Success", key: "success", desc: "Correct answers & success states" },
  { name: "Warning", key: "warning", desc: "Warnings & caution states" },
  { name: "Error", key: "error", desc: "Wrong answers & error states" },
];

export const SEMANTIC_TOKENS = [
  { token: "--primary", label: "Primary" },
  { token: "--secondary", label: "Secondary" },
  { token: "--muted", label: "Muted" },
  { token: "--accent", label: "Accent" },
  { token: "--destructive", label: "Destructive" },
  { token: "--background", label: "Background" },
  { token: "--border", label: "Border" },
  { token: "--ring", label: "Ring" },
] as const;

export type TTypeScaleItem = {
  cls: string;
  label: string;
  spec: string;
  sample: string;
};

export const TYPE_SCALE: TTypeScaleItem[] = [
  {
    cls: "text-display",
    label: "Display",
    spec: "3rem · 700 · 1.1",
    sample: "Chinh phục mọi kỳ thi",
  },
  { cls: "text-h1", label: "H1", spec: "2.25rem · 700 · 1.2", sample: "Học Hóa Học Hiệu Quả" },
  { cls: "text-h2", label: "H2", spec: "1.875rem · 600 · 1.3", sample: "Luyện đề trắc nghiệm" },
  { cls: "text-h3", label: "H3", spec: "1.5rem · 600 · 1.35", sample: "Chủ đề: Nguyên tử & Ion" },
  {
    cls: "text-body-lg",
    label: "Body LG",
    spec: "1.125rem · 400 · 1.6",
    sample:
      "Hệ thống bài tập được thiết kế để giúp học sinh nắm vững kiến thức hóa học một cách hiệu quả.",
  },
  {
    cls: "text-body",
    label: "Body",
    spec: "1rem · 400 · 1.6",
    sample:
      "Nền tảng ThFat Edu cung cấp hàng nghìn câu hỏi luyện thi được phân loại theo chủ đề và mức độ khó.",
  },
  {
    cls: "text-body-sm",
    label: "Body SM",
    spec: "0.875rem · 400 · 1.5",
    sample:
      "Cập nhật ngân hàng câu hỏi thường xuyên theo chuẩn chương trình giáo dục phổ thông mới.",
  },
  {
    cls: "text-label",
    label: "Label",
    spec: "0.875rem · 500 · 1.4",
    sample: "Môn học · Hóa học 12",
  },
  {
    cls: "text-caption",
    label: "Caption",
    spec: "0.75rem · 400 · 1.4",
    sample: "Cập nhật lần cuối: 3 giờ trước",
  },
];

export type TNavSection = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_SECTIONS: TNavSection[] = [
  { id: "brand", label: "Logo & Brand", icon: Atom },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "chemistry", label: "Chemistry & Math", icon: FlaskConical },
  { id: "buttons", label: "Buttons", icon: Sparkles },
  { id: "forms", label: "Forms", icon: Layers },
  { id: "feedback", label: "Feedback", icon: CheckCircle2 },
  { id: "surfaces", label: "Surfaces", icon: BookOpen },
  { id: "overlays", label: "Overlays", icon: Info },
  { id: "navigation", label: "Navigation", icon: ChevronRight },
  { id: "data", label: "Data Display", icon: GraduationCap },
];
