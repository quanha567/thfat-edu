import { BrandLogo } from "@/components/brand";
import { GraduationCap, Users } from "lucide-react";

export function LoginHero() {
  return (
    <div className="bg-primary-950 relative hidden min-h-screen w-full flex-col justify-between overflow-hidden p-10 lg:flex lg:w-1/2 xl:p-14">
      {/* Background image & gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{
          backgroundImage: "url('/images/login-teacher-hero.jpg')",
        }}
      />
      <div className="from-primary-950 via-primary-950/80 absolute inset-0 bg-gradient-to-r via-40% to-transparent" />
      <div className="bg-primary-500/20 absolute -bottom-24 -left-24 size-96 rounded-full blur-3xl" />

      {/* Top Header / Brand */}
      <div className="relative z-10">
        <BrandLogo slogan="Học Hóa · Học Thật · Truyền Cảm Hứng" />
      </div>

      {/* Center Headline & Value Proposition */}
      <div className="relative z-10 my-auto py-12">
        <h1 className="text-h1 xl:text-display font-extrabold tracking-tight text-white">
          Bứt phá điểm số
          <span className="text-highlight mt-1 block">Chinh phục môn Hóa</span>
        </h1>
        <p className="text-body text-primary-100/90 mt-4 max-w-lg leading-relaxed">
          Hệ thống luyện thi V-SAT môn Hóa học với ngân hàng câu hỏi chất lượng, bài giảng chuyên
          sâu và lộ trình học tối ưu, giúp bạn tự tin chinh phục kỳ thi.
        </p>
      </div>

      {/* Bottom Glassmorphic Stats */}
      <div className="relative z-10 grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
          <div className="bg-highlight/20 text-highlight flex size-11 shrink-0 items-center justify-center rounded-xl">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <div className="text-h2 font-bold text-white">96.8%</div>
            <div className="text-caption text-primary-200/90">Học viên đạt điểm 8+ sau 3 tháng</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-md">
          <div className="bg-highlight/20 text-highlight flex size-11 shrink-0 items-center justify-center rounded-xl">
            <Users className="size-6" />
          </div>
          <div>
            <div className="text-h2 font-bold text-white">15.000+</div>
            <div className="text-caption text-primary-200/90">
              Câu hỏi & phân tích theo năng lực
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
