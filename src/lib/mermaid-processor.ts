/**
 * Mermaid Code Processor
 * 
 * A comprehensive library for processing and fixing Mermaid diagram syntax issues,
 * including missing quotes in node labels, subgraph labels, and other common problems.
 */

export interface MermaidProcessorOptions {
  enableLogging?: boolean;
  fixQuotes?: boolean;
  fixSubgraphLabels?: boolean;
  fixNodeLabels?: boolean;
  normalizeWhitespace?: boolean;
  fixLineBreaks?: boolean;
}

export interface MermaidProcessorResult {
  processedCode: string;
  fixesApplied: string[];
  hasErrors: boolean;
  errors: string[];
}

export class MermaidProcessor {
  private options: Required<MermaidProcessorOptions>;

  constructor(options: MermaidProcessorOptions = {}) {
    this.options = {
      enableLogging: false,
      fixQuotes: true,
      fixSubgraphLabels: true,
      fixNodeLabels: true,
      normalizeWhitespace: true,
      fixLineBreaks: true,
      ...options
    };
  }

  /**
   * Process and fix Mermaid code
   */
  process(code: string): MermaidProcessorResult {
    const fixesApplied: string[] = [];
    const errors: string[] = [];
    let processedCode = code;

    try {
      // Normalize line endings first
      processedCode = this.normalizeLineEndings(processedCode);
      if (processedCode !== code) {
        fixesApplied.push('normalized line endings');
      }

      // Fix subgraph labels (missing quotes)
      if (this.options.fixSubgraphLabels) {
        const subgraphResult = this.fixSubgraphLabels(processedCode);
        if (subgraphResult.fixed) {
          processedCode = subgraphResult.code;
          fixesApplied.push('fixed subgraph labels');
        }
      }

      // Fix node labels (missing quotes)
      if (this.options.fixNodeLabels) {
        const nodeResult = this.fixNodeLabels(processedCode);
        if (nodeResult.fixed) {
          processedCode = nodeResult.code;
          fixesApplied.push('fixed node labels');
        }
      }

      // Fix line breaks in labels
      if (this.options.fixLineBreaks) {
        const lineBreakResult = this.fixLineBreaks(processedCode);
        if (lineBreakResult.fixed) {
          processedCode = lineBreakResult.code;
          fixesApplied.push('fixed line breaks in labels');
        }
      }

      // Normalize whitespace
      if (this.options.normalizeWhitespace) {
        const whitespaceResult = this.normalizeWhitespace(processedCode);
        if (whitespaceResult.fixed) {
          processedCode = whitespaceResult.code;
          fixesApplied.push('normalized whitespace');
        }
      }

      // Validate the processed code
      const validation = this.validateMermaidSyntax(processedCode);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      }

      if (this.options.enableLogging) {
        console.log('MermaidProcessor:', {
          originalLength: code.length,
          processedLength: processedCode.length,
          fixesApplied,
          errors
        });
      }

      return {
        processedCode,
        fixesApplied,
        hasErrors: errors.length > 0,
        errors
      };

    } catch (error) {
      const errorMessage = `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMessage);
      
      if (this.options.enableLogging) {
        console.error('MermaidProcessor error:', error);
      }

      return {
        processedCode: code, // Return original code on error
        fixesApplied,
        hasErrors: true,
        errors
      };
    }
  }

  /**
   * Normalize line endings to LF
   */
  private normalizeLineEndings(code: string): string {
    return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  /**
   * Fix missing quotes in subgraph labels
   * Handles patterns like: subgraph "Label" and subgraph Label
   */
  private fixSubgraphLabels(code: string): { code: string; fixed: boolean } {
    let fixed = false;
    let processedCode = code;

    // Pattern 1: subgraph Label -> subgraph "Label"
    processedCode = processedCode.replace(
      /subgraph\s+([A-Za-z][A-Za-z0-9\s\-_]*[A-Za-z0-9])\s*$/gm,
      (match, label) => {
        if (!label.startsWith('"') && !label.endsWith('"')) {
          fixed = true;
          return `subgraph "${label.trim()}"`;
        }
        return match;
      }
    );

    // Pattern 2: subgraph "Label -> subgraph "Label" (missing closing quote)
    processedCode = processedCode.replace(
      /subgraph\s+"([^"]*?)(?:\s*$|\s*{)/gm,
      (match, label) => {
        if (!match.includes('"', match.indexOf('"') + 1)) {
          fixed = true;
          return `subgraph "${label.trim()}"`;
        }
        return match;
      }
    );

    return { code: processedCode, fixed };
  }

  /**
   * Fix missing quotes in node labels
   * Handles patterns like: A[Label] -> A["Label"]
   */
  private fixNodeLabels(code: string): { code: string; fixed: boolean } {
    let fixed = false;
    let processedCode = code;

    // Pattern 1: Node[Label] -> Node["Label"] (when label contains spaces or special chars)
    processedCode = processedCode.replace(
      /(\w+)\[([^\[\]"]+?)\]/g,
      (match, nodeId, label) => {
        const trimmedLabel = label.trim();
        
        // Only add quotes if the label contains spaces, special characters, or is not already quoted
        if (trimmedLabel.includes(' ') || 
            trimmedLabel.includes('<') || 
            trimmedLabel.includes('>') ||
            trimmedLabel.includes('&') ||
            trimmedLabel.includes('(') ||
            trimmedLabel.includes(')') ||
            trimmedLabel.includes('/') ||
            trimmedLabel.includes('\\') ||
            trimmedLabel.includes('|') ||
            trimmedLabel.includes('*') ||
            trimmedLabel.includes('+') ||
            trimmedLabel.includes('=') ||
            trimmedLabel.includes('!') ||
            trimmedLabel.includes('@') ||
            trimmedLabel.includes('#') ||
            trimmedLabel.includes('$') ||
            trimmedLabel.includes('%') ||
            trimmedLabel.includes('^') ||
            trimmedLabel.includes('~') ||
            trimmedLabel.includes('`') ||
            trimmedLabel.includes('[') ||
            trimmedLabel.includes(']') ||
            trimmedLabel.includes('{') ||
            trimmedLabel.includes('}') ||
            trimmedLabel.includes(';') ||
            trimmedLabel.includes(':') ||
            trimmedLabel.includes('"') ||
            trimmedLabel.includes("'") ||
            trimmedLabel.includes(',') ||
            trimmedLabel.includes('.') ||
            trimmedLabel.includes('?') ||
            trimmedLabel.includes('!')) {
          fixed = true;
          return `${nodeId}["${trimmedLabel}"]`;
        }
        return match;
      }
    );

    // Pattern 2: Node(Label) -> Node("Label") for round brackets
    processedCode = processedCode.replace(
      /(\w+)\(([^()"]+?)\)/g,
      (match, nodeId, label) => {
        const trimmedLabel = label.trim();
        
        if (trimmedLabel.includes(' ') || 
            trimmedLabel.includes('<') || 
            trimmedLabel.includes('>') ||
            trimmedLabel.includes('&') ||
            trimmedLabel.includes('(') ||
            trimmedLabel.includes(')') ||
            trimmedLabel.includes('/') ||
            trimmedLabel.includes('\\') ||
            trimmedLabel.includes('|') ||
            trimmedLabel.includes('*') ||
            trimmedLabel.includes('+') ||
            trimmedLabel.includes('=') ||
            trimmedLabel.includes('!') ||
            trimmedLabel.includes('@') ||
            trimmedLabel.includes('#') ||
            trimmedLabel.includes('$') ||
            trimmedLabel.includes('%') ||
            trimmedLabel.includes('^') ||
            trimmedLabel.includes('~') ||
            trimmedLabel.includes('`') ||
            trimmedLabel.includes('[') ||
            trimmedLabel.includes(']') ||
            trimmedLabel.includes('{') ||
            trimmedLabel.includes('}') ||
            trimmedLabel.includes(';') ||
            trimmedLabel.includes(':') ||
            trimmedLabel.includes('"') ||
            trimmedLabel.includes("'") ||
            trimmedLabel.includes(',') ||
            trimmedLabel.includes('.') ||
            trimmedLabel.includes('?') ||
            trimmedLabel.includes('!')) {
          fixed = true;
          return `${nodeId}("${trimmedLabel}")`;
        }
        return match;
      }
    );

    // Pattern 3: Node{Label} -> Node{"Label"} for curly brackets
    processedCode = processedCode.replace(
      /(\w+)\{([^{}"]+?)\}/g,
      (match, nodeId, label) => {
        const trimmedLabel = label.trim();
        
        if (trimmedLabel.includes(' ') || 
            trimmedLabel.includes('<') || 
            trimmedLabel.includes('>') ||
            trimmedLabel.includes('&') ||
            trimmedLabel.includes('(') ||
            trimmedLabel.includes(')') ||
            trimmedLabel.includes('/') ||
            trimmedLabel.includes('\\') ||
            trimmedLabel.includes('|') ||
            trimmedLabel.includes('*') ||
            trimmedLabel.includes('+') ||
            trimmedLabel.includes('=') ||
            trimmedLabel.includes('!') ||
            trimmedLabel.includes('@') ||
            trimmedLabel.includes('#') ||
            trimmedLabel.includes('$') ||
            trimmedLabel.includes('%') ||
            trimmedLabel.includes('^') ||
            trimmedLabel.includes('~') ||
            trimmedLabel.includes('`') ||
            trimmedLabel.includes('[') ||
            trimmedLabel.includes(']') ||
            trimmedLabel.includes('{') ||
            trimmedLabel.includes('}') ||
            trimmedLabel.includes(';') ||
            trimmedLabel.includes(':') ||
            trimmedLabel.includes('"') ||
            trimmedLabel.includes("'") ||
            trimmedLabel.includes(',') ||
            trimmedLabel.includes('.') ||
            trimmedLabel.includes('?') ||
            trimmedLabel.includes('!')) {
          fixed = true;
          return `${nodeId}{"${trimmedLabel}"}`;
        }
        return match;
      }
    );

    return { code: processedCode, fixed };
  }

  /**
   * Fix line breaks in labels by converting them to <br/> tags
   */
  private fixLineBreaks(code: string): { code: string; fixed: boolean } {
    let fixed = false;
    let processedCode = code;

    // Convert line breaks in quoted labels to <br/> tags
    processedCode = processedCode.replace(
      /(\w+)\["([^"]*?)\n([^"]*?)"\]/g,
      (match, nodeId, labelPart1, labelPart2) => {
        fixed = true;
        return `${nodeId}["${labelPart1.trim()}<br/>${labelPart2.trim()}"]`;
      }
    );

    // Convert line breaks in round bracket labels
    processedCode = processedCode.replace(
      /(\w+)\("([^"]*?)\n([^"]*?)"\)/g,
      (match, nodeId, labelPart1, labelPart2) => {
        fixed = true;
        return `${nodeId}("${labelPart1.trim()}<br/>${labelPart2.trim()}")`;
      }
    );

    // Convert line breaks in curly bracket labels
    processedCode = processedCode.replace(
      /(\w+)\{"([^"]*?)\n([^"]*?)"\}/g,
      (match, nodeId, labelPart1, labelPart2) => {
        fixed = true;
        return `${nodeId}{"${labelPart1.trim()}<br/>${labelPart2.trim()}"}`;
      }
    );

    return { code: processedCode, fixed };
  }

  /**
   * Normalize whitespace in the diagram
   */
  private normalizeWhitespace(code: string): { code: string; fixed: boolean } {
    let fixed = false;
    let processedCode = code;

    // Remove excessive whitespace but preserve intentional spacing
    const originalLength = processedCode.length;
    processedCode = processedCode
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+$/gm, '') // Remove trailing spaces
      .replace(/^[ \t]+/gm, (match) => match.length > 0 ? '  ' : '') // Normalize indentation to 2 spaces
      .trim();

    if (processedCode.length !== originalLength) {
      fixed = true;
    }

    return { code: processedCode, fixed };
  }

  /**
   * Validate Mermaid syntax
   */
  private validateMermaidSyntax(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Basic syntax checks
      const lines = code.split('\n');
      
      // Check for balanced brackets
      let bracketCount = 0;
      let parenCount = 0;
      let braceCount = 0;
      
      for (const line of lines) {
        for (const char of line) {
          if (char === '[') bracketCount++;
          if (char === ']') bracketCount--;
          if (char === '(') parenCount++;
          if (char === ')') parenCount--;
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
      }

      if (bracketCount !== 0) {
        errors.push(`Unbalanced square brackets: ${bracketCount > 0 ? 'missing' : 'extra'} closing brackets`);
      }
      if (parenCount !== 0) {
        errors.push(`Unbalanced parentheses: ${parenCount > 0 ? 'missing' : 'extra'} closing parentheses`);
      }
      if (braceCount !== 0) {
        errors.push(`Unbalanced braces: ${braceCount > 0 ? 'missing' : 'extra'} closing braces`);
      }

      // Check for common syntax issues
      if (code.includes('-->') && code.includes('--->')) {
        errors.push('Mixed arrow types detected (--> and --->)');
      }

      // Check for unclosed quotes in labels
      const quoteMatches = code.match(/["']/g);
      if (quoteMatches && quoteMatches.length % 2 !== 0) {
        errors.push('Unclosed quotes detected in labels');
      }

      return {
        isValid: errors.length === 0,
        errors
      };

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        errors
      };
    }
  }

  /**
   * Get a summary of common Mermaid issues and their fixes
   */
  static getCommonIssues(): Array<{ pattern: string; description: string; fix: string }> {
    return [
      {
        pattern: 'A[Label with spaces]',
        description: 'Node labels with spaces need quotes',
        fix: 'A["Label with spaces"]'
      },
      {
        pattern: 'subgraph Label',
        description: 'Subgraph labels need quotes',
        fix: 'subgraph "Label"'
      },
      {
        pattern: 'A[Multi-line\nLabel]',
        description: 'Multi-line labels need <br/> tags',
        fix: 'A["Multi-line<br/>Label"]'
      },
      {
        pattern: 'A[Label with & symbols]',
        description: 'Special characters in labels need quotes',
        fix: 'A["Label with & symbols"]'
      }
    ];
  }
}

/**
 * Convenience function for quick processing
 */
export function processMermaidCode(
  code: string, 
  options: MermaidProcessorOptions = {}
): MermaidProcessorResult {
  const processor = new MermaidProcessor(options);
  return processor.process(code);
}

/**
 * Check if a Mermaid code block needs processing
 */
export function needsProcessing(code: string): boolean {
  const processor = new MermaidProcessor();
  const result = processor.process(code);
  return result.fixesApplied.length > 0;
}

export default MermaidProcessor;
