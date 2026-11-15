"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "cn";
import { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export type TSegmentedOption = {
  label: ReactNode;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type TBaseSegmentedProps = {
  fieldId?: string;
  label?: ReactNode;
  description?: ReactNode;
  options: TSegmentedOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export function BaseSegmented({
  fieldId,
  label,
  description,
  options,
  value: controlledValue,
  onValueChange,
  disabled,
  className,
  fullWidth = true,
}: TBaseSegmentedProps) {
  const formContext = useFormContext();

  if (fieldId && formContext) {
    return (
      <Controller
        name={fieldId}
        control={formContext.control}
        render={({ field }) => (
          <Field className={className}>
            {label && <FieldLabel>{label}</FieldLabel>}

            <Tabs
              value={field.value}
              onValueChange={field.onChange}
              className={fullWidth ? "w-full" : "w-fit"}
            >
              <TabsList className={cn("h-10 rounded-lg p-1 bg-muted", fullWidth && "w-full")}>
                {options.map((opt) => (
                  <TabsTrigger
                    key={opt.value}
                    value={opt.value}
                    disabled={disabled || opt.disabled}
                    className="text-caption h-8 gap-2 rounded-md font-medium transition-all"
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {description && <FieldDescription>{description}</FieldDescription>}
          </Field>
        )}
      />
    );
  }

  return (
    <Field className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}

      <Tabs
        value={controlledValue}
        onValueChange={onValueChange}
        className={fullWidth ? "w-full" : "w-fit"}
      >
        <TabsList className={cn("h-10 rounded-lg p-1 bg-muted", fullWidth && "w-full")}>
          {options.map((opt) => (
            <TabsTrigger
              key={opt.value}
              value={opt.value}
              disabled={disabled || opt.disabled}
              className="text-caption h-8 gap-2 rounded-md font-medium transition-all"
            >
              {opt.icon}
              <span>{opt.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
