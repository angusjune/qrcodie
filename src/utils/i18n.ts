export function msg(key: string, ...args: any[]): string {
  return chrome.i18n.getMessage(key, args)
}