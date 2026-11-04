"use client";

import { FieldGroup } from "@/components/ui/field";
import { cn } from "cn";
import { type ComponentProps, type ReactNode } from "react";
import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form";

export type TBaseFormProps<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  useFieldGroup?: boolean;
} & Omit<ComponentProps<"form">, "onSubmit" | "children">;

export function BaseForm<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
  useFieldGroup = true,
  ...formProps
}: TBaseFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}
        className={cn("space-y-4", className)}
        {...formProps}
      >
        {useFieldGroup ? <FieldGroup>{children}</FieldGroup> : children}
      </form>
    </FormProvider>
  );
}
