

import React, { useEffect, useRef, useCallback } from "react";
import { Card } from "./ui/card";
import { cn, convertLatexDelimiters, convertLatexToKatex } from "../lib/utils";
import mermaid from "mermaid";
import { Marked, Renderer, type Tokens } from 'marked';
import { usePanZoom } from '../hooks/use-pan-zoom';
import { useMermaid } from '../hooks/use-mermaid';
import hljs from 'highlight.js';
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";
import markedCodePreview from "marked-code-preview";

// Initialize mermaid with better error handling
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    logLevel: 'error'
});
const katexOptions = {
    throwOnError: false, // Don't throw errors, render them instead
    output: "html" as const, // Use HTML output instead of MathML
    displayMode: false, // Let the extension determine display mode
    minRuleThickness: 0.15,
    maxExpand: 900,
    maxSize: 100000,
    nonStandard: true, // Allow non-standard LaTeX commands
};
// Create a function to create marked instance with custom renderer
const createMarkedInstance = (customRenderer: any) => {
    const instance = new Marked(
        markedHighlight({
            emptyLangClass: 'hljs',
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                // Skip highlighting for mermaid diagrams - they'll be handled by our custom renderer
                if (lang === 'mermaid') {
                    return code;
                }
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        }),
        {
            renderer: customRenderer,
            // Ensure inline parsing is enabled
            breaks: true,
            gfm: true,
            // Force inline parsing for list items
            pedantic: false
        }
    );

    instance.use(markedKatex(katexOptions));
    instance.use(markedCodePreview());
    //instance.use(extendedLatex());
    return instance;
};

// Create a function to create the custom renderer with access to sanitizeMermaidCode
const createCustomRenderer = (sanitizeMermaidCode: (code: string) => string): any => {
    // Create a new renderer instance to get default behavior
    const renderer = new Renderer();

    // Currency renderer is now handled by the extension itself

    // Create a marked instance for inline parsing within list items
    const inlineMarked = new Marked({
        breaks: true,
        gfm: true,
        pedantic: false,
        renderer: renderer
    });
    inlineMarked.use(markedKatex(katexOptions));
    inlineMarked.use(markedCodePreview());

    // Create a temporary marked instance with code highlighting for inline parsing
    const tempMarked = new Marked(
        markedHighlight({
            emptyLangClass: 'hljs',
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                // Skip highlighting for mermaid diagrams
                if (lang === 'mermaid') {
                    return code;
                }
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        }),
        {
            breaks: true,
            gfm: true,
            pedantic: false,
            renderer: renderer
        }
    );
    tempMarked.use(markedKatex(katexOptions));
    tempMarked.use(markedCodePreview());

    renderer.paragraph = function (text: Tokens.Paragraph): string {
        const textContent = String(text.raw || text);
        const result = inlineMarked.parseInline(textContent);
        return `<p class="story">${result}</p>`;
    }

    // Override only the methods we need to customize - normally this is thje title
    renderer.text = function (text: Tokens.Text | Tokens.Escape) {
        const textContent = String(text.text || text);
        let processedText = textContent;
        return processedText; // Default behavior for other text
    };

    renderer.list = function (list: Tokens.List): string {
        const type = list.ordered ? 'ol' : 'ul';
        const startAttr = list.ordered && list.start !== 1 ? ` start="${list.start}"` : '';
        return `<${type}${startAttr} class="L1">${list.items.map(item => this.listitem(item)).join('')}</${type}>`;
    };

    renderer.listitem = function (item: Tokens.ListItem): string {
        // Since marked.js doesn't parse inline content in list items with custom renderers,
        // we need to manually parse the text content
        let processedContent = '';
        if (item.text) {
            const sample_context = item.text;
            try {
                // Parse the text as inline content to get proper tokenization with code highlighting
                const result = tempMarked.parseInline(sample_context);
                processedContent = typeof result === 'string' ? result : sample_context;
            } catch (parseError) {
                console.log('Inline parsing failed, using raw text:', parseError);
                // Use raw text if parsing fails
                processedContent = sample_context;
            }
        } else if (item.tokens && item.tokens.length > 0) {
            // If we somehow have tokens, process them
            processedContent = item.tokens.map(token => {
                console.log('Processing token in listitem:', token.type, token);
                const rendererMethod = (this as any)[token.type];
                if (!rendererMethod) {
                    console.log(`[WARNING] No renderer method found for token type: ${token.type}`);
                }
                return rendererMethod ? rendererMethod.call(this, token) : token.raw || '';
            }).join('');
        }

        return `<li class="L1i">${processedContent}</li>\n`;
    };

    // Enhanced strong/bold text renderer for filename-description format
    renderer.strong = function (text: Tokens.Strong): string {
        const textContent = String(text.text || text);
        // Default strong rendering for ALL other cases (any text with **)
        return `<strong>${textContent}</strong>`;
    };

    renderer.code = function (code: Tokens.Code): string {
        if (code.lang === 'mermaid') {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const codeString = typeof code === 'string' ? code : code.text || String(code);
            const sanitizedCode = sanitizeMermaidCode(codeString);
            return `<div class="mermaid" id="${id}">${sanitizedCode}</div>`;
        }

        // Use default code rendering for other languages
        return this.constructor.prototype.code.call(this, code);
        //return `<pre><code class="hljs ${code.lang ? 'language-' + code.lang : ''}">${hljs.highlightAuto(code.text || String(code)).value}</code></pre>`;
    };
    renderer.tablecell = function (cell: Tokens.TableCell): string {
        const tag = cell.header ? 'th' : 'td';
        const sample_context = cell.text;
        const result = tempMarked.parseInline(sample_context);
        return `<${tag} class="L2c">${result}</${tag}>`;
    };

    return renderer;
};

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [processedHtml, setProcessedHtml] = React.useState<string>("");
    const [isMounted, setIsMounted] = React.useState(false);
    const mermaidRenderedRef = useRef<boolean>(false);

    // Use the pan and zoom hook
    const { addPanZoomToChart } = usePanZoom({
        minScale: 0.5,
        maxScale: 10,
        zoomFactor: 0.1,
        resetOnMouseLeave: true
    });

    // Use the mermaid hook
    const { renderMermaidDiagrams, sanitizeMermaidCode } = useMermaid({
        domDelay: 100,
        panZoomDelay: 200,
        fallbackDelay: 300,
        enableLogging: false
    });

    // Create custom renderer with access to sanitizeMermaidCode
    const customRenderer = React.useMemo(() => createCustomRenderer(sanitizeMermaidCode), [sanitizeMermaidCode]);

    // Function to process markdown with marked and custom mermaid handling
    const processMarkdown = useCallback((contentToProcess: string, renderer: any) => {
        try {
            if (!contentToProcess.trim()) {
                return "";
            }
            // Pre-process: Handle indented LaTeX content
            // Markdown treats indented content as code blocks, so we need to unindent LaTeX math
            let processedContent = contentToProcess;
            
            // Find and unindent LaTeX math expressions that are indented
            // Handle all types of whitespace: spaces, tabs, and mixed indentation
            processedContent = processedContent.replace(/^(\s+)(\\[\[\(][\s\S]*?\\[\]\)])/gm, (match, indent, math) => {
                // Count effective indentation (tabs count as 4 spaces, spaces count as 1)
                const effectiveIndent = indent.replace(/\t/g, '    ').length;
                
                // Only unindent if it's significantly indented (4+ effective spaces) and contains LaTeX delimiters
                if (effectiveIndent >= 4) {
                    console.log(`[LaTeX Unindent] Unindenting math (${effectiveIndent} effective spaces): ${math}`);
                    return math; // Remove the indentation
                }
                return match; // Keep original if not significantly indented
            });
            
            // Convert LaTeX delimiters in the entire content first
            processedContent = convertLatexDelimiters(processedContent);
            
            // Convert LaTeX syntax to KaTeX-compatible syntax
            processedContent = convertLatexToKatex(processedContent);
            
            // Protect currency amounts by replacing them with placeholders
            // Use dynamic regex-based approach to catch all currency patterns
            const currencyPlaceholders: string[] = [];
            
            // Dynamic currency pattern matching using regex
            // This will match any $ followed by numbers (with optional decimal) and M/K/B suffix
            // Examples: $1M, $47.5M, $1000K, $2.3B, etc.
            const currencyRegex = /\$(\d+(?:\.\d+)?[MKB])(?=\s|$|[^\w])/g;
            
            processedContent = processedContent.replace(currencyRegex, (match) => {
                const placeholder = `CURRENCY_PLACEHOLDER_${currencyPlaceholders.length}`;
                currencyPlaceholders.push(match);
                console.log(`[Currency Protection] Dynamic replaced ${match} with ${placeholder}`);
                return placeholder;
            });
            
            // Create marked instance with custom renderer
            const markedInstance = createMarkedInstance(renderer);
            let renderedHtml = markedInstance.parse(processedContent) as string;
            
            // Restore currency placeholders
            currencyPlaceholders.forEach((currency, index) => {
                const placeholder = `CURRENCY_PLACEHOLDER_${index}`;
                renderedHtml = renderedHtml.replace(new RegExp(placeholder, 'g'), currency);
            });
            
            return renderedHtml;
        } catch (error) {
            console.error("Error processing markdown:", error);
            return `<div class="error">${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
    }, []);

    // Set mounted state when component mounts
    useEffect(() => {
        console.log('Component mounting, setting isMounted to true');
        setIsMounted(true);
        return () => {
            console.log('Component unmounting, setting isMounted to false');
            setIsMounted(false);
            // Reset mermaid rendered flag on unmount
            mermaidRenderedRef.current = false;
        };
    }, []);

    // Process markdown when content changes
    useEffect(() => {
        if (isMounted && content && content.trim()) {
            console.log('Processing markdown content...');
            const html = processMarkdown(content, customRenderer);
            console.log('Markdown processing completed, setting processedHtml');
            setProcessedHtml(html);
            // Reset mermaid rendered flag when content changes
            mermaidRenderedRef.current = false;
        } else {
            console.log('Skipping markdown processing - component not mounted or no content');
            if (!content || !content.trim()) {
                setProcessedHtml('');
            }
        }
    }, [content, isMounted, customRenderer, processMarkdown]);


    // Render mermaid diagrams and process math after component updates
    useEffect(() => {
        console.log('Mermaid rendering useEffect triggered with:', {
            hasProcessedHtml: !!processedHtml,
            hasContainerRef: !!containerRef.current,
            isMounted,
            processedHtmlLength: processedHtml?.length || 0,
            mermaidAlreadyRendered: mermaidRenderedRef.current
        });

        if (processedHtml && containerRef.current && isMounted && !mermaidRenderedRef.current) {
            console.log('Starting mermaid and math processing...');
            
            // Check if there are any mermaid elements to render
            const mermaidElements = containerRef.current.querySelectorAll('.mermaid');
            if (mermaidElements.length === 0) {
                console.log('No mermaid elements found, skipping rendering');
                return;
            }
            
            console.log(`Found ${mermaidElements.length} mermaid elements to render`);
            // Log the content of mermaid elements for debugging
            mermaidElements.forEach((element, index) => {
                console.log(`Mermaid element ${index}:`, element.textContent?.substring(0, 100) + '...');
            });
            
            // Mark as rendered to prevent duplicate rendering
            mermaidRenderedRef.current = true;
            
            // Add a small delay to ensure the DOM is fully updated
            const timer = setTimeout(async () => {
                console.log('Timer fired, calling renderMermaidDiagrams...');
                try {
                    await renderMermaidDiagrams(containerRef, isMounted, addPanZoomToChart);
                    console.log('Mermaid diagrams rendered successfully');
                } catch (error) {
                    console.error('Error rendering mermaid diagrams:', error);
                    // Reset the flag on error so it can be retried
                    mermaidRenderedRef.current = false;
                }
            }, 100);
            
            return () => {
                console.log('Cleaning up mermaid rendering timer...');
                clearTimeout(timer);
            };
        } else {
            console.log('Skipping mermaid and math processing due to missing conditions or already rendered');
        }
    }, [processedHtml, isMounted, renderMermaidDiagrams, addPanZoomToChart]);

    return (
        <Card className={cn("overflow-auto", className)}>
            <div
                ref={(el) => {
                    containerRef.current = el;
                }}
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
        </Card>
    );
} 
