/**
 * Utility functions for compressing and decompressing content for URL parameters
 * Uses gzip compression for optimal compression ratios
 */

import pako from 'pako';

// Compress content using gzip and make it URL-safe
export function compressContent(content: string): string {
  try {
    // Convert string to Uint8Array
    const textEncoder = new TextEncoder();
    const contentBytes = textEncoder.encode(content);
    
    // Compress using gzip
    const compressedBytes = pako.gzip(contentBytes);
    
    // Convert to base64 and make URL-safe
    const base64 = btoa(String.fromCharCode(...compressedBytes));
    return base64
      .replace(/\+/g, '-') // Replace + with -
      .replace(/\//g, '_') // Replace / with _
      .replace(/=/g, '');  // Remove padding
  } catch (error) {
    console.error('Error compressing content with gzip:', error);
    return content; // Fallback to original content if compression fails
  }
}

// Decompress content from gzip
export function decompressContent(compressed: string): string {
  try {
    // Reverse the URL-safe encoding
    let base64 = compressed
      .replace(/-/g, '+') // Replace - with +
      .replace(/_/g, '/'); // Replace _ with /
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Convert base64 to Uint8Array
    const compressedBytes = new Uint8Array(
      atob(base64).split('').map(char => char.charCodeAt(0))
    );
    
    // Decompress using gzip
    const decompressedBytes = pako.ungzip(compressedBytes);
    
    // Convert back to string
    const textDecoder = new TextDecoder();
    return textDecoder.decode(decompressedBytes);
  } catch (error) {
    console.error('Error decompressing content with gzip:', error);
    return compressed; // Fallback to compressed content if decompression fails
  }
}

// Check if content is compressed (gzip compressed content has specific characteristics)
export function isCompressedContent(content: string): boolean {
  try {
    // Gzip compressed content typically starts with specific byte patterns
    // and has a different character distribution than plain text
    const hasSpecialChars = /[-_]/.test(content);
    const isBase64Like = /^[A-Za-z0-9\-_]+$/.test(content);
    const isLongEnough = content.length > 50; // Compressed content is usually shorter
    
    // Additional check: try to decode and see if it's valid gzip
    if (hasSpecialChars && isBase64Like && isLongEnough) {
      try {
        // Try to decompress to see if it's valid
        const testDecompress = decompressContent(content);
        return testDecompress.length > 0;
      } catch {
        return false;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

// Get a shareable URL with compressed content
export function getShareableUrl(content: string, baseUrl?: string): string {
  // Use provided baseUrl or get from window.location
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  if (content.length < 200) {
    // For very short content, use raw content
    return `${origin}?content=${encodeURIComponent(content)}`;
  }
  // For longer content, compress it with gzip
  const compressed = compressContent(content);
  const compressionRatio = ((content.length - compressed.length) / content.length * 100).toFixed(1);
  console.log(`Content compressed: ${content.length} → ${compressed.length} chars (${compressionRatio}% reduction)`);
  return `${origin}?content=${encodeURIComponent(compressed)}`;
}

// Validate if content parameter should be processed
export function shouldProcessContentParam(contentParam: string | null): boolean {
  if (!contentParam) return false;
  // If it's already compressed, decompress it
  if (isCompressedContent(contentParam)) {
    return true;
  }
  // If it's raw content and too long, we should compress it
  return contentParam.length < 2000; // Allow raw content up to 2000 chars
}

// Get compression statistics
export function getCompressionStats(content: string): {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  shouldCompress: boolean;
} {
  const originalSize = content.length;
  const compressed = compressContent(content);
  const compressedSize = compressed.length;
  const compressionRatio = ((originalSize - compressedSize) / originalSize * 100);
  
  return {
    originalSize,
    compressedSize,
    compressionRatio,
    shouldCompress: compressedSize < originalSize
  };
}
