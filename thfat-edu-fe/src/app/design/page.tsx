"use client";

import {
  AlertCircle,
  Atom,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  Layers,
  Palette,
  Sparkles,
  Type,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/* ── helpers ── */
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const colorScales: { name: string; key: string; desc: string }[] = [
  { name: "Primary", key: "primary", desc: "Brand navy blue — #1C3480" },
  { name: "Neutral", key: "neutral", desc: "Gray scale — text, borders, backgrounds" },
  { name: "Success", key: "success", desc: "Correct answers & success states" },
  { name: "Warning", key: "warning", desc: "Warnings & caution states" },
  { name: "Error", key: "error", desc: "Wrong answers & error states" },
];

const typeScale = [
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

const navSections = [
  { id: "brand", label: "Logo & Brand", icon: Atom },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Buttons", icon: Sparkles },
  { id: "forms", label: "Forms", icon: Layers },
  { id: "feedback", label: "Feedback", icon: CheckCircle2 },
  { id: "surfaces", label: "Surfaces", icon: BookOpen },
  { id: "overlays", label: "Overlays", icon: Info },
  { id: "navigation", label: "Navigation", icon: ChevronRight },
  { id: "data", label: "Data Display", icon: GraduationCap },
];

/* ── Section wrapper ── */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-h2 text-neutral-900">{title}</h2>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  );
}

/* ── Demo block ── */
function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-label text-neutral-500">{label}</p>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
export default function DesignPage() {
  const [sliderValue, setSliderValue] = useState([60]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkValue, setCheckValue] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-auto border-r border-neutral-200 bg-neutral-50 lg:block">
        {/* Brand */}
        <div className="border-b border-neutral-200 px-6 py-5">
          <p className="text-label tracking-widest text-neutral-500 uppercase">ThFat Edu</p>
          <p className="text-h3 text-primary-700 mt-0.5">Design System</p>
        </div>

        {/* Nav */}
        <nav className="space-y-1 p-4">
          {navSections.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-label hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2.5 rounded-lg px-3 py-2 text-neutral-600 transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute right-0 bottom-0 left-0 border-t border-neutral-200 px-6 py-4">
          <p className="text-caption text-neutral-400">v0.1.0 · Nov 2026</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-w-0 flex-1">
        {/* Hero */}
        <div className="from-primary-50 to-primary-100 border-b border-neutral-200 bg-gradient-to-br via-white px-8 py-12">
          <Badge className="bg-primary-100 text-primary-700 border-primary-200 mb-4">
            Design System
          </Badge>
          <h1 className="text-display text-primary-900">ThFat Edu</h1>
          <p className="text-body-lg mt-2 max-w-xl text-neutral-600">
            Token layer, branded components, và hướng dẫn sử dụng cho nền tảng học tập trực tuyến.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
              <span className="bg-primary-700 size-2.5 rounded-full" />
              <span className="text-label text-neutral-700">Be Vietnam Pro</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
              <span className="bg-success-500 size-2.5 rounded-full" />
              <span className="text-label text-neutral-700">No dark mode</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5">
              <span className="bg-warning-500 size-2.5 rounded-full" />
              <span className="text-label text-neutral-700">shadcn/ui</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-16 px-8 py-10">
          {/* ══════════════════════════════════════════════
              BRAND & LOGO ASSETS
          ══════════════════════════════════════════════ */}
          <Section id="brand" title="Brand & Logo Assets">
            <p className="text-body text-neutral-600">
              Hệ thống nhận diện thương hiệu ThFat Edu bao gồm biểu tượng tròn lồng chữ TF, phiên
              bản logo đầy đủ có đường kẻ vàng kim & tagline, cùng phiên bản đảo màu cho nền tối.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Card 1: Logo Icon */}
              <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xs">
                <div className="relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3">
                  <Image
                    src="/brand/logo-icon.png"
                    alt="ThFat Edu Icon"
                    fill
                    sizes="144px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-label font-bold text-neutral-900">Logo Icon / Favicon</p>
                  <p className="text-caption text-neutral-400">Biểu tượng lồng TF hình tròn</p>
                  <p className="text-caption text-primary-700 mt-2 font-mono">
                    /brand/logo-icon.png
                  </p>
                </div>
              </div>

              {/* Card 2: Logo Full */}
              <div className="flex flex-col items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xs">
                <div className="relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3">
                  <Image
                    src="/brand/logo-full.png"
                    alt="ThFat Edu Full Logo"
                    fill
                    sizes="144px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-label font-bold text-neutral-900">Logo Full (Bản chính)</p>
                  <p className="text-caption text-neutral-400">
                    Emblem + Tên + Vạch vàng + Tagline
                  </p>
                  <p className="text-caption text-primary-700 mt-2 font-mono">
                    /brand/logo-full.png
                  </p>
                </div>
              </div>

              {/* Card 3: Logo White (Dark Mode) */}
              <div className="border-primary-800 bg-primary-950 flex flex-col items-center justify-between rounded-2xl border p-6 text-center shadow-xs">
                <div className="bg-primary-900/50 relative mb-4 flex size-36 items-center justify-center overflow-hidden rounded-xl p-3">
                  <Image
                    src="/brand/logo-white.png"
                    alt="ThFat Edu Dark Mode Logo"
                    fill
                    sizes="144px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-label font-bold text-white">Logo Inverted (Nền tối)</p>
                  <p className="text-caption text-primary-200">Trắng & Vàng kim trên nền Navy</p>
                  <p className="text-caption text-primary-300 mt-2 font-mono">
                    /brand/logo-white.png
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              COLORS
          ══════════════════════════════════════════════ */}
          <Section id="colors" title="Colors">
            <div className="space-y-8">
              {colorScales.map(({ name, key, desc }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <p className="text-label text-neutral-900">{name}</p>
                    <p className="text-caption text-neutral-400">{desc}</p>
                  </div>
                  <div className="grid grid-cols-11 gap-1.5">
                    {shades.map((shade) => (
                      <div key={shade} className="space-y-1.5">
                        <div
                          className="h-10 w-full rounded-lg border border-black/5"
                          style={{ backgroundColor: `var(--${key}-${shade})` }}
                        />
                        <p className="text-caption text-center text-neutral-500">{shade}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Semantic tokens quick ref */}
            <div className="mt-8 space-y-2">
              <p className="text-label text-neutral-500">Semantic Tokens</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  { token: "--primary", label: "Primary" },
                  { token: "--secondary", label: "Secondary" },
                  { token: "--muted", label: "Muted" },
                  { token: "--accent", label: "Accent" },
                  { token: "--destructive", label: "Destructive" },
                  { token: "--background", label: "Background" },
                  { token: "--border", label: "Border" },
                  { token: "--ring", label: "Ring" },
                ].map(({ token, label }) => (
                  <div
                    key={token}
                    className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-3"
                  >
                    <div
                      className="size-8 shrink-0 rounded-md border border-black/10"
                      style={{ backgroundColor: `var(${token})` }}
                    />
                    <div>
                      <p className="text-label text-neutral-900">{label}</p>
                      <p className="text-caption font-mono text-neutral-400">{token}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              TYPOGRAPHY
          ══════════════════════════════════════════════ */}
          <Section id="typography" title="Typography">
            <div className="space-y-1 divide-y divide-neutral-100">
              {typeScale.map(({ cls, label, spec, sample }) => (
                <div
                  key={cls}
                  className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <div className="flex w-32 shrink-0 flex-col gap-0.5">
                    <p className="text-label text-neutral-900">{label}</p>
                    <p className="text-caption font-mono text-neutral-400">.{cls}</p>
                    <p className="text-caption text-neutral-400">{spec}</p>
                  </div>
                  <p className={`${cls} min-w-0 text-neutral-900`}>{sample}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════
              BUTTONS
          ══════════════════════════════════════════════ */}
          <Section id="buttons" title="Buttons">
            <Demo label="Variants">
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </Demo>

            <Demo label="Sizes">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <GraduationCap className="size-4" />
                </Button>
              </div>
            </Demo>

            <Demo label="States">
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button>
                  <Spinner className="mr-2" />
                  Loading...
                </Button>
              </div>
            </Demo>

            <Demo label="Badge">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </Demo>

            <Demo label="Toggle">
              <div className="flex flex-wrap gap-3">
                <Toggle>Bold</Toggle>
                <Toggle variant="outline">Italic</Toggle>
                <Toggle pressed>Pressed</Toggle>
              </div>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              FORMS
          ══════════════════════════════════════════════ */}
          <Section id="forms" title="Forms">
            <Demo label="Input & Label">
              <div className="max-w-sm space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="design-email">Email</Label>
                  <Input id="design-email" type="email" placeholder="hoc.sinh@thfat.edu.vn" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="design-pass">Mật khẩu</Label>
                  <Input id="design-pass" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="design-disabled">Disabled</Label>
                  <Input id="design-disabled" disabled value="Không thể sửa" />
                </div>
              </div>
            </Demo>

            <Demo label="Textarea">
              <div className="max-w-sm space-y-1.5">
                <Label htmlFor="design-textarea">Ghi chú</Label>
                <Textarea id="design-textarea" placeholder="Nhập nội dung ghi chú..." rows={4} />
              </div>
            </Demo>

            <Demo label="Select">
              <div className="max-w-xs space-y-1.5">
                <Label htmlFor="design-select">Môn học</Label>
                <Select>
                  <SelectTrigger id="design-select">
                    <SelectValue placeholder="Chọn môn học..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chem">Hóa học</SelectItem>
                    <SelectItem value="phys">Vật lý</SelectItem>
                    <SelectItem value="bio">Sinh học</SelectItem>
                    <SelectItem value="math">Toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Demo>

            <Demo label="Checkbox & Switch">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="design-check"
                    checked={checkValue}
                    onCheckedChange={(v) => setCheckValue(v === true)}
                  />
                  <Label htmlFor="design-check">Nhớ đăng nhập</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="design-switch"
                    checked={switchValue}
                    onCheckedChange={setSwitchValue}
                  />
                  <Label htmlFor="design-switch">
                    Thông báo email {switchValue ? "(Bật)" : "(Tắt)"}
                  </Label>
                </div>
              </div>
            </Demo>

            <Demo label="Radio Group">
              <RadioGroup defaultValue="hard">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="easy" id="design-easy" />
                  <Label htmlFor="design-easy">Dễ</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="medium" id="design-medium" />
                  <Label htmlFor="design-medium">Trung bình</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="hard" id="design-hard" />
                  <Label htmlFor="design-hard">Khó</Label>
                </div>
              </RadioGroup>
            </Demo>

            <Demo label="Slider">
              <div className="max-w-xs space-y-3">
                <div className="flex justify-between">
                  <Label>Thời gian thi</Label>
                  <span className="text-label text-primary-700">{sliderValue[0]} phút</span>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  min={10}
                  max={120}
                  step={5}
                />
              </div>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              FEEDBACK
          ══════════════════════════════════════════════ */}
          <Section id="feedback" title="Feedback">
            <Demo label="Alert">
              <div className="space-y-3">
                <Alert>
                  <Info className="size-4" />
                  <AlertTitle>Thông tin</AlertTitle>
                  <AlertDescription>Hệ thống sẽ bảo trì lúc 2:00 sáng ngày 5/11.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>
                    Không thể kết nối đến máy chủ. Vui lòng thử lại.
                  </AlertDescription>
                </Alert>
              </div>
            </Demo>

            <Demo label="Progress">
              <div className="max-w-sm space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-label text-neutral-700">Tiến độ học</span>
                    <span className="text-label text-primary-700">72%</span>
                  </div>
                  <Progress value={72} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-label text-neutral-700">Bài tập hoàn thành</span>
                    <span className="text-label text-success-600">48%</span>
                  </div>
                  <Progress value={48} className="[&>div]:bg-success-500" />
                </div>
              </div>
            </Demo>

            <Demo label="Skeleton">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </Demo>

            <Demo label="Spinner">
              <div className="flex items-center gap-6">
                <Spinner />
                <span className="text-body text-neutral-500">Đang tải...</span>
              </div>
            </Demo>

            <Demo label="Kbd">
              <div className="text-body flex flex-wrap items-center gap-2 text-neutral-700">
                <span>Lưu bài:</span>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>S</Kbd>
              </div>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              SURFACES
          ══════════════════════════════════════════════ */}
          <Section id="surfaces" title="Surfaces">
            <Demo label="Card">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Hóa hữu cơ</CardTitle>
                    <CardDescription>Chương 3: Hiđrocacbon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-neutral-600">120 câu hỏi · 4 đề thi thử</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">
                      Luyện tập ngay
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-primary-200 bg-primary-50">
                  <CardHeader>
                    <Badge className="bg-primary-100 text-primary-700 border-primary-200 w-fit">
                      Nổi bật
                    </Badge>
                    <CardTitle className="text-primary-900">Điện ly & Axit – Bazơ</CardTitle>
                    <CardDescription>Kiến thức cốt lõi thi THPT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-primary-700">280 câu hỏi · 8 đề thi thử</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">
                      Luyện tập ngay
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </Demo>

            <Demo label="Avatar">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>HS</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary-100 text-primary-700">NV</AvatarFallback>
                </Avatar>
                <Avatar className="size-8">
                  <AvatarFallback className="text-caption bg-neutral-200 text-neutral-600">
                    +5
                  </AvatarFallback>
                </Avatar>
              </div>
            </Demo>

            <Demo label="Separator">
              <div className="space-y-4">
                <p className="text-body text-neutral-700">Nội dung phía trên</p>
                <Separator />
                <p className="text-body text-neutral-700">Nội dung phía dưới</p>
              </div>
            </Demo>

            <Demo label="Tabs">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="easy">Dễ</TabsTrigger>
                  <TabsTrigger value="hard">Khó</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <p className="text-body pt-2 text-neutral-600">Hiển thị tất cả 280 câu hỏi.</p>
                </TabsContent>
                <TabsContent value="easy">
                  <p className="text-body pt-2 text-neutral-600">Hiển thị 120 câu dễ.</p>
                </TabsContent>
                <TabsContent value="hard">
                  <p className="text-body pt-2 text-neutral-600">Hiển thị 80 câu khó.</p>
                </TabsContent>
              </Tabs>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              OVERLAYS
          ══════════════════════════════════════════════ */}
          <Section id="overlays" title="Overlays">
            <Demo label="Tooltip">
              <div className="flex flex-wrap gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover để xem tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Đây là tooltip hướng dẫn người dùng</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Demo>

            <Demo label="Dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Mở dialog xác nhận</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận nộp bài</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc muốn nộp bài? Còn 3 câu chưa trả lời. Sau khi nộp bạn không thể
                      sửa đáp án.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline">Quay lại</Button>
                    <Button>Nộp bài</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              NAVIGATION
          ══════════════════════════════════════════════ */}
          <Section id="navigation" title="Navigation">
            <Demo label="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Trang chủ</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Hóa học 12</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Điện ly</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Demo>
          </Section>

          {/* ══════════════════════════════════════════════
              DATA DISPLAY
          ══════════════════════════════════════════════ */}
          <Section id="data" title="Data Display">
            <Demo label="Scroll Area">
              <ScrollArea className="h-40 rounded-lg border border-neutral-200 bg-white p-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="border-b border-neutral-100 py-2 last:border-0">
                    <p className="text-body-sm text-neutral-700">
                      <span className="text-label text-primary-700 mr-2">#{i + 1}</span>
                      Câu hỏi về phản ứng oxi hóa khử trong dung dịch axit
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </Demo>
          </Section>
        </div>
      </main>
    </div>
  );
}
