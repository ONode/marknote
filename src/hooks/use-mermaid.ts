import { useCallback } from 'react';
import mermaid from 'mermaid';
import { needsProcessing, processMermaidCode } from '../lib/mermaid-processor';

export interface UseMermaidOptions {
  domDelay?: number;
  panZoomDelay?: number;
  fallbackDelay?: number;
  enableLogging?: boolean;
}

export interface UseMermaidReturn {
  renderMermaidDiagrams: (
    containerRef: React.RefObject<HTMLDivElement | null>,
    isMounted: boolean,
    addPanZoomToChart: (svgElement: SVGElement, isMounted: boolean) => void
  ) => Promise<void>;
  sanitizeMermaidCode: (code: string) => string;
}

export function useMermaid(options: UseMermaidOptions = {}): UseMermaidReturn {
  const {
    domDelay = 100,
    panZoomDelay = 200,
    fallbackDelay = 300,
    enableLogging = false
  } = options;

  // Function to sanitize mermaid code blocks to prevent parsing issues
  const sanitizeMermaidCode = useCallback((code: string): string => {
    // Normalize line endings (convert CRLF to LF)
    let sanitized = code.replace(/\r\n/g, '\n');
    if (sanitized.includes('gantt')) {
      // Remove multiple consecutive newlines with a single newline
      sanitized = sanitized.replace(/\n\s*\n+/g, '\n');
    }

    const needed = needsProcessing(sanitized);
    if (needed) {
      if (enableLogging) {
        console.log('Mermaid code needs processing');
      }
      const result = processMermaidCode(sanitized);
      sanitized = result.processedCode;
    }

    return sanitized;
  }, []);

  // Function to render mermaid diagrams
  const renderMermaidDiagrams = useCallback(async (
    containerRef: React.RefObject<HTMLDivElement | null>,
    isMounted: boolean,
    addPanZoomToChart: (svgElement: SVGElement, isMounted: boolean) => void
  ) => {
    // Double-check that the ref is still valid
    if (!containerRef.current || !isMounted) {
      if (enableLogging) {
        console.log('Container ref not ready or component unmounted, skipping mermaid rendering');
      }
      return;
    }

    try {
      if (enableLogging) {
        console.log('Attempting to render mermaid diagrams...');
      }

      // Wait for DOM to be fully updated
      await new Promise(resolve => setTimeout(resolve, domDelay));

      // Check again after the delay
      if (!containerRef.current || !isMounted) {
        if (enableLogging) {
          console.log('Container ref lost after delay, skipping mermaid rendering');
        }
        return;
      }

      const mermaidElements = containerRef.current.querySelectorAll('.mermaid');
      if (enableLogging) {
        console.log(`Found ${mermaidElements.length} mermaid elements`);
      }

      if (mermaidElements.length === 0) return;

      // Log the content of each mermaid element
      if (enableLogging) {
        mermaidElements.forEach((element, index) => {
          console.log(`Mermaid element ${index}:`, element.textContent);
        });
      }

      // Render all mermaid diagrams
      try {
        await mermaid.run({
          nodes: Array.from(mermaidElements) as HTMLElement[]
        });

        // Add pan and zoom functionality after rendering is complete
        // Use a small delay to ensure DOM is fully updated
        setTimeout(() => {
          if (containerRef.current && isMounted) {
            const renderedSvgs = containerRef.current.querySelectorAll('.mermaid svg');
            if (renderedSvgs) {
              renderedSvgs.forEach((svg) => {
                if (svg instanceof SVGElement) {
                  if (enableLogging) {
                    console.log('Adding pan and zoom to SVG:', svg);
                  }
                  addPanZoomToChart(svg, isMounted);
                }
              });
            }
          }
        }, panZoomDelay);

      } catch (error) {
        console.error("Error in mermaid.run:", error);
        // Fallback: try to add pan and zoom to any existing SVGs
        setTimeout(() => {
          if (containerRef.current && isMounted) {
            const renderedSvgs = containerRef.current.querySelectorAll('.mermaid svg');
            if (renderedSvgs) {
              renderedSvgs.forEach((svg) => {
                if (svg instanceof SVGElement) {
                  addPanZoomToChart(svg, isMounted);
                }
              });
            }
          }
        }, fallbackDelay);
      }

      if (enableLogging) {
        console.log('Mermaid diagrams rendered successfully');
      }

    } catch (error) {
      console.error("Error rendering mermaid diagrams:", error);
    }
  }, [domDelay, panZoomDelay, fallbackDelay, enableLogging]);

  return {
    renderMermaidDiagrams,
    sanitizeMermaidCode
  };
}
