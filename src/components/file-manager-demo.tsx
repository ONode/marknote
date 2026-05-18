import React, { useState } from 'react';
import { FileManager } from './file-manager';
import { MarkdownEditor } from './markdown-editor';
import { MarkdownViewer } from './markdown-viewer';
import { useFileManager } from '@/hooks/use-file-manager';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Edit3, Eye, Save, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function FileManagerDemo() {
  const {
    files,
    currentFile,
    createFile,
    updateFile,
    saveFile,
    selectFile,
    exportAllFiles,
    importFiles
  } = useFileManager({
    autoSave: true,
    autoSaveDelay: 3000,
    maxFiles: 100
  });

  const [activeTab, setActiveTab] = useState<'files' | 'editor' | 'preview'>('files');
  const [editorContent, setEditorContent] = useState('');

  // Update editor content when current file changes
  React.useEffect(() => {
    if (currentFile) {
      setEditorContent(currentFile.content);
    } else {
      setEditorContent('');
    }
  }, [currentFile]);

  // Handle content changes in editor
  const handleContentChange = (content: string) => {
    setEditorContent(content);
    
    // Auto-save to current file if one is selected
    if (currentFile) {
      updateFile(currentFile.id, content).catch(console.error);
    }
  };

  // Handle save with metadata
  const handleSaveWithMetadata = async () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }

    try {
      await saveFile(currentFile.id, currentFile.name, editorContent, currentFile.tags);
      toast.success('File saved successfully');
    } catch (error) {
      toast.error('Failed to save file');
    }
  };

  // Handle create new file from editor
  const handleCreateFromEditor = async () => {
    if (!editorContent.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    try {
      const fileName = `Untitled Document ${files.length + 1}`;
      await createFile(fileName, editorContent);
      toast.success('New file created from editor content');
    } catch (error) {
      toast.error('Failed to create file');
    }
  };

  // Handle export current file
  const handleExportCurrent = () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }

    try {
      const blob = new Blob([editorContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFile.name}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('File exported successfully');
    } catch (error) {
      toast.error('Failed to export file');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Markdown File Manager Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This demo shows how to integrate the file manager with the markdown editor.
            Create, edit, and manage your markdown files with full localStorage persistence.
          </p>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <FileManager />
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Markdown Editor</span>
                <div className="flex gap-2">
                  {currentFile && (
                    <>
                      <Button onClick={handleSaveWithMetadata} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleExportCurrent} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </>
                  )}
                  <Button onClick={handleCreateFromEditor} variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Create File
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Editing: <span className="font-medium">{currentFile.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {new Date(currentFile.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <MarkdownEditor
                    initialContent={editorContent}
                    onSave={handleContentChange}
                    className="min-h-[500px]"
                    activeTab="edit"
                    onViewModeChange={() => {}}
                    onActiveTabChange={() => {}}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No file selected</p>
                  <p className="mb-4">Select a file from the Files tab to start editing</p>
                  <Button onClick={handleCreateFromEditor}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create New File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Markdown Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {currentFile ? (
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Previewing: <span className="font-medium">{currentFile.name}</span>
                    </p>
                  </div>
                  <MarkdownViewer 
                    content={editorContent} 
                    className="min-h-[500px] prose prose-lg max-w-none dark:prose-invert"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No file selected</p>
                  <p>Select a file from the Files tab to preview its content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveTab('files')}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Files
            </Button>
            <Button
              onClick={() => setActiveTab('editor')}
              variant="outline"
              size="sm"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Open Editor
            </Button>
            <Button
              onClick={() => setActiveTab('preview')}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Mode
            </Button>
            <Button
              onClick={handleCreateFromEditor}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              New File
            </Button>
            <Button
              onClick={() => {
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
                toast.success('All files exported successfully');
              }}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
