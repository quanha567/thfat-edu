"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TAuthUser } from "@/features/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { profileSchema, type TProfileFormValues } from "../schemas/profile.schema";
import { ProfileStudentFields } from "./profile-student-fields";
import { ProfileTeacherFields } from "./profile-teacher-fields";

type TProfileEditFormProps = {
  user: TAuthUser;
};

function formatInitialDateOfBirth(dob: unknown): string | null {
  if (!dob) return null;
  if (dob instanceof Date) {
    return isNaN(dob.getTime()) ? null : dob.toISOString().slice(0, 10);
  }
  if (typeof dob === "string") {
    return dob.slice(0, 10);
  }

  return null;
}

function buildDefaultValues(user: TAuthUser): TProfileFormValues {
  return {
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? "",
    gender: user.gender ?? null,
    // Student
    studentCode: user.studentProfile?.studentCode ?? null,
    grade: user.studentProfile?.grade ?? null,
    schoolName: user.studentProfile?.schoolName ?? null,
    dateOfBirth: formatInitialDateOfBirth(user.studentProfile?.dateOfBirth),
    parentPhone: user.studentProfile?.parentPhone ?? null,
    // Teacher
    teacherCode: user.teacherProfile?.teacherCode ?? null,
    department: user.teacherProfile?.department ?? null,
    bio: user.teacherProfile?.bio ?? null,
  };
}

export function ProfileEditForm({ user }: TProfileEditFormProps) {
  const updateProfile = useUpdateProfile();

  const form = useForm<TProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: buildDefaultValues(user),
  });

  function onSubmit(values: TProfileFormValues) {
    updateProfile.mutate({ values, role: user.role });
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Common fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      Họ và tên <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>URL ảnh đại diện</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      value={field.value ?? "unspecified"}
                      onValueChange={(val) => {
                        field.onChange(val === "unspecified" ? null : val);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unspecified">Chưa cập nhật</SelectItem>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role-specific fields */}
            {user.role === "student" && <ProfileStudentFields />}
            {user.role === "teacher" && <ProfileTeacherFields />}
            {user.role === "admin" && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm text-neutral-500 dark:text-neutral-400">
                Vai trò Quản trị viên không yêu cầu bổ sung thông tin hồ sơ.
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={updateProfile.isPending || !form.formState.isDirty}
                className="min-w-[140px]"
              >
                {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
