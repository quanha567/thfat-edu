"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { useId, type ComponentProps, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export type TBaseTextareaProps = {
  fieldId?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  containerClassName?: string;
} & Omit<ComponentProps<"textarea">, "name">;

export function BaseTextarea({
  fieldId,
  label,
  description,
  error: explicitError,
  maxLength,
  showCount = false,
  containerClassName,
  className,
  id: customId,
  disabled,
  rows = 4,
  ...textareaProps
}: TBaseTextareaProps) {
  const reactId = useId();
  const inputId = customId || (fieldId ? `${fieldId}-textarea` : reactId);
  const formContext = useFormContext();

  if (fieldId && formContext) {
    return (
      <Controller
        name={fieldId}
        control={formContext.control}
        render={({ field, fieldState }) => {
          const isInvalid = fieldState.invalid;
          const displayError = fieldState.error?.message || explicitError;
          const currentLength = typeof field.value === "string" ? field.value.length : 0;

          return (
            <Field data-invalid={isInvalid} className={containerClassName}>
              {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}

              {showCount && maxLength ? (
                <InputGroup className="bg-background">
                  <InputGroupTextarea
                    {...field}
                    id={inputId}
                    rows={rows}
                    maxLength={maxLength}
                    disabled={disabled}
                    aria-invalid={isInvalid}
                    className={cn("min-h-24 resize-none", className)}
                    {...textareaProps}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="text-caption text-muted-foreground tabular-nums">
                      {currentLength}/{maxLength} ký tự
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              ) : (
                <Textarea
                  {...field}
                  id={inputId}
                  rows={rows}
                  maxLength={maxLength}
                  disabled={disabled}
                  aria-invalid={isInvalid}
                  className={cn("bg-background", className)}
                  {...textareaProps}
                />
              )}

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
    <Field data-invalid={isInvalid} className={containerClassName}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}

      <Textarea
        id={inputId}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={isInvalid}
        className={cn("bg-background", className)}
        {...textareaProps}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={[{ message: explicitError }]} />}
    </Field>
  );
}
