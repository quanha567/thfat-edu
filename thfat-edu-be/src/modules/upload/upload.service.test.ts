import { describe, expect, it } from "bun:test";

import { escapeLike } from "../../db/like";
import { hashSessionToken, generateSessionToken } from "../auth/auth.service";
import { detectImageType, sanitizeFileName } from "./upload.service";

describe("detectImageType", () => {
  it("recognises jpeg, png and webp signatures", () => {
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))?.extension).toBe("jpg");
    expect(
      detectImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.extension,
    ).toBe("png");
    expect(
      detectImageType(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))
        ?.extension,
    ).toBe("webp");
  });

  it("rejects non-image content even if the MIME claims otherwise", () => {
    expect(detectImageType(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(detectImageType(new Uint8Array(12))).toBeNull();
  });
});

describe("sanitizeFileName", () => {
  it("strips path tricks and extensions", () => {
    expect(sanitizeFileName("../../etc/passwd.png")).toBe("etc-passwd");
    expect(sanitizeFileName("avatar")).toBe("avatar");
    expect(sanitizeFileName("***")).toBe("image");
  });
});

describe("escapeLike", () => {
  it("escapes LIKE wildcards", () => {
    expect(escapeLike("50%_off\\")).toBe(String.raw`50\%\_off\\`);
  });
});

describe("session tokens", () => {
  it("generates unique 256-bit tokens and stores only a stable hash", () => {
    const a = generateSessionToken();
    const b = generateSessionToken();

    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(hashSessionToken(a)).toBe(hashSessionToken(a));
    expect(hashSessionToken(a)).not.toBe(a);
    expect(hashSessionToken(a)).toHaveLength(64);
  });
});
