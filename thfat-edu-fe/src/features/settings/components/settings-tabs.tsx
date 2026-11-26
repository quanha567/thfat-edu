"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { ExamSettingsForm } from "./exam-settings-form";
import { SiteInfoForm } from "./site-info-form";

const SETTINGS_TABS = ["exam", "site"] as const;

export function SettingsTabs() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(SETTINGS_TABS).withDefault("exam"),
  );

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value === "site" ? "site" : "exam")}
      className="gap-6"
    >
      <TabsList variant="line">
        <TabsTrigger value="exam">Quy chế khảo thí</TabsTrigger>
        <TabsTrigger value="site">Thông tin site</TabsTrigger>
      </TabsList>
      <TabsContent value="exam">
        <ExamSettingsForm />
      </TabsContent>
      <TabsContent value="site">
        <SiteInfoForm />
      </TabsContent>
    </Tabs>
  );
}
