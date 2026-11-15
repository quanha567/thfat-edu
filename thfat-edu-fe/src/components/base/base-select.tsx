"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import { useId, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export type TSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type TBaseSelectProps = {
  fieldId?: string;
  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  options: TSelectOption[];
  error?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function BaseSelect({
  fieldId,
  label,
  description,
  placeholder = "Chọn một mục",
  options,
  error: explicitError,
  value: controlledValue,
  onValueChange,
  disabled,
  className,
  id: customId,
}: TBaseSelectProps) {
  const reactId = useId();
  const selectId = customId || (fieldId ? `${fieldId}-select` : reactId);
  const formContext = useFormContext();

  if (fieldId && formContext) {
    return (
      <Controller
        name={fieldId}
        control={formContext.control}
        render={({ field, fieldState }) => {
          const isInvalid = fieldState.invalid;
          const displayError = fieldState.error?.message || explicitError;

          return (
            <Field data-invalid={isInvalid} className={className}>
              {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}

              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <SelectTrigger
                  id={selectId}
                  aria-invalid={isInvalid}
                  className={cn("h-10 w-full rounded-lg bg-background text-sm", className)}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {description && <FieldDescription>{description}</FieldDescription>}

              {isInvalid && <FieldError errors={[{ message: displayError }]} />}
            </Field>
          );
        }}
      />
    );
  }

  const isInvalid = Boolean(explicitError);

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}

      <Select value={controlledValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          aria-invalid={isInvalid}
          className={cn("h-10 w-full rounded-lg bg-background text-sm", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={[{ message: explicitError }]} />}
    </Field>
  );
}
