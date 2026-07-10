const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateReferenceCode(): string {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
  return `${letter}${digits}`;
}
