const LIKE_SPECIAL_CHARS = /[\\%_]/g;

/** Escape dấu gạch chéo ngược, % và _ để chuỗi người dùng nhập khớp theo nghĩa đen trong ILIKE. */
export function escapeLike(value: string): string {
  return value.replace(LIKE_SPECIAL_CHARS, (char) => `\\${char}`);
}

/** Tạo mẫu `%từ khoá%` an toàn cho ILIKE. */
export function containsPattern(value: string): string {
  return `%${escapeLike(value.trim())}%`;
}
