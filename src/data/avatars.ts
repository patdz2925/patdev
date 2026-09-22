/**
 * Visitor avatar faces for the presence stack.
 * Split from public/avatars-sheet.png into public/avatars/face-01.png
 * through face-10.png (do not edit the crops by hand — re-split from
 * the sheet if the source ever changes).
 */
export const AVATAR_COUNT = 10;

/** Deterministic face per anonymous visitor key — stable across renders. */
export function avatarFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 997;
  const n = (h % AVATAR_COUNT) + 1;
  return `/avatars/face-${String(n).padStart(2, "0")}.png`;
}
