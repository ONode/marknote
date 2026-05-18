import React, { useEffect, useState } from 'react';
import { MarkdownViewer } from '../components/markdown-viewer';

// Extend Window interface for MathJax
declare global {
    interface Window {
        MathJax?: any;
        onMathJaxProcessingComplete?: (count: number) => void;
        testMathJaxProcessing?: () => void;
        analyzeMathElements?: () => void;
        testSpecificMath?: (type: string) => void;
        analyzePatterns?: () => void;
    }
}

// Test markdown content with various patterns and math expressions
const testContent = `
# Regex Pattern Debug Test

This document tests what text content the strong renderer receives with the exact examples from your situation.

## Your Original Examples

- **algorithm.md (Rotation)**: VRF bounds bias <0.1% for fair delegation/weights, O(1) per epoch ~10min.
- **02_dag_extension.md (Tips)**: VRF for optimal prev tips, O(log n) selection <5ms.
- **02.1 (Reshard)**: VRF for new shard in backlog, O(1) <1ms.
- **04 (Aggregation)**: VRF for subset, combined with VDF for manipulation <1%, O(n log n) <5ms n=1000.
- **Justification for Multi-Points**: Steps independent (different seeds/inputs), but validation uniform—centralize in crypto pkg for SOLID (single resp), avoiding duplication >0.1%. Bound: 3 points ok if shared, else >5% maint risk.

## Additional Test Cases

- **MY_CONTENT1**:
- **v1.2.3**:
- **#123**:
- **TODO**:
- **myFunction()**:

## Regular Text (Same Examples)

**algorithm.md (Rotation)**: VRF bounds bias <0.1% for fair delegation/weights, O(1) per epoch ~10min.
**02_dag_extension.md (Tips)**: VRF for optimal prev tips, O(log n) selection <5ms.
**02.1 (Reshard)**: VRF for new shard in backlog, O(1) <1ms.
**04 (Aggregation)**: VRF for subset, combined with VDF for manipulation <1%, O(n log n) <5ms n=1000.
**Justification for Multi-Points**: Steps independent (different seeds/inputs), but validation uniform—centralize in crypto pkg for SOLID (single resp), avoiding duplication >0.1%. Bound: 3 points ok if shared, else >5% maint risk.

## Math Test

This paragraph has both **bold text** and inline math: $f(x) = x^2$.

- List item with math: $\\sqrt{2} \\approx 1.414$
- Another item: $\\pi \\approx 3.14159$

Display math:

$$E = mc^2$$

# Math Rendering Debug Test

This page tests the math rendering using the actual MarkdownViewer component.

## Test 1: Inline Math with Dollar Signs

Here is some inline math: $E = mc^2$

And another: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

## Test 2: Display Math with Dollar Signs

Here is display math:

$$E = mc^2$$

TVL: \\( \frac{dTVL}{dt} = \delta (N - N^*) \\)

And another:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

## Test 3: Inline Math with Parentheses

Here is inline math with parentheses: \\(\\frac{dP}{dt} \\to -\\infty\\)

And another: \\(R(N) = I \\cdot S \\cdot \\frac{1}{N} + k \\cdot U > C\\)

And your specific expression: \\( \\frac{dTVL}{dt} = \\delta (N - N^*) \\)

## Test 4: Display Math with Brackets

Here is display math with brackets:

\\[\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\\]

And another:

\\[\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix} \\begin{pmatrix}
x \\\\
y
\\end{pmatrix} = \\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}\\]

## Test 5: Mixed Content

This paragraph has both **bold text** and inline math: $f(x) = x^2$.

- List item with math: $\\sqrt{2} \\approx 1.414$
- Another item: $\\pi \\approx 3.14159$
- Complex expression: $\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e$

## Test 6: Complex Mathematical Structures

### Matrix Example

$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix} \\begin{pmatrix}
x \\\\
y
\\end{pmatrix} = \\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}$$

### Fraction Example

$$\\frac{d}{dx}\\left[\\frac{x^2 + 1}{x - 1}\\right] = \\frac{(x-1)(2x) - (x^2 + 1)(1)}{(x-1)^2} = \\frac{x^2 - 2x - 1}{(x-1)^2}$$

### Integral Example

$$\\int_0^1 \\int_0^1 \\frac{1}{1 - xy} \\, dx \\, dy = \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Test 7: Physics Equations

### Maxwell's Equations

$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$

$$\\nabla \\cdot \\mathbf{B} = 0$$

$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$

$$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$$

### Schrödinger Equation

$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\hat{H} \\psi$$

## Test 8: Statistics

### Normal Distribution

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

### Bayes' Theorem

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

## Conclusion

This document tests the math rendering pipeline with the actual MarkdownViewer component. Check the browser console for detailed debugging information about the rendering process.`;

export default function DebugPage() {
    const [debugInfo, setDebugInfo] = useState<string>('Loading debug information...');
    const [mathElementsCount, setMathElementsCount] = useState<number>(0);
    const [renderingStatus, setRenderingStatus] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        // Update debug info after component mounts
        const timer = setTimeout(() => {
            updateDebugInfo();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const updateDebugInfo = () => {
        let info = '<h3 class="text-lg font-semibold mb-2">MathJax Status:</h3>';
        
        if (window.MathJax) {
            info += '<p class="text-green-600">✅ MathJax is loaded</p>';
            info += '<p class="text-sm text-gray-600">MathJax version: ' + (window.MathJax.version || 'unknown') + '</p>';
            info += '<p class="text-sm text-gray-600">MathJax API: ' + (window.MathJax.typesetPromise ? 'typesetPromise available' : 'typesetPromise not available') + '</p>';
            info += '<p class="text-sm text-gray-600">MathJax config: ' + (window.MathJax.config ? 'loaded' : 'not loaded') + '</p>';
        } else {
            info += '<p class="text-red-600">❌ MathJax is not loaded</p>';
        }
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">Math Elements Analysis:</h3>';
        const mathElements = document.querySelectorAll('.math-inline, .math-display');
        setMathElementsCount(mathElements.length);
        info += '<p class="text-blue-600">Total math elements found: ' + mathElements.length + '</p>';
        
        // Analyze each type of math expression
        const dollarInline = document.querySelectorAll('.math-inline').length;
        const dollarDisplay = document.querySelectorAll('.math-display').length;
        const renderedMath = document.querySelectorAll('.math-inline svg, .math-display svg, .math-inline .MathJax, .math-display .MathJax').length;
        
        info += '<div class="mt-2 space-y-1 text-sm">';
        info += '<p>• Inline math elements: ' + dollarInline + '</p>';
        info += '<p>• Display math elements: ' + dollarDisplay + '</p>';
        info += '<p>• Rendered math elements: ' + renderedMath + '</p>';
        info += '</div>';
        
        if (mathElements.length > 0) {
            info += '<h4 class="font-semibold mt-4 mb-2">Math Element Details:</h4>';
            info += '<div class="space-y-2 max-h-40 overflow-y-auto">';
            mathElements.forEach((element, index) => {
                const hasRendering = element.querySelector('svg, .MathJax, mjx-container');
                const content = element.innerHTML;
                const isRendered = !!hasRendering;
                
                info += '<div class="p-2 border border-gray-300 rounded text-xs">';
                info += '<div class="flex justify-between items-start">';
                info += '<span class="font-mono">#' + (index + 1) + '</span>';
                info += '<span class="' + (isRendered ? 'text-green-600' : 'text-red-600') + '">' + (isRendered ? '✅ Rendered' : '❌ Not Rendered') + '</span>';
                info += '</div>';
                info += '<div class="mt-1">';
                info += '<div class="text-gray-600">Content: ' + content.substring(0, 60) + (content.length > 60 ? '...' : '') + '</div>';
                if (!isRendered) {
                    info += '<div class="text-red-500 text-xs mt-1">Issue: Math not processed by MathJax</div>';
                }
                info += '</div>';
                info += '</div>';
            });
            info += '</div>';
        }
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">Pattern Test Results:</h3>';
        info += '<div class="space-y-1 text-sm">';
        
        // Check for special pattern styling
        const filenameDesc = document.querySelectorAll('.filename-description').length;
        const underscoreContent = document.querySelectorAll('.underscore-content').length;
        const versionNumber = document.querySelectorAll('.version-number').length;
        const issueReference = document.querySelectorAll('.issue-reference').length;
        const statusIndicator = document.querySelectorAll('.status-indicator').length;
        const codeReference = document.querySelectorAll('.code-reference').length;
        const numberedSection = document.querySelectorAll('.numbered-section').length;
        const spaceSeparated = document.querySelectorAll('.space-separated').length;
        
        info += '<p>• Filename-description patterns: ' + filenameDesc + ' found</p>';
        info += '<p>• Underscore content patterns: ' + underscoreContent + ' found</p>';
        info += '<p>• Numbered section patterns: ' + numberedSection + ' found</p>';
        info += '<p>• Space-separated patterns: ' + spaceSeparated + ' found</p>';
        info += '<p>• Version number patterns: ' + versionNumber + ' found</p>';
        info += '<p>• Issue reference patterns: ' + issueReference + ' found</p>';
        info += '<p>• Status indicator patterns: ' + statusIndicator + ' found</p>';
        info += '<p>• Code reference patterns: ' + codeReference + ' found</p>';
        info += '</div>';
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">Math Test Results by Section:</h3>';
        info += '<div class="space-y-1 text-sm">';
        info += '<p>• Test 1 (Dollar inline): ' + (document.querySelector('.math-inline')?.innerHTML.includes('$E = mc^2$') ? '✅' : '❌') + '</p>';
        info += '<p>• Test 2 (Dollar display): ' + (document.querySelector('.math-display')?.innerHTML.includes('$$E = mc^2$$') ? '✅' : '❌') + '</p>';
        info += '<p>• Test 3 (Parentheses inline): ' + (document.querySelector('.math-inline')?.innerHTML.includes('\\(\\frac{dP}{dt}') ? '✅' : '❌') + '</p>';
        info += '<p>• Test 4 (Brackets display): ' + (document.querySelector('.math-display')?.innerHTML.includes('\\[\\int') ? '✅' : '❌') + '</p>';
        info += '</div>';
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">Pattern Analysis Tests:</h3>';
        info += '<div class="space-y-2">';
        info += '<button onclick="analyzePatterns()" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">Analyze Patterns</button>';
        info += '</div>';
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">MathJax Processing Tests:</h3>';
        info += '<div class="space-y-2">';
        info += '<button onclick="testMathJaxProcessing()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">Test MathJax Processing</button>';
        info += '<button onclick="analyzeMathElements()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm mr-2">Analyze Math Elements</button>';
        info += '</div>';
        
        info += '<h4 class="font-semibold mt-4 mb-2">Test Specific Math Types:</h4>';
        info += '<div class="space-y-1">';
        info += '<button onclick="testSpecificMath(\'dollar-inline\')" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-1">Dollar Inline</button>';
        info += '<button onclick="testSpecificMath(\'dollar-display\')" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-1">Dollar Display</button>';
        info += '<button onclick="testSpecificMath(\'parentheses\')" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-1">Parentheses</button>';
        info += '<button onclick="testSpecificMath(\'brackets\')" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-xs mr-1">Brackets</button>';
        info += '</div>';
        
        info += '<h3 class="text-lg font-semibold mb-2 mt-4">MathJax 4.0 Features:</h3>';
        info += '<div class="space-y-1 text-sm">';
        info += '<p>• Improved performance and smaller bundle size</p>';
        info += '<p>• Better TypeScript support</p>';
        info += '<p>• Enhanced SVG rendering</p>';
        info += '<p>• Improved accessibility features</p>';
        info += '<p>• Better error handling</p>';
        info += '</div>';
        
        setDebugInfo(info);
    };

    // Add global functions for testing
    useEffect(() => {
        // Set up callback for MathJax processing completion
        (window as any).onMathJaxProcessingComplete = (processedCount: number) => {
            console.log(`MathJax processing completed for ${processedCount} elements`);
            // Update debug info after processing
            setTimeout(updateDebugInfo, 100);
        };

        (window as any).testMathJaxProcessing = () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                const mathElements = document.querySelectorAll('.math-inline, .math-display');
                console.log('Testing MathJax processing on', mathElements.length, 'elements');
                
                // Log detailed info about each element before processing
                mathElements.forEach((element, index) => {
                    console.log(`Element ${index + 1} before processing:`, {
                        tagName: element.tagName,
                        className: element.className,
                        innerHTML: element.innerHTML,
                        textContent: element.textContent,
                        hasMathJax: !!element.querySelector('.MathJax, mjx-container, svg')
                    });
                });
                
                window.MathJax.typesetPromise([...mathElements]).then(() => {
                    console.log('MathJax processing completed');
                    
                    // Log detailed info about each element after processing
                    mathElements.forEach((element, index) => {
                        const hasMathJax = !!element.querySelector('.MathJax, mjx-container, svg');
                        console.log(`Element ${index + 1} after processing:`, {
                            hasMathJax,
                            innerHTML: element.innerHTML.substring(0, 200) + '...',
                            mathJaxElements: element.querySelectorAll('.MathJax, mjx-container, svg').length
                        });
                    });
                    
                    alert('MathJax processing completed! Check the console for details.');
                    updateDebugInfo(); // Refresh debug info
                }).catch((error: any) => {
                    console.error('MathJax processing failed:', error);
                    alert('MathJax processing failed: ' + error.message);
                });
            } else {
                alert('MathJax is not available');
            }
        };

        (window as any).analyzeMathElements = () => {
            const mathElements = document.querySelectorAll('.math-inline, .math-display');
            console.log('=== MATH ELEMENTS ANALYSIS ===');
            console.log('Total elements found:', mathElements.length);
            
            mathElements.forEach((element, index) => {
                const content = element.innerHTML;
                const hasMathJax = !!element.querySelector('.MathJax, mjx-container, svg');
                const isInline = element.classList.contains('math-inline');
                const isDisplay = element.classList.contains('math-display');
                
                console.log(`\nElement ${index + 1}:`);
                console.log('  Type:', isInline ? 'inline' : isDisplay ? 'display' : 'unknown');
                console.log('  Content:', content);
                console.log('  Has MathJax rendering:', hasMathJax);
                console.log('  Content length:', content.length);
                console.log('  Contains $:', content.includes('$'));
                console.log('  Contains \\(:', content.includes('\\('));
                console.log('  Contains \\[:', content.includes('\\['));
                console.log('  Contains HTML entities:', content.includes('&gt;') || content.includes('&lt;'));
                
                if (!hasMathJax) {
                    console.log('  ❌ ISSUE: This element was not processed by MathJax');
                    if (content.includes('&gt;') || content.includes('&lt;')) {
                        console.log('  🔍 Possible cause: HTML entities not decoded');
                    }
                    if (content.includes('$') && !content.includes('\\(') && !content.includes('\\[')) {
                        console.log('  🔍 Possible cause: Dollar signs not processed');
                    }
                }
            });
            
            console.log('=== END ANALYSIS ===');
        };

        (window as any).testSpecificMath = (mathType: string) => {
            let selector = '';
            switch(mathType) {
                case 'dollar-inline':
                    selector = '.math-inline';
                    break;
                case 'dollar-display':
                    selector = '.math-display';
                    break;
                case 'parentheses':
                    selector = '.math-inline';
                    break;
                case 'brackets':
                    selector = '.math-display';
                    break;
            }
            
            const elements = document.querySelectorAll(selector);
            console.log(`Testing ${mathType} elements:`, elements.length);
            
            elements.forEach((element, index) => {
                const content = element.innerHTML;
                console.log(`${mathType} element ${index + 1}:`, content);
            });
        };

        (window as any).analyzePatterns = () => {
            console.log('=== PATTERN ANALYSIS ===');
            
            // Check all strong elements
            const allStrong = document.querySelectorAll('strong');
            console.log('Total strong elements found:', allStrong.length);
            
            allStrong.forEach((element, index) => {
                const content = element.textContent || element.innerText;
                const className = element.className;
                const hasSpecialClass = className.includes('filename-description') || 
                                      className.includes('underscore-content') || 
                                      className.includes('numbered-section') || 
                                      className.includes('space-separated') || 
                                      className.includes('version-number') || 
                                      className.includes('issue-reference') || 
                                      className.includes('status-indicator') || 
                                      className.includes('code-reference');
                
                console.log(`\nStrong element ${index + 1}:`);
                console.log('  Content:', content);
                console.log('  Class:', className);
                console.log('  Has special styling:', hasSpecialClass);
                
                if (!hasSpecialClass) {
                    console.log('  ❌ ISSUE: This element should have special styling but doesn\'t');
                    console.log('  🔍 Possible causes:');
                    console.log('    - Pattern regex not matching');
                    console.log('    - Text content not what expected');
                    console.log('    - CSS classes not applied');
                }
            });
            
            console.log('=== END PATTERN ANALYSIS ===');
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Math Rendering Debug Test
                </h1>
                <p className="text-gray-600 mb-6">
                    This page tests math rendering using the actual MarkdownViewer component. 
                    Check the browser console for detailed debugging information.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* MarkdownViewer Component */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            MarkdownViewer Component Output
                        </h2>
                        <div className="bg-white shadow-sm border">
                            <MarkdownViewer 
                                content={testContent} 
                                className="p-6 max-h-96 overflow-auto"
                            />
                        </div>
                    </div>
                    
                    {/* Debug Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Debug Information
                        </h2>
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div 
                                className="text-sm"
                                dangerouslySetInnerHTML={{ __html: debugInfo }}
                            />
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <h3 className="text-lg font-semibold mb-2">Console Logs</h3>
                            <p className="text-sm text-gray-600">
                                Open the browser console (F12) to see detailed logging of the rendering process:
                            </p>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                <li>• Math element creation and processing</li>
                                <li>• Markdown-it rendering steps</li>
                                <li>• HTML entity decoding</li>
                                <li>• MathJax processing results</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">MathJax Status:</span>
                                    <span id="mathjax-status" className="text-sm px-2 py-1 rounded bg-gray-100">Checking...</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Math Elements:</span>
                                    <span id="math-elements-count" className="text-sm px-2 py-1 rounded bg-gray-100">0</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">Rendered Elements:</span>
                                    <span id="rendered-elements-count" className="text-sm px-2 py-1 rounded bg-gray-100">0</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        const status = window.MathJax ? '✅ Loaded' : '❌ Not Loaded';
                                        const mathElements = document.querySelectorAll('.math-inline, .math-display').length;
                                        const rendered = document.querySelectorAll('.math-inline svg, .math-display svg, .math-inline .MathJax, .math-display .MathJax').length;
                                        
                                        document.getElementById('mathjax-status')!.textContent = status;
                                        document.getElementById('math-elements-count')!.textContent = mathElements.toString();
                                        document.getElementById('rendered-elements-count')!.textContent = rendered.toString();
                                    }}
                                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm"
                                >
                                    Refresh Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Expected Results
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Math expressions should render as SVG elements</li>
                        <li>• Inline math should appear inline with text</li>
                        <li>• Display math should appear centered and larger</li>
                        <li>• All math delimiters should be properly processed</li>
                        <li>• Console should show successful MathJax processing</li>
                    </ul>
                </div>
                
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Debugging Commands
                    </h3>
                    <p className="text-sm text-yellow-700 mb-2">
                        Use these commands in the browser console for detailed debugging:
                    </p>
                    <div className="bg-yellow-100 p-3 rounded text-sm font-mono space-y-1">
                        <div><strong>analyzePatterns()</strong> - Analyze all bold text patterns and styling</div>
                        <div><strong>analyzeMathElements()</strong> - Detailed analysis of all math elements</div>
                        <div><strong>testMathJaxProcessing()</strong> - Test MathJax processing on all elements</div>
                        <div><strong>testSpecificMath('dollar-inline')</strong> - Test dollar sign inline math</div>
                        <div><strong>testSpecificMath('parentheses')</strong> - Test parentheses inline math</div>
                        <div><strong>testSpecificMath('brackets')</strong> - Test brackets display math</div>
                    </div>
                </div>
            </div>
        </div>
    );
}