# Math Rendering with mathpix-markdown-it

This document explains how to use the enhanced math rendering capabilities in the Markdown Mermaid Viewer.

## Overview

The application now supports high-quality mathematical equation rendering using `mathpix-markdown-it` while maintaining full compatibility with existing Mermaid chart functionality.

## Math Syntax

### Inline Math
Use `\(` and `\)` delimiters for inline mathematical expressions:

```markdown
The quadratic formula is \( x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \).
```

### Display Math
Use `\[` and `\]` delimiters for standalone equations:

```markdown
The integral formula:
\[ \int_a^b f(x) dx = F(b) - F(a) \]
```

## Supported Math Features

### Basic Operations
- **Fractions**: `\frac{numerator}{denominator}`
- **Powers**: `x^2`, `x^{n+1}`
- **Subscripts**: `x_i`, `x_{i,j}`
- **Square roots**: `\sqrt{x}`, `\sqrt[n]{x}`
- **Greek letters**: `\alpha`, `\beta`, `\gamma`, `\Delta`, `\pi`

### Advanced Features
- **Matrices**: `\begin{pmatrix} a & b \\ c & d \end{pmatrix}`
- **Summations**: `\sum_{i=1}^{n} i`
- **Products**: `\prod_{k=1}^{n} k`
- **Integrals**: `\int_a^b f(x) dx`
- **Limits**: `\lim_{x \to \infty} f(x)`
- **Partial derivatives**: `\frac{\partial f}{\partial x}`

### Physics and Engineering
- **Vectors**: `\mathbf{v}`, `\vec{v}`
- **Operators**: `\nabla`, `\nabla^2`
- **Quantum mechanics**: `\hbar`, `\Psi`
- **Special functions**: `\sin`, `\cos`, `\tan`, `\log`, `\ln`

## Examples

### Basic Math
```markdown
## Algebra
The quadratic equation \( ax^2 + bx + c = 0 \) has solutions:
\[ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \]

## Calculus
The derivative of \( x^n \) is:
\[ \frac{d}{dx}x^n = nx^{n-1} \]
```

### Advanced Math
```markdown
## Linear Algebra
Matrix multiplication:
\[ \begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix} \]

## Series
Geometric series sum:
\[ \sum_{n=0}^{\infty} r^n = \frac{1}{1-r} \text{ for } |r| < 1 \]
```

### Physics Equations
```markdown
## Classical Mechanics
Newton's second law:
\[ \mathbf{F} = m\mathbf{a} \]

## Electromagnetism
Maxwell's equations:
\[ \nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0} \]
\[ \nabla \times \mathbf{B} = \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t} \]

## Quantum Mechanics
Schrödinger equation:
\[ i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t) \]
```

## Combining Math with Mermaid

You can mix mathematical equations with Mermaid diagrams:

```markdown
## Mathematical Process Flow

The process involves solving the equation:
\[ \frac{dx}{dt} = kx(1-x) \]

\`\`\`mermaid
flowchart LR
    A[Initial Value] --> B[Calculate dx/dt]
    B --> C[Update x]
    C --> D{Converged?}
    D -->|No| B
    D -->|Yes| E[Final Result]
\`\`\`

The solution converges to \( x = 1 \) as \( t \to \infty \).
```

## Configuration

The math rendering is configured with the following options:

```typescript
const html = MathpixMarkdownModel.markdownToHTML(content, {
  outMath: {
    include_latex: false,  // Keep LaTeX for debugging/accessibility
    include_svg: true,    // Render equations as SVG for high quality
  }
});
```

## Browser Compatibility

- **Modern browsers**: Full support for SVG math rendering
- **Accessibility**: MathML output for screen readers
- **Fallback**: LaTeX source preserved for compatibility

## Performance

- Math equations are rendered as high-quality SVG
- Lazy loading of math rendering libraries
- Efficient DOM sanitization preserving math elements
- Minimal impact on existing Mermaid chart performance

## Troubleshooting

### Math Not Rendering
1. Check that you're using the correct delimiters (`\(` and `\)` for inline, `\[` and `\]` for display)
2. Ensure LaTeX syntax is valid
3. Check browser console for any JavaScript errors

### Rendering Issues
1. Complex equations may take a moment to render
2. Very long equations might need line breaks
3. Some LaTeX packages may not be supported

### Integration Issues
1. Math rendering works alongside Mermaid charts
2. Both systems use separate rendering pipelines
3. No conflicts between math and chart rendering

## Best Practices

1. **Use appropriate delimiters**: Inline math for short expressions, display math for equations
2. **Keep equations readable**: Break long equations across multiple lines
3. **Test rendering**: Preview your markdown to ensure proper math display
4. **Accessibility**: Consider adding alt text for complex equations
5. **Performance**: Avoid excessive use of complex equations in a single document

## Examples in Action

Visit `/test-math` in the application to see live examples of:
- Basic mathematical operations
- Advanced mathematical concepts
- Physics and engineering equations
- Mixed content with Mermaid charts

## Technical Details

- **Library**: mathpix-markdown-it 2.0.23
- **Math Engine**: MathJax-compatible rendering
- **Output Format**: SVG + MathML
- **Integration**: Seamless with existing markdown-it pipeline
- **Sanitization**: DOMPurify with math element preservation
