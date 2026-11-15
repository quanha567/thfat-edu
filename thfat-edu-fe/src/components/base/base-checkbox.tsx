"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useId, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export type TBaseCheckboxProps = {
  fieldId?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function BaseCheckbox({
  fieldId,
  label,
  description,
  error: explicitError,
  checked: controlledChecked,
  onCheckedChange,
  disabled,
  className,
  id: customId,
}: TBaseCheckboxProps) {
  const reactId = useId();
  const checkboxId = customId || (fieldId ? `${fieldId}-checkbox` : reactId);
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
            <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
              <Checkbox
                id={checkboxId}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                disabled={disabled}
                aria-invalid={isInvalid}
              />
              <FieldContent>
                {label && (
                  <FieldLabel
                    htmlFor={checkboxId}
                    className="cursor-pointer font-normal text-slate-600 dark:text-slate-300"
                  >
                    {label}
                  </FieldLabel>
                )}
                {description && <FieldDescription>{description}</FieldDescription>}
                {isInvalid && <FieldError errors={[{ message: displayError }]} />}
              </FieldContent>
            </Field>
          );
        }}
      />
    );
  }

  const isInvalid = Boolean(explicitError);

  return (
    <Field orientation="horizontal" data-invalid={isInvalid} className={className}>
      <Checkbox
        id={checkboxId}
        checked={controlledChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
      <FieldContent>
        {label && (
          <FieldLabel
            htmlFor={checkboxId}
            className="cursor-pointer font-normal text-slate-600 dark:text-slate-300"
          >
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={[{ message: explicitError }]} />}
      </FieldContent>
    </Field>
  );
}
