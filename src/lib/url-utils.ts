/**
 * URL utility functions for handling URL parameters and navigation
 * Replaces Next.js useSearchParams functionality
 */

// Get URL search parameters
export function getSearchParams(): URLSearchParams {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}

// Get a specific search parameter
export function getSearchParam(key: string): string | null {
  const params = getSearchParams();
  return params.get(key);
}

// Set a search parameter and update the URL
export function setSearchParam(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url.toString());
  }
}

// Remove a search parameter
export function removeSearchParam(key: string): void {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url.toString());
  }
}

// Get the current URL origin
export function getOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

// Get the current pathname
export function getPathname(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
}

// Navigate to a new URL
export function navigateTo(url: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

// Create a shareable URL with the current origin
export function createShareableUrl(content: string): string {
  const origin = getOrigin();
  return `${origin}?content=${encodeURIComponent(content)}`;
}
