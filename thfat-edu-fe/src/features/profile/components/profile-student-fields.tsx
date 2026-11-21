"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { TProfileFormValues } from "../schemas/profile.schema";

const CALENDAR_START_MONTH = new Date(1990, 0);
const CALENDAR_END_MONTH = new Date();

function parseSafeDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      const parsed = parseISO(trimmed);

      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      const fallback = new Date(trimmed);

      return isNaN(fallback.getTime()) ? undefined : fallback;
    }
  }

  return undefined;
}

export function ProfileStudentFields() {
  const form = useFormContext<TProfileFormValues>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateOfBirthValue = form.watch("dateOfBirth");
  const selectedDate = parseSafeDate(dateOfBirthValue);

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        Hồ sơ Học sinh
      </h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Mã học sinh</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: HS2026-001"
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
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Khối / Lớp</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: 12A1"
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
          name="schoolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Trường học</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: THPT Chuyên..."
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Ngày sinh</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {selectedDate
                        ? format(selectedDate, "dd/MM/yyyy", { locale: vi })
                        : "Chọn ngày sinh"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : null);
                      setCalendarOpen(false);
                    }}
                    captionLayout="dropdown"
                    startMonth={CALENDAR_START_MONTH}
                    endMonth={CALENDAR_END_MONTH}
                    defaultMonth={selectedDate}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentPhone"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="text-sm">Số điện thoại phụ huynh</FormLabel>
              <FormControl>
                <Input
                  placeholder="VD: 0912345678"
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
    </div>
  );
}
