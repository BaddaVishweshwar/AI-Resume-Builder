import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Combines multiple class names and merges Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string or Date object into a readable format
 * @example formatDate('2023-01-15') // 'Jan 2023'
 */
export function formatDate(dateString: string | Date) {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Formats a date range with proper handling for current positions
 * @example formatDateRange('2020-01-01', '2022-12-31') // 'Jan 2020 - Dec 2022'
 * @example formatDateRange('2020-01-01', null, true) // 'Jan 2020 - Present'
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date | null, isCurrent = false) {
  const start = formatDate(startDate);
  const end = isCurrent ? 'Present' : (endDate ? formatDate(endDate) : 'Present');
  return `${start} - ${end}`;
}

/**
 * Converts a string to a URL-friendly slug
 * @example slugify('My Resume 2023') // 'my-resume-2023'
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generates a random ID for client-side use
 */
export function generateRandomId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 */
export function truncate(text: string, length: number) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Extracts initials from a full name
 * @example getInitials('John Doe') // 'JD'
 */
export function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Copies text to the clipboard
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Formats file size in bytes to a human-readable string
 * @example formatFileSize(1024) // '1 KB'
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce a function call
 * @param func The function to debounce
 * @param wait Time to wait in milliseconds
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generates a gradient color based on a string input
 * Useful for generating consistent colors for avatars, etc.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Capitalizes the first letter of each word in a string
 * @example capitalizeWords('hello world') // 'Hello World'
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a random hex color
 */
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Converts a string to title case
 * @example toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
