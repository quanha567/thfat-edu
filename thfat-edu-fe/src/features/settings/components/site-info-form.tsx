"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { type WithChildren } from "@thfat-edu/shared";
import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";

import { DEFAULT_SITE_INFO, SOCIAL_FIELDS } from "../constants/site-info.constants";
import { useSiteInfo } from "../hooks/use-site-info";
import { useUpdateSiteInfo } from "../hooks/use-update-site-info";
import { siteInfoSchema, type TSiteInfoFormValues } from "../schemas/site-info.schema";
import { type TSiteInfo } from "../types/settings.types";
import { FormActionBar } from "./form-action-bar";

function toFormValues(info: TSiteInfo): TSiteInfoFormValues {
  return {
    siteName: info.siteName,
    slogan: info.slogan,
    contactEmail: info.contactEmail,
    facebookUrl: info.facebookUrl,
    youtubeUrl: info.youtubeUrl,
    zaloUrl: info.zaloUrl,
    tiktokUrl: info.tiktokUrl,
    telegramUrl: info.telegramUrl,
    instagramUrl: info.instagramUrl,
  };
}

type TFieldProps = WithChildren<{
  id: string;
  label: string;
  hint?: string;
  error: FieldError | undefined;
}>;

function Field({ id, label, hint, error, children }: TFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-destructive text-xs">{error.message}</p>}
    </div>
  );
}

export function SiteInfoForm() {
  const { data: siteInfo, isLoading } = useSiteInfo();
  const updateMutation = useUpdateSiteInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TSiteInfoFormValues>({
    resolver: zodResolver(siteInfoSchema),
    defaultValues: DEFAULT_SITE_INFO,
  });

  useEffect(() => {
    if (siteInfo) {
      reset(toFormValues(siteInfo));
    }
  }, [siteInfo, reset]);

  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
      className="space-y-6 pb-12"
    >
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="border-border/40 border-b pb-4">
            <CardTitle className="text-base font-semibold">Nhận diện và liên hệ</CardTitle>
            <CardDescription>Hiển thị công khai ở chân trang của website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <Field
              id="siteName"
              label="Tên site"
              hint="Hiển thị ở chân trang, trong dòng bản quyền."
              error={errors.siteName}
            >
              <Input id="siteName" {...register("siteName")} />
            </Field>
            <Field id="slogan" label="Slogan" hint="Hiển thị ở chân trang." error={errors.slogan}>
              <Input id="slogan" {...register("slogan")} />
            </Field>
            <Field id="contactEmail" label="Email liên hệ" error={errors.contactEmail}>
              <Input
                id="contactEmail"
                type="email"
                placeholder="lienhe@example.com"
                {...register("contactEmail")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="border-border/40 border-b pb-4">
            <CardTitle className="text-base font-semibold">Mạng xã hội</CardTitle>
            <CardDescription>
              Để trống nền tảng nào thì chân trang sẽ ẩn nền tảng đó
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {SOCIAL_FIELDS.map((field) => (
              <Field
                key={field.name}
                id={field.name}
                label={field.label}
                error={errors[field.name]}
              >
                <Input id={field.name} placeholder={field.placeholder} {...register(field.name)} />
              </Field>
            ))}
          </CardContent>
        </Card>
      </div>

      <FormActionBar
        meta={siteInfo}
        isDirty={isDirty}
        isPending={updateMutation.isPending}
        onReset={() => siteInfo && reset(toFormValues(siteInfo))}
      />
    </form>
  );
}
