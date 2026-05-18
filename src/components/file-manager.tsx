import React, { useState } from 'react';
import { useFileManager } from '@/hooks/use-file-manager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  FileText,
  Plus,
  Search,
  Tag,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  MoreHorizontal,
  Calendar,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface FileManagerProps {
  className?: string;
}

export function FileManager({ className }: FileManagerProps) {
  const {
    files,
    currentFile,
    isLoading,
    error,
    stats,
    tags,
    createFile,
    updateFile,
    saveFile,
    deleteFile,
    renameFile,
    duplicateFile,
    selectFile,
    searchFiles,
    exportAllFiles,
    importFiles,
    clearAllFiles,
    checkStorage
  } = useFileManager({
    autoSave: true,
    autoSaveDelay: 2000,
    maxFiles: 100
  });

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileTags, setNewFileTags] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [importData, setImportData] = useState('');
  const [selectedFileForAction, setSelectedFileForAction] = useState<string | null>(null);

  // Filtered files based on search
  const filteredFiles = searchQuery ? searchFiles(searchQuery) : files;

  // Handle create file
  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    try {
      const tags = newFileTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await createFile(newFileName, newFileContent, tags);
      setShowCreateDialog(false);
      setNewFileName('');
      setNewFileContent('');
      setNewFileTags('');
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  // Handle rename file
  const handleRenameFile = async () => {
    if (!selectedFileForAction || !renameValue.trim()) {
      toast.error('Please enter a new name');
      return;
    }

    try {
      await renameFile(selectedFileForAction, renameValue);
      setShowRenameDialog(false);
      setRenameValue('');
      setSelectedFileForAction(null);
    } catch (error) {
      console.error('Failed to rename file:', error);
    }
  };

  // Handle delete file
  const handleDeleteFile = async () => {
    if (!selectedFileForAction) return;

    try {
      await deleteFile(selectedFileForAction);
      setShowDeleteDialog(false);
      setSelectedFileForAction(null);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Handle duplicate file
  const handleDuplicateFile = async (id: string) => {
    try {
      await duplicateFile(id);
    } catch (error) {
      console.error('Failed to duplicate file:', error);
    }
  };

  // Handle export files
  const handleExportFiles = () => {
    try {
      const exportData = exportAllFiles();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `markdown-files-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export files:', error);
    }
  };

  // Handle import files
  const handleImportFiles = async () => {
    if (!importData.trim()) {
      toast.error('Please enter import data');
      return;
    }

    try {
      const result = await importFiles(importData);
      setShowImportDialog(false);
      setImportData('');
      toast.success(`Imported ${result.success} files successfully`);
    } catch (error) {
      console.error('Failed to import files:', error);
    }
  };

  // Handle clear all files
  const handleClearAllFiles = async () => {
    try {
      await clearAllFiles();
      setShowClearDialog(false);
    } catch (error) {
      console.error('Failed to clear files:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Check storage status
  const storageStatus = checkStorage();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Files:</span>
              <span className="font-medium">{stats.totalFiles}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Size:</span>
              <span className="font-medium">{formatFileSize(stats.totalSize)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last Modified:</span>
              <span className="font-medium">
                {stats.lastModified ? formatDate(stats.lastModified) : 'Never'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags:</span>
              <span className="font-medium">{tags.length}</span>
            </div>
          </div>
          
          {/* Storage status */}
          {!storageStatus.available && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Storage Error: {storageStatus.error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New File
              </Button>
              <Button variant="outline" onClick={handleExportFiles}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={() => setShowImportDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowClearDialog(true)}
                disabled={files.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File list */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No files found matching your search.' : 'No files yet. Create your first file to get started!'}
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentFile?.id === file.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => selectFile(file.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium truncate">{file.name}</h3>
                          {file.tags && file.tags.length > 0 && (
                            <div className="flex gap-1">
                              {file.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>Created: {formatDate(file.createdAt)}</span>
                          <span>Modified: {formatDate(file.updatedAt)}</span>
                        </div>
                        {file.content && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {file.content.substring(0, 150)}
                            {file.content.length > 150 && '...'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateFile(file.id);
                          }}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameValue(file.name);
                            setSelectedFileForAction(file.id);
                            setShowRenameDialog(true);
                          }}
                          title="Rename"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFileForAction(file.id);
                            setShowDeleteDialog(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create File Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">File Name</label>
              <Input
                placeholder="Enter file name..."
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Enter file content..."
                value={newFileContent}
                onChange={(e) => setNewFileContent(e.target.value)}
                rows={8}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                placeholder="tag1, tag2, tag3..."
                value={newFileTags}
                onChange={(e) => setNewFileTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFile}>Create File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Name</label>
              <Input
                placeholder="Enter new file name..."
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleRenameFile}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete File Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Files Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">JSON Data</label>
              <Textarea
                placeholder="Paste exported JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleImportFiles}>Import Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Files Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Files</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllFiles} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
