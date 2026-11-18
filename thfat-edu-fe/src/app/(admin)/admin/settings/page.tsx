import { AdminPageHeader } from "@/components/layout/admin";
import { ExamSettingsForm } from "@/features/settings";

export const metadata = {
  title: "Cấu hình | ThFat Edu Admin",
  description: "Quy chế khảo thí và tham số vận hành hệ thống",
};

export default function AdminSettingsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Cấu hình"
        description="Quy chế khảo thí và tham số vận hành hệ thống"
      />
      <div className="w-full">
        <ExamSettingsForm />
      </div>
    </div>
  );
}
