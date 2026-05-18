import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert LaTeX delimiters to KaTeX format
 * Converts \( \) to $ $ and \[ \] to $$ $$
 */
export function convertLatexDelimiters(text: string): string {
    // Convert LaTeX inline math delimiters \( \) to $ $
    const inlineMathRegex = /\\\([\s\S]*?\\\)/g;
    let result = text.replace(inlineMathRegex, (match) => {
      const content = match.slice(2, -2); // Remove \( and \)
      return `$${content}$`;
    });

    // Convert LaTeX block math delimiters \[ \] to $$ $$
    const blockMathRegex = /\\\[[\s\S]*?\\\]/g;
    result = result.replace(blockMathRegex, (match) => {
      const content = match.slice(2, -2); // Remove \[ and \]
      return `$$${content}$$`;
    });

    return result;
}

export function convertLatexToKatex(text: string): string {
    let result = text;
    
    // Convert LaTeX commands to KaTeX-compatible equivalents
    const latexToKatexConversions = [
        // Text commands - escape underscores to prevent subscript interpretation
        { from: /\\mbox\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textrm\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textnormal\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textup\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textmd\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textsf\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\texttt\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textsc\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textsl\{([^}]+)\}/g, to: '\\text{$1}' },
        { from: /\\textbf\{([^}]+)\}/g, to: '\\textbf{$1}' },
        { from: /\\textit\{([^}]+)\}/g, to: '\\textit{$1}' },
        { from: /\\textem\{([^}]+)\}/g, to: '\\textit{$1}' },
        
        // Math operators
        { from: /\\operatorname\{([^}]+)\}/g, to: '\\operatorname{$1}' },
        { from: /\\mathop\{([^}]+)\}/g, to: '\\mathop{$1}' },
        
        // Common function conversions
        { from: /\\hash/g, to: '\\operatorname{hash}' },
        { from: /\\mod(?![a-zA-Z])/g, to: '\\bmod' },
        { from: /\\pmod\{([^}]+)\}/g, to: '\\pmod{$1}' },
        { from: /\\gcd/g, to: '\\operatorname{gcd}' },
        { from: /\\lcm/g, to: '\\operatorname{lcm}' },
        { from: /\\log/g, to: '\\log' },
        { from: /\\ln/g, to: '\\ln' },
        { from: /\\sin/g, to: '\\sin' },
        { from: /\\cos/g, to: '\\cos' },
        { from: /\\tan/g, to: '\\tan' },
        { from: /\\arcsin/g, to: '\\arcsin' },
        { from: /\\arccos/g, to: '\\arccos' },
        { from: /\\arctan/g, to: '\\arctan' },
        { from: /\\sinh/g, to: '\\sinh' },
        { from: /\\cosh/g, to: '\\cosh' },
        { from: /\\tanh/g, to: '\\tanh' },
        { from: /\\exp/g, to: '\\exp' },
        { from: /\\max/g, to: '\\max' },
        { from: /\\min/g, to: '\\min' },
        { from: /\\sup/g, to: '\\sup' },
        { from: /\\inf/g, to: '\\inf' },
        { from: /\\lim/g, to: '\\lim' },
        { from: /\\limsup/g, to: '\\limsup' },
        { from: /\\liminf/g, to: '\\liminf' },
        { from: /\\det/g, to: '\\det' },
        { from: /\\dim/g, to: '\\dim' },
        { from: /\\ker/g, to: '\\ker' },
        { from: /\\deg/g, to: '\\deg' },
        { from: /\\arg/g, to: '\\arg' },
        { from: /\\lg/g, to: '\\lg' },
        { from: /\\Pr/g, to: '\\Pr' },
        
        // Spacing commands
        { from: /\\thinspace/g, to: '\\,' },
        { from: /\\medspace/g, to: '\\:' },
        { from: /\\thickspace/g, to: '\\;' },
        { from: /\\quad/g, to: '\\quad' },
        { from: /\\qquad/g, to: '\\qquad' },
        { from: /\\negthinspace/g, to: '\\!' },
        { from: /\\negmedspace/g, to: '\\!' },
        { from: /\\negthickspace/g, to: '\\!' },
        
        // Delimiters (these are already KaTeX compatible, so no conversion needed)
        // { from: /\\left\\|/g, to: '\\left\\|' },
        // { from: /\\right\\|/g, to: '\\right\\|' },
        // { from: /\\left\\{/g, to: '\\left\\{' },
        // { from: /\\right\\}/g, to: '\\right\\}' },
        // { from: /\\left\[/g, to: '\\left[' },
        // { from: /\\right\]/g, to: '\\right]' },
        // { from: /\\left\(/g, to: '\\left(' },
        // { from: /\\right\)/g, to: '\\right)' },
        
        // Fractions and roots
        { from: /\\dfrac\{([^}]+)\}\{([^}]+)\}/g, to: '\\frac{$1}{$2}' },
        { from: /\\tfrac\{([^}]+)\}\{([^}]+)\}/g, to: '\\frac{$1}{$2}' },
        { from: /\\cfrac\{([^}]+)\}\{([^}]+)\}/g, to: '\\frac{$1}{$2}' },
        
        // Matrix environments
        { from: /\\begin\{pmatrix\}/g, to: '\\begin{pmatrix}' },
        { from: /\\end\{pmatrix\}/g, to: '\\end{pmatrix}' },
        { from: /\\begin\{bmatrix\}/g, to: '\\begin{bmatrix}' },
        { from: /\\end\{bmatrix\}/g, to: '\\end{bmatrix}' },
        { from: /\\begin\{vmatrix\}/g, to: '\\begin{vmatrix}' },
        { from: /\\end\{vmatrix\}/g, to: '\\end{vmatrix}' },
        { from: /\\begin\{Vmatrix\}/g, to: '\\begin{Vmatrix}' },
        { from: /\\end\{Vmatrix\}/g, to: '\\end{Vmatrix}' },
        
        // Cases environment
        { from: /\\begin\{cases\}/g, to: '\\begin{cases}' },
        { from: /\\end\{cases\}/g, to: '\\end{cases}' },
        
        // Alignment environments
        { from: /\\begin\{align\}/g, to: '\\begin{align}' },
        { from: /\\end\{align\}/g, to: '\\end{align}' },
        { from: /\\begin\{align\*\}/g, to: '\\begin{align*}' },
        { from: /\\end\{align\*\}/g, to: '\\end{align*}' },
        { from: /\\begin\{eqnarray\}/g, to: '\\begin{align}' },
        { from: /\\end\{eqnarray\}/g, to: '\\end{align}' },
        { from: /\\begin\{eqnarray\*\}/g, to: '\\begin{align*}' },
        { from: /\\end\{eqnarray\*\}/g, to: '\\end{align*}' },
        
        // Other common commands
        { from: /\\mathbb\{([^}]+)\}/g, to: '\\mathbb{$1}' },
        { from: /\\mathcal\{([^}]+)\}/g, to: '\\mathcal{$1}' },
        { from: /\\mathfrak\{([^}]+)\}/g, to: '\\mathfrak{$1}' },
        { from: /\\mathrm\{([^}]+)\}/g, to: '\\mathrm{$1}' },
        { from: /\\mathbf\{([^}]+)\}/g, to: '\\mathbf{$1}' },
        { from: /\\mathit\{([^}]+)\}/g, to: '\\mathit{$1}' },
        { from: /\\mathsf\{([^}]+)\}/g, to: '\\mathsf{$1}' },
        { from: /\\mathtt\{([^}]+)\}/g, to: '\\mathtt{$1}' },
        
        // Remove unsupported commands (replace with empty string)
        { from: /\\usepackage\{[^}]+\}/g, to: '' },
        { from: /\\documentclass\{[^}]+\}/g, to: '' },
        { from: /\\begin\{document\}/g, to: '' },
        { from: /\\end\{document\}/g, to: '' },
        { from: /\\title\{[^}]*\}/g, to: '' },
        { from: /\\author\{[^}]*\}/g, to: '' },
        { from: /\\date\{[^}]*\}/g, to: '' },
        { from: /\\maketitle/g, to: '' },
    ];
    
    // Apply all conversions
    latexToKatexConversions.forEach(({ from, to }) => {
        result = result.replace(from, to);
    });
    
    // Post-process: escape special characters in \text{} commands
    result = result.replace(/\\text\{([^}]+)\}/g, (match, content) => {
        return `\\text{${content
            .replace(/_/g, '\\_')  // Escape underscores to prevent subscript interpretation
            .replace(/%/g, '\\%')  // Escape percent signs to prevent comment interpretation
        }}`;
    });
    
    return result;
}