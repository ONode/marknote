# 📁 File Management System

## Overview

The File Management System provides a complete client-side file management solution using **localStorage** instead of Next.js cache. This system allows users to create, edit, save, and manage markdown files with full persistence in the browser.

## 🏗️ Architecture

### Core Components

1. **File Actions** (`src/actions/file-actions.ts`) - Core file operations using localStorage
2. **File Manager Hook** (`src/hooks/use-file-manager.ts`) - React hook for file management
3. **File Manager Component** (`src/components/file-manager.tsx`) - UI for file management
4. **File Manager Demo** (`src/components/file-manager-demo.tsx`) - Integration example

### Data Structure

```typescript
interface FileMetadata {
  id: string;           // Unique file identifier
  name: string;         // File name
  content: string;      // File content (markdown)
  createdAt: number;    // Creation timestamp
  updatedAt: number;    // Last modification timestamp
  size: number;         // File size in bytes
  tags?: string[];      // Optional tags for organization
}
```

## 🚀 Getting Started

### Basic Usage

```tsx
import { useFileManager } from '@/hooks/use-file-manager';

function MyComponent() {
  const {
    files,
    currentFile,
    createFile,
    updateFile,
    deleteFile,
    selectFile
  } = useFileManager();

  // Create a new file
  const handleCreate = async () => {
    await createFile('My Document', '# Hello World\n\nThis is my first document.');
  };

  // Update file content
  const handleUpdate = async (id: string, content: string) => {
    await updateFile(id, content);
  };

  return (
    <div>
      <button onClick={handleCreate}>Create File</button>
      {files.map(file => (
        <div key={file.id} onClick={() => selectFile(file.id)}>
          {file.name}
        </div>
      ))}
    </div>
  );
}
```

### Advanced Configuration

```tsx
const fileManager = useFileManager({
  autoSave: true,        // Enable auto-save
  autoSaveDelay: 2000,   // Auto-save delay in milliseconds
  maxFiles: 100          // Maximum number of files
});
```

## 📋 Available Operations

### File Operations

- **Create**: `createFile(name, content, tags?)`
- **Read**: `getFile(id)`, `getAllFiles()`
- **Update**: `updateFile(id, content)`, `saveFile(id, name, content, tags?)`
- **Delete**: `deleteFile(id)`
- **Rename**: `renameFile(id, newName)`
- **Duplicate**: `duplicateFile(id)`

### Search and Filtering

- **Search**: `searchFiles(query)` - Search by name, content, or tags
- **Filter by Tag**: `getFilesByTag(tag)`
- **Recent Files**: `getRecentFiles(limit)`
- **Get All Tags**: `getAllTags()`

### Bulk Operations

- **Export All**: `exportAllFiles()` - Export as JSON
- **Import All**: `importFiles(jsonData)` - Import from JSON
- **Clear All**: `clearAllFiles()` - Remove all files

### Utilities

- **File Stats**: `getFileStats()` - Get total count, size, and last modified
- **Storage Check**: `checkStorageAvailability()` - Check localStorage status

## 🎯 Integration Examples

### With Markdown Editor

```tsx
import { MarkdownEditor } from '@/components/markdown-editor';
import { useFileManager } from '@/hooks/use-file-manager';

function EditorWithFileManager() {
  const { currentFile, updateFile, saveFile } = useFileManager();
  const [content, setContent] = useState('');

  // Auto-save content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (currentFile) {
      updateFile(currentFile.id, newContent);
    }
  };

  // Save with metadata
  const handleSave = async () => {
    if (currentFile) {
      await saveFile(currentFile.id, currentFile.name, content, currentFile.tags);
    }
  };

  return (
    <div>
      {currentFile && (
        <div className="file-info">
          Editing: {currentFile.name}
          <button onClick={handleSave}>Save</button>
        </div>
      )}
      <MarkdownEditor
        initialContent={content}
        onSave={handleContentChange}
      />
    </div>
  );
}
```

### With File List

```tsx
function FileList() {
  const { files, selectFile, deleteFile, currentFile } = useFileManager();

  return (
    <div className="file-list">
      {files.map(file => (
        <div
          key={file.id}
          className={`file-item ${currentFile?.id === file.id ? 'active' : ''}`}
          onClick={() => selectFile(file.id)}
        >
          <h3>{file.name}</h3>
          <p>{file.content.substring(0, 100)}...</p>
          <div className="file-meta">
            <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
            <span>{file.size} bytes</span>
          </div>
          <button onClick={() => deleteFile(file.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Customization

### Custom Storage Keys

```typescript
// In file-actions.ts, modify these constants:
const STORAGE_KEY = 'my-app-files';
const METADATA_KEY = 'my-app-files-metadata';
```

### Custom File Validation

```typescript
// Add validation before saving
export function saveFile(name: string, content: string, id?: string, tags?: string[]) {
  // Validate file name
  if (name.length > 100) {
    throw new Error('File name too long');
  }
  
  // Validate content size
  if (content.length > 1000000) {
    throw new Error('File content too large');
  }
  
  // ... rest of save logic
}
```

### Custom Auto-save Logic

```typescript
// In use-file-manager.ts, customize auto-save behavior
useEffect(() => {
  if (autoSave && currentFile && currentFile.content) {
    const timer = setTimeout(() => {
      // Only auto-save if content has actually changed
      if (currentFile.content !== lastSavedContent) {
        updateFile(currentFile.id, currentFile.content);
        setLastSavedContent(currentFile.content);
      }
    }, autoSaveDelay);
    
    return () => clearTimeout(timer);
  }
}, [currentFile?.content, autoSave, autoSaveDelay]);
```

## 📊 Performance Considerations

### Storage Limits

- **localStorage**: Typically 5-10MB per domain
- **File Size**: Monitor individual file sizes
- **Total Files**: Consider limiting total number of files

### Optimization Tips

1. **Lazy Loading**: Load file content only when needed
2. **Debounced Updates**: Use debounced auto-save to reduce writes
3. **Compression**: Consider compressing large files before storage
4. **Cleanup**: Implement file cleanup for old/unused files

### Memory Management

```typescript
// Example: Clean up old files
export function cleanupOldFiles(maxAge: number = 30 * 24 * 60 * 60 * 1000) {
  const files = getAllFiles();
  const now = Date.now();
  const recentFiles = files.filter(file => (now - file.updatedAt) < maxAge);
  
  if (recentFiles.length < files.length) {
    localStorage.setItem(METADATA_KEY, JSON.stringify(recentFiles));
    return files.length - recentFiles.length;
  }
  
  return 0;
}
```

## 🚨 Error Handling

### Common Errors

1. **Storage Quota Exceeded**: Handle localStorage quota errors
2. **Invalid JSON**: Validate import data before processing
3. **File Not Found**: Handle missing files gracefully

### Error Handling Example

```typescript
try {
  await createFile(name, content);
} catch (error) {
  if (error.message.includes('QuotaExceededError')) {
    toast.error('Storage full. Please delete some files.');
  } else if (error.message.includes('Invalid import')) {
    toast.error('Invalid import format. Please check your data.');
  } else {
    toast.error('Failed to create file. Please try again.');
  }
}
```

## 🔒 Security Considerations

### Data Privacy

- All data is stored locally in the browser
- No data is sent to external servers
- Users have full control over their data

### Input Validation

```typescript
// Sanitize file names
function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')  // Remove invalid characters
    .trim()
    .substring(0, 100);            // Limit length
}

// Validate content
function validateContent(content: string): boolean {
  return content.length <= 1000000; // 1MB limit
}
```

## 📱 Mobile Considerations

### Touch-Friendly Interface

- Large touch targets for file operations
- Swipe gestures for file actions
- Responsive design for small screens

### Performance on Mobile

- Optimize for slower devices
- Reduce auto-save frequency on mobile
- Implement progressive loading

## 🧪 Testing

### Unit Tests

```typescript
// Test file operations
describe('File Actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  test('should create a new file', () => {
    const file = saveFile('test.md', '# Test', undefined, ['test']);
    expect(file.name).toBe('test.md');
    expect(file.content).toBe('# Test');
    expect(file.tags).toEqual(['test']);
  });
  
  test('should handle storage errors', () => {
    // Mock localStorage to throw error
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    
    expect(() => saveFile('test.md', '# Test')).toThrow('Failed to save file');
  });
});
```

### Integration Tests

```typescript
// Test hook integration
describe('useFileManager', () => {
  test('should load files on mount', async () => {
    const { result } = renderHook(() => useFileManager());
    
    // Mock localStorage data
    localStorage.setItem('markdown-files-metadata', JSON.stringify([
      { id: '1', name: 'test.md', content: '# Test', createdAt: Date.now(), updatedAt: Date.now(), size: 6 }
    ]));
    
    await waitFor(() => {
      expect(result.current.files).toHaveLength(1);
    });
  });
});
```

## 🔄 Migration from Next.js Cache

### Before (Next.js Cache)

```typescript
import { revalidatePath } from 'next/cache';

export async function saveFile(data: FormData) {
  // Server action with cache invalidation
  const file = await createFile(data);
  revalidatePath('/files');
  return file;
}
```

### After (localStorage)

```typescript
import { saveFile } from '@/actions/file-actions';

export function saveFileClient(name: string, content: string) {
  // Client-side action with localStorage
  return saveFile(name, content);
}
```

### Benefits of localStorage

1. **No Server Required**: Works completely offline
2. **Instant Updates**: No network latency
3. **Better Performance**: No server round-trips
4. **Privacy**: Data stays on user's device
5. **Cost Effective**: No server hosting costs

## 📚 API Reference

### File Actions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getAllFiles()` | - | `FileMetadata[]` | Get all files |
| `getFile(id)` | `id: string` | `FileMetadata \| null` | Get specific file |
| `saveFile(name, content, id?, tags?)` | `name, content, id?, tags?` | `FileMetadata` | Save/update file |
| `deleteFile(id)` | `id: string` | `boolean` | Delete file |
| `renameFile(id, newName)` | `id, newName` | `FileMetadata \| null` | Rename file |
| `searchFiles(query)` | `query: string` | `FileMetadata[]` | Search files |
| `exportAllFiles()` | - | `string` | Export as JSON |
| `importFiles(jsonData)` | `jsonData: string` | `{success, errors}` | Import from JSON |

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| `files` | `FileMetadata[]` | Array of all files |
| `currentFile` | `FileMetadata \| null` | Currently selected file |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `stats` | `FileStats` | File statistics |
| `tags` | `string[]` | All available tags |

## 🎨 UI Components

### FileManager Component

The `FileManager` component provides a complete file management interface:

- File list with search and filtering
- Create, edit, delete operations
- Tag management
- Import/export functionality
- File statistics display

### FileManagerDemo Component

The `FileManagerDemo` component shows integration with:

- Markdown editor
- File preview
- Tabbed interface
- Quick actions

## 🚀 Future Enhancements

### Planned Features

1. **File Versioning**: Track file history and changes
2. **Cloud Sync**: Optional cloud storage integration
3. **Collaboration**: Real-time collaborative editing
4. **Advanced Search**: Full-text search with filters
5. **File Templates**: Pre-defined markdown templates
6. **Backup/Restore**: Automatic backup functionality

### Extension Points

The system is designed to be easily extensible:

- Custom file types beyond markdown
- Integration with external storage providers
- Custom file validation rules
- Advanced file organization (folders, categories)
- File sharing and collaboration features

## 🤝 Contributing

### Development Setup

1. Install dependencies: `bun install`
2. Run development server: `bun run dev`
3. Run tests: `bun test`
4. Type checking: `bun run type-check`

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Write comprehensive tests
- Document public APIs

### Testing Strategy

- Unit tests for file actions
- Integration tests for hooks
- Component tests for UI
- E2E tests for user workflows
- Performance testing for large files

## 📄 License

This file management system is part of the markdown application and follows the same license terms.
