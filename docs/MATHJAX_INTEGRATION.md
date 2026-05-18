# MathJax-full Integration

This document describes the integration of MathJax-full into the markdown-viewer.tsx component to enhance mathematical expression rendering capabilities.

## Overview

The integration combines three powerful rendering engines:
1. **Mathpix-markdown-it** - Primary markdown processing with LaTeX support
2. **MathJax-full** - Enhanced LaTeX rendering with advanced features
3. **Mermaid** - Diagram rendering with pan/zoom functionality

## Features

### MathJax-full Capabilities
- **Inline Math**: `$E = mc^2$` renders inline mathematical expressions
- **Display Math**: `$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$` renders block equations
- **Advanced LaTeX**: Support for matrices, alignments, fractions, integrals, and more
- **SVG Output**: High-quality vector graphics for mathematical expressions
- **Interactive Menus**: Right-click context menus for math expressions
- **Accessibility**: Screen reader support and semantic markup

### Configuration Options
```typescript
MathJax.config = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: ['base', 'ams', 'noerrors', 'noundefined']
    },
    svg: {
        fontCache: 'global',
        scale: 1,
        minScale: .5,
        mtextInheritFont: true
    },
    options: {
        enableMenu: true,
        menuOptions: {
            settings: {
                texHints: true,
                semantics: false,
                zoom: 'NoZoom',
                zoomFactor: '1.5'
            }
        }
    }
};
```

## Implementation Details

### Dynamic Loading
MathJax-full is loaded dynamically using ES6 dynamic imports to reduce initial bundle size:

```typescript
const MathJax = await import('mathjax-full');
window.MathJax = MathJax;
```

### Processing Pipeline
1. **Markdown Processing**: Mathpix-markdown-it processes the markdown content
2. **Mermaid Detection**: Mermaid code blocks are identified and processed
3. **LaTeX Enhancement**: Remaining LaTeX expressions are marked for MathJax processing
4. **MathJax Rendering**: MathJax processes marked expressions and renders them as SVG

### Error Handling
- Graceful fallback if MathJax fails to load
- Console logging for debugging
- Error boundaries for malformed LaTeX

## Usage Examples

### Basic Inline Math
```markdown
Here's an inline equation: $E = mc^2$ which represents Einstein's mass-energy equivalence.
```

### Display Equations
```markdown
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$
```

### Complex Mathematical Structures
```markdown
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} \begin{pmatrix}
x \\
y
\end{pmatrix} = \begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}$$
```

### Mixed Content
```markdown
This paragraph contains both **bold text** and inline math: $f(x) = x^2 + 2x + 1$.

- List item with math: $\sqrt{2} \approx 1.414$
- Another item: $\pi \approx 3.14159$
```

## Styling

### CSS Classes
- `.mathjax-inline` - Inline mathematical expressions
- `.mathjax-display` - Block mathematical expressions
- `.MathJax` - MathJax-rendered elements
- `.MathJax_SVG` - SVG output elements

### Dark Mode Support
MathJax elements automatically adapt to dark mode using CSS filters:

```css
.dark .MathJax_SVG {
    filter: invert(1) hue-rotate(180deg);
}
```

## Performance Considerations

### Lazy Loading
- MathJax is only loaded when the component mounts
- Processing is deferred until content is ready
- Timeouts ensure proper sequencing of operations

### Memory Management
- Event listeners are properly cleaned up on unmount
- MathJax instances are managed to prevent memory leaks
- SVG elements are optimized for rendering performance

## Testing

### Test Page
Visit `/test-math` to see the MathJax integration in action with various mathematical expressions.

### Test Content
The test page includes:
- Inline and display math
- Complex mathematical structures
- Mermaid diagrams
- Mixed markdown and math content

## Troubleshooting

### Common Issues
1. **MathJax not loading**: Check browser console for import errors
2. **LaTeX not rendering**: Verify LaTeX syntax and MathJax configuration
3. **Styling issues**: Check CSS classes and dark mode compatibility

### Debug Information
Enable console logging to see:
- MathJax loading status
- Processing pipeline steps
- Error details and stack traces

## Dependencies

- `mathjax-full`: ^3.2.2
- `mathpix-markdown-it`: ^2.0.23
- `mermaid`: ^11.4.1

## Browser Support

- Modern browsers with ES6 module support
- SVG rendering capabilities
- Dynamic import support

## Future Enhancements

- WebAssembly-based MathJax for better performance
- Custom LaTeX command definitions
- Math expression search and indexing
- Export capabilities for mathematical content
- Collaborative math editing features
