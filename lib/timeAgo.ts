export function formatTimeAgo(
  input: string | number | Date,
  currentTimeMs: number = Date.now()
): string {
  const date = new Date(input);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return "a while ago";
  }

  const seconds = Math.max(0, Math.floor((currentTimeMs - timestamp) / 1000));

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return "a while ago";
}
