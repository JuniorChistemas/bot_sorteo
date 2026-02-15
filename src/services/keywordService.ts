export function isValidKeyword(text: string): boolean {
  return text === process.env.KEYWORD;
}
