export function randomSubdomain(prefix = "unix") {
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${rand}`;
}
