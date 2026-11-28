"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Sparkles } from "lucide-react";

import { ExamCreateAiMode } from "./exam-create-ai-mode";
import { ExamCreateHeader } from "./exam-create-header";
import { ExamCreateManualMode } from "./exam-create-manual-mode";

export function ExamCreatePageClient() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      <ExamCreateHeader />

      <Tabs defaultValue="manual" className="w-full gap-4">
        <TabsList className="h-9">
          <TabsTrigger value="manual" className="gap-1.5 text-xs">
            <PenLine className="size-3.5" />
            Nhập thủ công
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5 text-xs">
            <Sparkles className="size-3.5" />
            Tạo bằng AI (từ PDF)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <ExamCreateManualMode />
        </TabsContent>

        <TabsContent value="ai" forceMount className="data-[state=inactive]:hidden">
          <ExamCreateAiMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
