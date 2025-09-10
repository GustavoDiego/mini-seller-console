export function isValidEmail(value: string) {
  const v = value.trim()
  if (!v) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(v)
}
