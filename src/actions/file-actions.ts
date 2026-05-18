// File actions using localStorage instead of Next.js cache
// This provides client-side file management for the markdown application
// with compression support for efficient storage

import { compressContent, decompressContent, isCompressedContent } from '@/lib/compression';

export interface FileMetadata {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  size: number;
  tags?: string[];
  compressedSize?: number;
  isCompressed?: boolean;
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  lastModified: number;
}

const STORAGE_KEY = 'markdown-files';
const METADATA_KEY = 'markdown-files-metadata';

/**
 * Get all files from localStorage
 */
export function getAllFiles(): FileMetadata[] {
  try {
    const metadata = localStorage.getItem(METADATA_KEY);
    if (!metadata) return [];
    
    const files: FileMetadata[] = JSON.parse(metadata);
    return files.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error reading files from localStorage:', error);
    return [];
  }
}

/**
 * Get a specific file by ID
 */
export function getFile(id: string): FileMetadata | null {
  try {
    const files = getAllFiles();
    return files.find(file => file.id === id) || null;
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
}

/**
 * Get decompressed content from a file
 */
export function getDecompressedContent(file: FileMetadata): string {
  try {
    if (file.isCompressed && file.content) {
      return decompressContent(file.content);
    }
    return file.content;
  } catch (error) {
    console.error('Error decompressing content:', error);
    return file.content; // Fallback to original content
  }
}

/**
 * Get all files with decompressed content for display
 */
export function getAllFilesWithDecompressedContent(): (FileMetadata & { displayContent: string })[] {
  try {
    const files = getAllFiles();
    return files.map(file => ({
      ...file,
      displayContent: getDecompressedContent(file)
    }));
  } catch (error) {
    console.error('Error getting files with decompressed content:', error);
    return [];
  }
}

/**
 * Save a file to localStorage
 */
export function saveFile(
  name: string, 
  content: string, 
  id?: string, 
  tags?: string[]
): FileMetadata {
  try {
    const files = getAllFiles();
    const now = Date.now();
    const fileId = id || generateFileId();
    
    // Check if file already exists
    const existingFileIndex = files.findIndex(file => file.id === fileId);
    
    // Compress content for efficient storage
    const compressedContent = compressContent(content);
    const originalSize = new Blob([content]).size;
    const compressedSize = new Blob([compressedContent]).size;
    
    const fileData: FileMetadata = {
      id: fileId,
      name: name.trim() || 'Untitled Document',
      content: compressedContent, // Store compressed content
      createdAt: existingFileIndex >= 0 ? files[existingFileIndex].createdAt : now,
      updatedAt: now,
      size: originalSize, // Store original size for display
      tags: tags || [],
      compressedSize, // Store compressed size for comparison
      isCompressed: true // Flag to indicate content is compressed
    };
    
    if (existingFileIndex >= 0) {
      // Update existing file
      files[existingFileIndex] = fileData;
    } else {
      // Add new file
      files.push(fileData);
    }
    
    // Save to localStorage
    localStorage.setItem(METADATA_KEY, JSON.stringify(files));
    
    return fileData;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Delete a file from localStorage
 */
export function deleteFile(id: string): boolean {
  try {
    const files = getAllFiles();
    const filteredFiles = files.filter(file => file.id !== id);
    
    if (filteredFiles.length === files.length) {
      return false; // File not found
    }
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(filteredFiles));
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Rename a file
 */
export function renameFile(id: string, newName: string): FileMetadata | null {
  try {
    const files = getAllFiles();
    const fileIndex = files.findIndex(file => file.id === id);
    
    if (fileIndex === -1) return null;
    
    files[fileIndex] = {
      ...files[fileIndex],
      name: newName.trim() || 'Untitled Document',
      updatedAt: Date.now()
    };
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(files));
    return files[fileIndex];
  } catch (error) {
    console.error('Error renaming file:', error);
    return null;
  }
}

/**
 * Update file tags
 */
export function updateFileTags(id: string, tags: string[]): FileMetadata | null {
  try {
    const files = getAllFiles();
    const fileIndex = files.findIndex(file => file.id === id);
    
    if (fileIndex === -1) return null;
    
    files[fileIndex] = {
      ...files[fileIndex],
      tags: tags.filter(tag => tag.trim().length > 0),
      updatedAt: Date.now()
    };
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(files));
    return files[fileIndex];
  } catch (error) {
    console.error('Error updating file tags:', error);
    return null;
  }
}

/**
 * Search files by content or name
 */
export function searchFiles(query: string): FileMetadata[] {
  try {
    const files = getAllFiles();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return files;
    
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm) ||
      file.content.toLowerCase().includes(searchTerm) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
}

/**
 * Get files by tag
 */
export function getFilesByTag(tag: string): FileMetadata[] {
  try {
    const files = getAllFiles();
    const searchTag = tag.toLowerCase().trim();
    
    return files.filter(file => 
      file.tags?.some(fileTag => fileTag.toLowerCase() === searchTag)
    );
  } catch (error) {
    console.error('Error getting files by tag:', error);
    return [];
  }
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  try {
    const files = getAllFiles();
    const tagSet = new Set<string>();
    
    files.forEach(file => {
      file.tags?.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
}

/**
 * Get file statistics
 */
export function getFileStats(): FileStats {
  try {
    const files = getAllFiles();
    
    return {
      totalFiles: files.length,
      totalSize: files.reduce((total, file) => total + file.size, 0),
      lastModified: files.length > 0 ? Math.max(...files.map(f => f.updatedAt)) : 0
    };
  } catch (error) {
    console.error('Error getting file stats:', error);
    return {
      totalFiles: 0,
      totalSize: 0,
      lastModified: 0
    };
  }
}

/**
 * Export all files as a single JSON file
 */
export function exportAllFiles(): string {
  try {
    const files = getAllFiles();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      files: files.map(file => ({
        ...file,
        content: file.content
      }))
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting files:', error);
    throw new Error('Failed to export files');
  }
}

/**
 * Import files from exported JSON
 */
export function importFiles(jsonData: string): { success: number; errors: number } {
  try {
    const importData = JSON.parse(jsonData);
    
    if (!importData.files || !Array.isArray(importData.files)) {
      throw new Error('Invalid import format');
    }
    
    const existingFiles = getAllFiles();
    const existingIds = new Set(existingFiles.map(f => f.id));
    
    let success = 0;
    let errors = 0;
    
    importData.files.forEach((importedFile: any) => {
      try {
        if (importedFile.name && importedFile.content) {
          // Generate new ID to avoid conflicts
          const newId = generateFileId();
          
          const fileData: FileMetadata = {
            id: newId,
            name: importedFile.name,
            content: importedFile.content,
            createdAt: importedFile.createdAt || Date.now(),
            updatedAt: Date.now(),
            size: new Blob([importedFile.content]).size,
            tags: importedFile.tags || []
          };
          
          existingFiles.push(fileData);
          success++;
        }
      } catch (fileError) {
        console.error('Error importing file:', fileError);
        errors++;
      }
    });
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(existingFiles));
    
    return { success, errors };
  } catch (error) {
    console.error('Error importing files:', error);
    throw new Error('Failed to import files');
  }
}

/**
 * Clear all files (dangerous operation)
 */
export function clearAllFiles(): boolean {
  try {
    localStorage.removeItem(METADATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing files:', error);
    return false;
  }
}

/**
 * Generate a unique file ID
 */
function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if localStorage is available and has sufficient space
 */
export function checkStorageAvailability(): {
  available: boolean;
  error?: string;
  estimatedSpace?: number;
} {
  try {
    // Test if localStorage is available
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // Estimate available space (rough calculation)
    const currentUsage = localStorage.getItem(METADATA_KEY)?.length || 0;
    const estimatedSpace = 5 * 1024 * 1024 - currentUsage; // 5MB estimate
    
    return {
      available: true,
      estimatedSpace: Math.max(0, estimatedSpace)
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get recent files (last 10 modified)
 */
export function getRecentFiles(limit: number = 10): FileMetadata[] {
  try {
    const files = getAllFiles();
    return files.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent files:', error);
    return [];
  }
}

/**
 * Duplicate a file
 */
export function duplicateFile(id: string): FileMetadata | null {
  try {
    const originalFile = getFile(id);
    if (!originalFile) return null;
    
    const newName = `${originalFile.name} (Copy)`;
    return saveFile(newName, originalFile.content, undefined, originalFile.tags);
  } catch (error) {
    console.error('Error duplicating file:', error);
    return null;
  }
}
