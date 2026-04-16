export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
