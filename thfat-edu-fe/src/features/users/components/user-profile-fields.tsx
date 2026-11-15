import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { type TStudentProfileInput, type TTeacherProfileInput, type TUserRole } from "../types";

export type TUserProfileFieldsProps = {
  role: TUserRole;
  studentProfile: TStudentProfileInput;
  teacherProfile: TTeacherProfileInput;
  onStudentProfileChange: (fields: Partial<TStudentProfileInput>) => void;
  onTeacherProfileChange: (fields: Partial<TTeacherProfileInput>) => void;
};

export function UserProfileFields({
  role,
  studentProfile,
  teacherProfile,
  onStudentProfileChange,
  onTeacherProfileChange,
}: TUserProfileFieldsProps) {
  if (role === "admin") {
    return (
      <div className="bg-muted/40 rounded-lg p-3 text-xs text-neutral-500">
        Vai trò Quản trị viên không yêu cầu bổ sung thông tin hồ sơ học tập hay giảng dạy.
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="space-y-3 rounded-lg border border-neutral-200 p-3.5 dark:border-neutral-800">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Hồ sơ Giáo viên
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="teacherCode" className="text-xs">
              Mã giáo viên
            </Label>
            <Input
              id="teacherCode"
              placeholder="VD: GV001"
              value={teacherProfile.teacherCode ?? ""}
              onChange={(e) => onTeacherProfileChange({ teacherCode: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-xs">
              Khoa / Tổ bộ môn
            </Label>
            <Input
              id="department"
              placeholder="VD: Tổ Tự Nhiên - Hóa Học"
              value={teacherProfile.department ?? ""}
              onChange={(e) => onTeacherProfileChange({ department: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-xs">
            Tiểu sử / Giới thiệu
          </Label>
          <Textarea
            id="bio"
            rows={2}
            placeholder="Giới thiệu chuyên môn ngắn..."
            value={teacherProfile.bio ?? ""}
            onChange={(e) => onTeacherProfileChange({ bio: e.target.value })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 p-3.5 dark:border-neutral-800">
      <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Hồ sơ Học sinh
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="studentCode" className="text-xs">
            Mã học sinh
          </Label>
          <Input
            id="studentCode"
            placeholder="VD: HS2026-001"
            value={studentProfile.studentCode ?? ""}
            onChange={(e) => onStudentProfileChange({ studentCode: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="grade" className="text-xs">
            Khối / Lớp
          </Label>
          <Input
            id="grade"
            placeholder="VD: 12A1"
            value={studentProfile.grade ?? ""}
            onChange={(e) => onStudentProfileChange({ grade: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="schoolName" className="text-xs">
            Trường học
          </Label>
          <Input
            id="schoolName"
            placeholder="VD: THPT Chuyên..."
            value={studentProfile.schoolName ?? ""}
            onChange={(e) => onStudentProfileChange({ schoolName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth" className="text-xs">
            Ngày sinh (YYYY-MM-DD)
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={studentProfile.dateOfBirth ?? ""}
            onChange={(e) => onStudentProfileChange({ dateOfBirth: e.target.value })}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="parentPhone" className="text-xs">
            Số điện thoại phụ huynh
          </Label>
          <Input
            id="parentPhone"
            placeholder="VD: 0912345678"
            value={studentProfile.parentPhone ?? ""}
            onChange={(e) => onStudentProfileChange({ parentPhone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
