export function getEmailPre(str?: string) {
  if (!str) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regular expression of mailboxes
  if (emailRegex.test(str)) {
    // If it is an mailbox, return@如果 string
    return str.split('@')[0]
  } else {
    // If it is not an mailbox, return the entire string
    return str
  }
}
