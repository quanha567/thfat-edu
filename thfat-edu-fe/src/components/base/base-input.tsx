"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import { useState, useId, type ComponentProps, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export type TBaseInputProps = {
  fieldId?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
} & Omit<ComponentProps<"input">, "name">;

export function BaseInput({
  fieldId,
  label,
  description,
  error: explicitError,
  leadingIcon,
  trailingIcon,
  isPassword = false,
  containerClassName,
  className,
  type = "text",
  id: customId,
  disabled,
  ...inputProps
}: TBaseInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const reactId = useId();
  const inputId = customId || (fieldId ? `${fieldId}-input` : reactId);
  const formContext = useFormContext();

  let effectiveType = type;
  if (isPassword) {
    effectiveType = showPassword ? "text" : "password";
  }

  const hasAddons = Boolean(leadingIcon || trailingIcon || isPassword);

  if (fieldId && formContext) {
    return (
      <Controller
        name={fieldId}
        control={formContext.control}
        render={({ field, fieldState }) => {
          const isInvalid = fieldState.invalid;
          const displayError = fieldState.error?.message || explicitError;

          return (
            <Field data-invalid={isInvalid} className={containerClassName}>
              {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}

              {hasAddons ? (
                <InputGroup className={cn("h-10 rounded-lg bg-background", className)}>
                  {leadingIcon && (
                    <InputGroupAddon align="inline-start" className="text-muted-foreground">
                      {leadingIcon}
                    </InputGroupAddon>
                  )}

                  <InputGroupInput
                    {...field}
                    id={inputId}
                    type={effectiveType}
                    disabled={disabled}
                    aria-invalid={isInvalid}
                    className="placeholder:text-muted-foreground"
                    {...inputProps}
                  />

                  {isPassword && (
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground focus:outline-none"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </InputGroupButton>
                  )}

                  {trailingIcon && !isPassword && (
                    <InputGroupAddon align="inline-end" className="text-muted-foreground">
                      {trailingIcon}
                    </InputGroupAddon>
                  )}
                </InputGroup>
              ) : (
                <Input
                  {...field}
                  id={inputId}
                  type={effectiveType}
                  disabled={disabled}
                  aria-invalid={isInvalid}
                  className={cn(
                    "h-10 rounded-lg bg-background placeholder:text-muted-foreground",
                    className,
                  )}
                  {...inputProps}
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

      {hasAddons ? (
        <InputGroup className={cn("h-10 rounded-lg bg-background", className)}>
          {leadingIcon && (
            <InputGroupAddon align="inline-start" className="text-muted-foreground">
              {leadingIcon}
            </InputGroupAddon>
          )}

          <InputGroupInput
            id={inputId}
            type={effectiveType}
            disabled={disabled}
            aria-invalid={isInvalid}
            className="placeholder:text-muted-foreground"
            {...inputProps}
          />

          {isPassword && (
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </InputGroupButton>
          )}

          {trailingIcon && !isPassword && (
            <InputGroupAddon align="inline-end" className="text-muted-foreground">
              {trailingIcon}
            </InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        <Input
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          aria-invalid={isInvalid}
          className={cn(
            "h-10 rounded-lg bg-background placeholder:text-muted-foreground",
            className,
          )}
          {...inputProps}
        />
      )}

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={[{ message: explicitError }]} />}
    </Field>
  );
}
