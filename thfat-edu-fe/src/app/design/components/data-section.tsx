import { ScrollArea } from "@/components/ui/scroll-area";

import { Demo, Section } from "./section-wrapper";

export function DataSection() {
  return (
    <Section id="data" title="Data Display">
      <Demo label="Scroll Area">
        <ScrollArea className="h-40 rounded-lg border border-neutral-200 bg-white p-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="border-b border-neutral-100 py-2 last:border-0">
              <p className="text-body-sm text-neutral-700">
                <span className="text-label text-primary-700 mr-2">#{i + 1}</span>
                Câu hỏi về phản ứng oxi hóa khử trong dung dịch axit
              </p>
            </div>
          ))}
        </ScrollArea>
      </Demo>
    </Section>
  );
}
