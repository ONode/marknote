'use client';

import React, { useState } from 'react';
import { useFileManager } from '@/hooks/use-file-manager';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  AlertTriangle,
  MoreHorizontal,
  Settings,
  Eraser,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { DragDropZone } from '@/components/drag-drop-zone';
import { getDecompressedContent } from '@/actions/file-actions';
import type { FileMetadata } from '@/actions/file-actions';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

interface DocPageProps {
  onNavigate?: (route: 'home' | 'doc', content?: string, fileMetadata?: FileMetadata) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DocPage({ onNavigate }: DocPageProps) {
  const {
    files,
    currentFile,
    isLoading,
    error,
    stats,
    createFile,
    deleteFile,
    renameFile,
    duplicateFile,
    selectFile,
    searchFiles,
    exportAllFiles,
    importFiles,
    clearAllFiles,
    checkStorage,
  } = useFileManager({
    autoSave: true,
    autoSaveDelay: 3000,
    maxFiles: 100,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileTags, setNewFileTags] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [importData, setImportData] = useState('');
  const [selectedFileForAction, setSelectedFileForAction] = useState<string | null>(null);

  const filteredFiles = searchQuery ? searchFiles(searchQuery) : files;
  const storageStatus = checkStorage();

  const openDocument = (file: FileMetadata) => {
    selectFile(file.id);
    const content = file.isCompressed ? getDecompressedContent(file) : file.content;
    onNavigate?.('home', content, file);
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    try {
      const tags = newFileTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      await createFile(newFileName, newFileContent, tags);
      setShowCreateDialog(false);
      setNewFileName('');
      setNewFileContent('');
      setNewFileTags('');
      toast.success(`"${newFileName}" created`);
    } catch {
      toast.error('Failed to create file');
    }
  };

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
      toast.success('Renamed');
    } catch {
      toast.error('Failed to rename');
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFileForAction) return;
    try {
      await deleteFile(selectedFileForAction);
      setShowDeleteDialog(false);
      setSelectedFileForAction(null);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDuplicateFile = async (id: string) => {
    try {
      await duplicateFile(id);
      toast.success('Duplicated');
    } catch {
      toast.error('Failed to duplicate');
    }
  };

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
      toast.success('Exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImportFiles = async () => {
    if (!importData.trim()) {
      toast.error('Paste import data first');
      return;
    }
    try {
      const result = await importFiles(importData);
      setShowImportDialog(false);
      setImportData('');
      toast.success(`Imported ${result.success} files`);
    } catch {
      toast.error('Import failed');
    }
  };

  const handleClearAllFiles = async () => {
    try {
      await clearAllFiles();
      setShowClearDialog(false);
      toast.success('All documents cleared');
    } catch {
      toast.error('Failed to clear');
    }
  };

  const handleFileDrop = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        if (content) {
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          await createFile(fileName, content, []);
          toast.success(`"${fileName}" added`);
        }
      };
      reader.readAsText(file);
    } catch {
      toast.error('Failed to import dropped file');
    }
  };

  return (
    <Layout>
      <div className="flex h-screen flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="shrink-0 border-b px-2 py-1.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => onNavigate?.('home')}
            title="Back to editor"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="min-w-0 shrink-0">
            <h1 className="text-sm font-semibold leading-none">Archive</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {stats.totalFiles} doc{stats.totalFiles !== 1 ? 's' : ''} · {formatFileSize(stats.totalSize)}
            </p>
          </div>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 text-xs"
            />
          </div>

          <Button size="sm" className="h-7 shrink-0 px-2 text-xs" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleExportFiles}>
                <Download className="h-3.5 w-3.5" />
                Export all
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Upload className="h-3.5 w-3.5" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                <Settings className="h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowClearDialog(true)}
              >
                <Eraser className="h-3.5 w-3.5" />
                Clear all
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Alerts */}
      {(error || !storageStatus.available) && (
        <div className="shrink-0 flex items-center gap-1.5 border-b border-destructive/30 bg-destructive/5 px-2 py-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span className="truncate">{error || storageStatus.error}</span>
        </div>
      )}

      {/* Document list */}
      <DragDropZone onFileDrop={handleFileDrop} className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <FileText className="h-8 w-8 opacity-40" />
              <p className="text-xs">{searchQuery ? 'No matches' : 'No documents yet'}</p>
              {!searchQuery && (
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-3 w-3" />
                  Create
                </Button>
              )}
            </div>
          ) : (
            <ul className="divide-y">
              {filteredFiles.map((file) => (
                <li key={file.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'group flex cursor-pointer items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-muted/60',
                      currentFile?.id === file.id && 'bg-primary/5'
                    )}
                    onClick={() => openDocument(file)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDocument(file);
                      }
                    }}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-medium">{file.name}</span>
                        {file.isCompressed && (
                          <Badge variant="outline" className="h-4 px-1 text-[9px] leading-none">
                            zip
                          </Badge>
                        )}
                        {file.tags?.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="h-4 px-1 text-[9px] leading-none">
                            {tag}
                          </Badge>
                        ))}
                        {(file.tags?.length ?? 0) > 2 && (
                          <span className="text-[9px] text-muted-foreground">+{file.tags!.length - 2}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {formatRelativeDate(file.updatedAt)} · {formatFileSize(file.size)}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        title="Duplicate"
                        onClick={() => handleDuplicateFile(file.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        title="Rename"
                        onClick={() => {
                          setRenameValue(file.name);
                          setSelectedFileForAction(file.id);
                          setShowRenameDialog(true);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        title="Delete"
                        onClick={() => {
                          setSelectedFileForAction(file.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DragDropZone>

      {/* Create */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg gap-3 p-4">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-sm">New document</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="h-8 text-sm"
            />
            <textarea
              placeholder="Content (markdown)…"
              value={newFileContent}
              onChange={(e) => setNewFileContent(e.target.value)}
              rows={8}
              className="w-full resize-none rounded-md border bg-background p-2 font-mono text-xs"
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={newFileTags}
              onChange={(e) => setNewFileTags(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleCreateFile}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="max-w-sm gap-3 p-4">
          <DialogHeader>
            <DialogTitle className="text-sm">Rename</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleRenameFile()}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleRenameFile}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Delete document?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              onClick={handleDeleteFile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-lg gap-3 p-4">
          <DialogHeader>
            <DialogTitle className="text-sm">Import</DialogTitle>
          </DialogHeader>
          <textarea
            placeholder="Paste exported JSON…"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            rows={10}
            className="w-full resize-none rounded-md border bg-background p-2 font-mono text-xs"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleImportFiles}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear all */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Clear all documents?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Permanently deletes every document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              onClick={handleClearAllFiles}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Settings */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-sm gap-3 p-4">
          <DialogHeader>
            <DialogTitle className="text-sm">Storage</DialogTitle>
          </DialogHeader>
          <dl className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd className={storageStatus.available ? 'text-green-600' : 'text-destructive'}>
                {storageStatus.available ? 'OK' : 'Error'}
              </dd>
            </div>
            {storageStatus.estimatedSpace != null && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Space</dt>
                <dd>{formatFileSize(storageStatus.estimatedSpace)}</dd>
              </div>
            )}
            <Separator />
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Documents</dt>
              <dd>{stats.totalFiles}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Total size</dt>
              <dd>{formatFileSize(stats.totalSize)}</dd>
            </div>
            {stats.lastModified != null && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Last modified</dt>
                <dd>{formatRelativeDate(stats.lastModified)}</dd>
              </div>
            )}
          </dl>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}
