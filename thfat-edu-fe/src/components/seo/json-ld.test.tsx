/** @vitest-environment jsdom */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "./json-ld";

describe("JsonLd component", () => {
  it("renders script tag with application/ld+json and sanitized json string", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TH FAT EDU",
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeTruthy();
    expect(script?.textContent).toBe(JSON.stringify(data));
  });

  it("escapes '<' characters to prevent script injection / XSS", () => {
    const maliciousData = {
      description: "</script><script>alert('xss')</script>",
    };

    const { container } = render(<JsonLd data={maliciousData} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeTruthy();
    expect(script?.textContent).not.toContain("<");
    expect(script?.textContent).toContain("\\u003c/script");
  });
});
