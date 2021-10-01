/**
 * Convert a unix timestamp to a human-readable date and time string in the
 * user's current locale and timezone.
 *
 * @param input (number) unix timestamp
 * @returns (string) ex: "9/29/2021, 12:30:32 AM"
 */
export const timestampToDate = (input: number): string => {
  const date = new Date(input * 1000);
  return date.toLocaleString();
}
