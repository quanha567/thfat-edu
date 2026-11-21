"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

import type { TProfileFormValues } from "../schemas/profile.schema";

export function ProfileTeacherFields() {
  const form = useFormContext<TProfileFormValues>();

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        Hồ sơ Giáo viên
      </h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="teacherCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Mã giáo viên</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: GV001"
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Khoa / Tổ bộ môn</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: Tổ Tự Nhiên - Hóa Học"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Tiểu sử / Giới thiệu</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Giới thiệu chuyên môn ngắn..."
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
