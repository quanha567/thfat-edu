import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { GraduationCap } from "lucide-react";

import { Demo, Section } from "./section-wrapper";

export function ButtonSection() {
  return (
    <Section id="buttons" title="Buttons">
      <Demo label="Variants">
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </Demo>

      <Demo label="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <GraduationCap className="size-4" />
          </Button>
        </div>
      </Demo>

      <Demo label="States">
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button>
            <Spinner className="mr-2" />
            Loading...
          </Button>
        </div>
      </Demo>

      <Demo label="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Demo>

      <Demo label="Toggle">
        <div className="flex flex-wrap gap-3">
          <Toggle>Bold</Toggle>
          <Toggle variant="outline">Italic</Toggle>
          <Toggle pressed>Pressed</Toggle>
        </div>
      </Demo>
    </Section>
  );
}
