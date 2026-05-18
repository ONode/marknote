import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAllFiles,
  getFile,
  saveFile,
  deleteFile,
  renameFile,
  updateFileTags,
  searchFiles,
  getFilesByTag,
  getAllTags,
  getFileStats,
  exportAllFiles,
  importFiles,
  clearAllFiles,
  duplicateFile,
  checkStorageAvailability,
  getRecentFiles
} from '@/actions/file-actions';
import type { FileMetadata, FileStats } from '@/actions/file-actions';
import { toast } from 'sonner';

export interface UseFileManagerOptions {
  autoSave?: boolean;
  autoSaveDelay?: number;
  maxFiles?: number;
}

export interface UseFileManagerReturn {
  // State
  files: FileMetadata[];
  currentFile: FileMetadata | null;
  isLoading: boolean;
  error: string | null;
  stats: FileStats;
  tags: string[];
  
  // File operations
  createFile: (name: string, content: string, tags?: string[]) => Promise<FileMetadata>;
  updateFile: (id: string, content: string) => Promise<FileMetadata>;
  saveFile: (id: string, name: string, content: string, tags?: string[]) => Promise<FileMetadata>;
  deleteFile: (id: string) => Promise<boolean>;
  renameFile: (id: string, newName: string) => Promise<FileMetadata | null>;
  duplicateFile: (id: string) => Promise<FileMetadata | null>;
  
  // File selection
  selectFile: (id: string) => void;
  selectFileByIndex: (index: number) => void;
  
  // Search and filtering
  searchFiles: (query: string) => FileMetadata[];
  getFilesByTag: (tag: string) => FileMetadata[];
  getRecentFiles: (limit?: number) => FileMetadata[];
  
  // Bulk operations
  exportAllFiles: () => string;
  importFiles: (jsonData: string) => Promise<{ success: number; errors: number }>;
  clearAllFiles: () => Promise<boolean>;
  
  // Utilities
  refreshFiles: () => void;
  checkStorage: () => { available: boolean; error?: string; estimatedSpace?: number };
}

export function useFileManager(options: UseFileManagerOptions = {}): UseFileManagerReturn {
  const {
    autoSave = false,
    autoSaveDelay = 1000,
    maxFiles = 100
  } = options;

  // State
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [currentFile, setCurrentFile] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    lastModified: 0
  });
  const [tags, setTags] = useState<string[]>([]);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Load files on mount
  useEffect(() => {
    refreshFiles();
  }, []);

  // Update stats and tags when files change
  useEffect(() => {
    const newStats = getFileStats();
    const newTags = getAllTags();
    setStats(newStats);
    setTags(newTags);
  }, [files]);

  // Auto-save functionality - only save when content actually changes
  useEffect(() => {
    if (autoSave && currentFile) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(() => {
        if (currentFile) {
          // Only save if content has actually changed
          const existingFile = files.find(f => f.id === currentFile.id);
          if (existingFile && existingFile.content !== currentFile.content) {
            updateFile(currentFile.id, currentFile.content).catch(console.error);
          }
        }
      }, autoSaveDelay);
      
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [currentFile?.content, autoSave, autoSaveDelay, files]);

  // Refresh files from localStorage
  const refreshFiles = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const allFiles = getAllFiles();
      setFiles(allFiles);
      
      // Select first file if no current file is selected
      if (!currentFile && allFiles.length > 0) {
        setCurrentFile(allFiles[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [currentFile]);

  // Create a new file
  const createFile = useCallback(async (
    name: string, 
    content: string, 
    tags?: string[]
  ): Promise<FileMetadata> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check file limit
      if (files.length >= maxFiles) {
        throw new Error(`Maximum file limit reached (${maxFiles})`);
      }
      
      const newFile = saveFile(name, content, undefined, tags);
      setFiles(prev => [newFile, ...prev]);
      setCurrentFile(newFile);
      
      toast.success(`File "${name}" created successfully`);
      return newFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create file';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [files.length, maxFiles]);

  // Update file content
  const updateFile = useCallback(async (id: string, content: string): Promise<FileMetadata> => {
    try {
      const updatedFile = saveFile('', content, id);
      setFiles(prev => prev.map(f => f.id === id ? updatedFile : f));
      
      if (currentFile?.id === id) {
        setCurrentFile(updatedFile);
      }
      
      return updatedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update file';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [currentFile]);

  // Save file with name and tags
  const saveFileWithMetadata = useCallback(async (
    id: string, 
    name: string, 
    content: string, 
    tags?: string[]
  ): Promise<FileMetadata> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedFile = saveFile(name, content, id, tags);
      setFiles(prev => prev.map(f => f.id === id ? updatedFile : f));
      
      if (currentFile?.id === id) {
        setCurrentFile(updatedFile);
      }
      
      toast.success(`File "${name}" saved successfully`);
      return updatedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentFile]);

  // Delete file
  const deleteFileById = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = deleteFile(id);
      if (success) {
        setFiles(prev => prev.filter(f => f.id !== id));
        
        // Clear current file if it was deleted
        if (currentFile?.id === id) {
          setCurrentFile(null);
        }
        
        toast.success('File deleted successfully');
      } else {
        toast.error('File not found');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentFile]);

  // Rename file
  const renameFileById = useCallback(async (id: string, newName: string): Promise<FileMetadata | null> => {
    try {
      setError(null);
      
      const renamedFile = renameFile(id, newName);
      if (renamedFile) {
        setFiles(prev => prev.map(f => f.id === id ? renamedFile : f));
        
        if (currentFile?.id === id) {
          setCurrentFile(renamedFile);
        }
        
        toast.success(`File renamed to "${newName}"`);
      }
      
      return renamedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename file';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  }, [currentFile]);

  // Duplicate file
  const duplicateFileById = useCallback(async (id: string): Promise<FileMetadata | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const duplicatedFile = duplicateFile(id);
      if (duplicatedFile) {
        setFiles(prev => [duplicatedFile, ...prev]);
        setCurrentFile(duplicatedFile);
        toast.success(`File "${duplicatedFile.name}" created successfully`);
      }
      
      return duplicatedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate file';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Select file by ID
  const selectFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setCurrentFile(file);
    }
  }, [files]);

  // Select file by index
  const selectFileByIndex = useCallback((index: number) => {
    if (index >= 0 && index < files.length) {
      setCurrentFile(files[index]);
    }
  }, [files]);

  // Search files
  const searchFilesByQuery = useCallback((query: string): FileMetadata[] => {
    return searchFiles(query);
  }, []);

  // Get files by tag
  const getFilesByTagName = useCallback((tag: string): FileMetadata[] => {
    return getFilesByTag(tag);
  }, []);

  // Get recent files
  const getRecentFilesByLimit = useCallback((limit?: number): FileMetadata[] => {
    return getRecentFiles(limit);
  }, []);

  // Export all files
  const exportAllFilesData = useCallback((): string => {
    try {
      const exportData = exportAllFiles();
      toast.success('Files exported successfully');
      return exportData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export files';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Import files
  const importFilesData = useCallback(async (jsonData: string): Promise<{ success: number; errors: number }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await importFiles(jsonData);
      refreshFiles();
      
      toast.success(`Imported ${result.success} files successfully`);
      if (result.errors > 0) {
        toast.warning(`${result.errors} files failed to import`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import files';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshFiles]);

  // Clear all files
  const clearAllFilesData = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = clearAllFiles();
      if (success) {
        setFiles([]);
        setCurrentFile(null);
        toast.success('All files cleared successfully');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear files';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check storage availability
  const checkStorage = useCallback(() => {
    return checkStorageAvailability();
  }, []);

  // Memoized return value
  const returnValue = useMemo<UseFileManagerReturn>(() => ({
    // State
    files,
    currentFile,
    isLoading,
    error,
    stats,
    tags,
    
    // File operations
    createFile,
    updateFile,
    saveFile: saveFileWithMetadata,
    deleteFile: deleteFileById,
    renameFile: renameFileById,
    duplicateFile: duplicateFileById,
    
    // File selection
    selectFile,
    selectFileByIndex,
    
    // Search and filtering
    searchFiles: searchFilesByQuery,
    getFilesByTag: getFilesByTagName,
    getRecentFiles: getRecentFilesByLimit,
    
    // Bulk operations
    exportAllFiles: exportAllFilesData,
    importFiles: importFilesData,
    clearAllFiles: clearAllFilesData,
    
    // Utilities
    refreshFiles,
    checkStorage
  }), [
    files,
    currentFile,
    isLoading,
    error,
    stats,
    tags,
    createFile,
    updateFile,
    saveFileWithMetadata,
    deleteFileById,
    renameFileById,
    duplicateFileById,
    selectFile,
    selectFileByIndex,
    searchFilesByQuery,
    getFilesByTagName,
    getRecentFilesByLimit,
    exportAllFilesData,
    importFilesData,
    clearAllFilesData,
    refreshFiles,
    checkStorage
  ]);

  return returnValue;
}
