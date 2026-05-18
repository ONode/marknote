#!/usr/bin/env bun

// Script to analyze CSS paths for Mermaid SVG stroke and arrow colors
import { JSDOM } from 'jsdom';
import fs from 'fs';

// Create a virtual DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="mermaid">
        graph TD
            A[Start] --> B{Decision}
            B -->|Yes| C[Success]
            B -->|No| D[Error]
            C --> E[End]
            D --> F[Retry]
            F --> B
    </div>
    
    <div class="mermaid">
        sequenceDiagram
            participant A as Alice
            participant B as Bob
            A->>B: Message 1
            B-->>A: Response 1
            A-)B: Message 2
    </div>
</body>
</html>
`, {
    runScripts: "dangerously",
    resources: "usable"
});

const window = dom.window;
const document = window.document;

// Function to generate CSS selectors for an element
function generateCSSSelectors(element, svg, theme = 'default') {
    const selectors = [];
    const tagName = element.tagName.toLowerCase();
    const className = element.getAttribute('class');
    const id = element.getAttribute('id');
    
    // Basic selectors
    selectors.push(`.mermaid svg ${tagName}`);
    
    if (className) {
        const classes = className.split(' ').filter(c => c.trim());
        classes.forEach(cls => {
            selectors.push(`.mermaid svg ${tagName}.${cls}`);
            selectors.push(`.mermaid svg .${cls}`);
        });
    }
    
    if (id) {
        selectors.push(`.mermaid svg #${id}`);
    }
    
    // Attribute selectors
    const stroke = element.getAttribute('stroke');
    if (stroke) {
        selectors.push(`.mermaid svg ${tagName}[stroke="${stroke}"]`);
    }
    
    const fill = element.getAttribute('fill');
    if (fill) {
        selectors.push(`.mermaid svg ${tagName}[fill="${fill}"]`);
    }
    
    // Specific Mermaid element selectors
    if (className) {
        if (className.includes('node')) {
            selectors.push(`.mermaid svg .node ${tagName}`);
            const nodeClass = className.split(' ').find(c => c.startsWith('node-'));
            if (nodeClass) {
                selectors.push(`.mermaid svg .${nodeClass} ${tagName}`);
            }
        }
        
        if (className.includes('edge')) {
            selectors.push(`.mermaid svg .edge ${tagName}`);
            const edgeClass = className.split(' ').find(c => c.startsWith('edge-'));
            if (edgeClass) {
                selectors.push(`.mermaid svg .${edgeClass} ${tagName}`);
            }
        }
        
        if (className.includes('arrow') || className.includes('marker')) {
            selectors.push(`.mermaid svg .arrow ${tagName}`);
            selectors.push(`.mermaid svg marker ${tagName}`);
        }
    }
    
    // Theme-specific selectors
    selectors.push(`.mermaid[data-theme="${theme}"] svg ${tagName}`);
    selectors.push(`.mermaid.theme-${theme} svg ${tagName}`);
    
    // Parent-child relationships
    const parent = element.parentElement;
    if (parent && parent !== svg) {
        const parentTag = parent.tagName.toLowerCase();
        const parentClass = parent.getAttribute('class');
        if (parentClass) {
            selectors.push(`.mermaid svg .${parentClass} ${tagName}`);
        }
        selectors.push(`.mermaid svg ${parentTag} ${tagName}`);
    }
    
    return [...new Set(selectors)]; // Remove duplicates
}

// Function to analyze SVG elements
function analyzeSVGElements(svg, svgIndex, theme) {
    const analysis = {
        svgIndex,
        theme,
        elements: [],
        summary: {
            totalElements: 0,
            strokeElements: 0,
            fillElements: 0,
            uniqueStrokeColors: new Set(),
            uniqueFillColors: new Set(),
            uniqueSelectors: new Set()
        }
    };
    
    // Analyze all elements
    const allElements = svg.querySelectorAll('*');
    analysis.summary.totalElements = allElements.length;
    
    // Analyze stroke elements
    const strokeElements = svg.querySelectorAll('[stroke]');
    analysis.summary.strokeElements = strokeElements.length;
    
    strokeElements.forEach((element, index) => {
        const stroke = element.getAttribute('stroke');
        const strokeWidth = element.getAttribute('stroke-width');
        const tagName = element.tagName;
        const className = element.getAttribute('class') || 'no-class';
        const id = element.getAttribute('id') || 'no-id';
        
        if (stroke && stroke !== 'none') {
            analysis.summary.uniqueStrokeColors.add(stroke);
        }
        
        const cssSelectors = generateCSSSelectors(element, svg, theme);
        cssSelectors.forEach(selector => analysis.summary.uniqueSelectors.add(selector));
        
        analysis.elements.push({
            type: 'stroke',
            tag: tagName,
            class: className,
            id: id,
            stroke: stroke,
            strokeWidth: strokeWidth,
            cssSelectors: cssSelectors
        });
    });
    
    // Analyze fill elements
    const fillElements = svg.querySelectorAll('[fill]');
    analysis.summary.fillElements = fillElements.length;
    
    fillElements.forEach((element, index) => {
        const fill = element.getAttribute('fill');
        const tagName = element.tagName;
        const className = element.getAttribute('class') || 'no-class';
        const id = element.getAttribute('id') || 'no-id';
        
        if (fill && fill !== 'none') {
            analysis.summary.uniqueFillColors.add(fill);
        }
        
        const cssSelectors = generateCSSSelectors(element, svg, theme);
        cssSelectors.forEach(selector => analysis.summary.uniqueSelectors.add(selector));
        
        analysis.elements.push({
            type: 'fill',
            tag: tagName,
            class: className,
            id: id,
            fill: fill,
            cssSelectors: cssSelectors
        });
    });
    
    // Convert Sets to Arrays for JSON serialization
    analysis.summary.uniqueStrokeColors = Array.from(analysis.summary.uniqueStrokeColors);
    analysis.summary.uniqueFillColors = Array.from(analysis.summary.uniqueFillColors);
    analysis.summary.uniqueSelectors = Array.from(analysis.summary.uniqueSelectors);
    
    return analysis;
}

// Function to generate CSS overrides
function generateCSSOverrides(analysisData) {
    let css = `/* Mermaid CSS Overrides - Generated on ${new Date().toISOString()} */
/* Theme: ${analysisData.theme} */

/* Global Mermaid SVG Styling */
.mermaid svg {
    /* CSS Variables for easy customization */
    --primary-stroke: #667eea;
    --secondary-stroke: #5a6fd8;
    --arrow-stroke: #4c63d2;
    --text-color: #374151;
    --background-color: #ffffff;
}

/* Node Styling */
.mermaid svg .node rect,
.mermaid svg .node circle,
.mermaid svg .node polygon {
    stroke: var(--primary-stroke) !important;
    stroke-width: 2px !important;
}

/* Edge/Arrow Styling */
.mermaid svg .edge path,
.mermaid svg .edge line {
    stroke: var(--arrow-stroke) !important;
    stroke-width: 2px !important;
}

/* Arrow Markers */
.mermaid svg marker path {
    fill: var(--arrow-stroke) !important;
    stroke: var(--arrow-stroke) !important;
}

/* Text Styling */
.mermaid svg .node text {
    fill: var(--text-color) !important;
}

/* Specific Element Overrides Based on Analysis */
`;

    // Add specific overrides for each SVG
    analysisData.svgs.forEach((svg, svgIndex) => {
        css += `
/* SVG ${svgIndex + 1} Specific Overrides */
`;
        
        svg.elements.forEach((element, elementIndex) => {
            if (element.cssSelectors && element.cssSelectors.length > 0) {
                const selector = element.cssSelectors[0]; // Use the most specific selector
                css += `${selector} {
    stroke: var(--primary-stroke) !important;
    stroke-width: 2px !important;
}`;
            }
        });
    });
    
    css += `

/* Dark Theme Overrides */
.dark .mermaid svg {
    --primary-stroke: #a78bfa;
    --secondary-stroke: #8b5cf6;
    --arrow-stroke: #7c3aed;
    --text-color: #f3f4f6;
    --background-color: #1f2937;
}

/* Responsive Design */
@media (max-width: 768px) {
    .mermaid svg {
        --primary-stroke: #4f46e5;
        --arrow-stroke: #3730a3;
    }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
    .mermaid svg {
        --primary-stroke: #000000;
        --arrow-stroke: #000000;
        --text-color: #000000;
    }
}`;

    return css;
}

// Main analysis function
async function analyzeMermaidCSS() {
    console.log('🔍 Starting Mermaid CSS Path Analysis...\n');
    
    try {
        // Initialize Mermaid
        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: "loose"
        });
        
        // Get mermaid elements
        const mermaidElements = document.querySelectorAll('.mermaid');
        console.log(`Found ${mermaidElements.length} Mermaid diagrams to analyze\n`);
        
        // Render all diagrams
        await window.mermaid.run({
            nodes: Array.from(mermaidElements)
        });
        
        // Wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const analysisData = {
            theme: 'default',
            timestamp: new Date().toISOString(),
            svgs: []
        };
        
        // Analyze each SVG
        const svgs = document.querySelectorAll('.mermaid svg');
        console.log(`Analyzing ${svgs.length} rendered SVGs...\n`);
        
        svgs.forEach((svg, index) => {
            console.log(`📊 Analyzing SVG ${index + 1}...`);
            const analysis = analyzeSVGElements(svg, index, 'default');
            analysisData.svgs.push(analysis);
            
            console.log(`   - Total elements: ${analysis.summary.totalElements}`);
            console.log(`   - Stroke elements: ${analysis.summary.strokeElements}`);
            console.log(`   - Fill elements: ${analysis.summary.fillElements}`);
            console.log(`   - Unique stroke colors: ${analysis.summary.uniqueStrokeColors.length}`);
            console.log(`   - Unique fill colors: ${analysis.summary.uniqueFillColors.length}`);
            console.log(`   - Unique CSS selectors: ${analysis.summary.uniqueSelectors.length}\n`);
        });
        
        // Generate CSS overrides
        const cssOverrides = generateCSSOverrides(analysisData);
        
        // Save results
        const resultsDir = './mermaid-analysis-results';
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir);
        }
        
        // Save JSON analysis
        const jsonPath = `${resultsDir}/mermaid-css-analysis-${Date.now()}.json`;
        fs.writeFileSync(jsonPath, JSON.stringify(analysisData, null, 2));
        console.log(`💾 Analysis data saved to: ${jsonPath}`);
        
        // Save CSS overrides
        const cssPath = `${resultsDir}/mermaid-custom-styles-${Date.now()}.css`;
        fs.writeFileSync(cssPath, cssOverrides);
        console.log(`💾 CSS overrides saved to: ${cssPath}`);
        
        // Print summary
        console.log('\n📊 ANALYSIS SUMMARY');
        console.log('='.repeat(50));
        console.log(`Theme: ${analysisData.theme}`);
        console.log(`Total SVGs analyzed: ${analysisData.svgs.length}`);
        
        const totalElements = analysisData.svgs.reduce((sum, svg) => sum + svg.summary.totalElements, 0);
        const totalStrokeElements = analysisData.svgs.reduce((sum, svg) => sum + svg.summary.strokeElements, 0);
        const totalFillElements = analysisData.svgs.reduce((sum, svg) => sum + svg.summary.fillElements, 0);
        
        console.log(`Total elements: ${totalElements}`);
        console.log(`Total stroke elements: ${totalStrokeElements}`);
        console.log(`Total fill elements: ${totalFillElements}`);
        
        // Collect all unique colors
        const allStrokeColors = new Set();
        const allFillColors = new Set();
        const allSelectors = new Set();
        
        analysisData.svgs.forEach(svg => {
            svg.summary.uniqueStrokeColors.forEach(color => allStrokeColors.add(color));
            svg.summary.uniqueFillColors.forEach(color => allFillColors.add(color));
            svg.summary.uniqueSelectors.forEach(selector => allSelectors.add(selector));
        });
        
        console.log(`Unique stroke colors: ${allStrokeColors.size}`);
        allStrokeColors.forEach(color => console.log(`  - ${color}`));
        
        console.log(`\nUnique fill colors: ${allFillColors.size}`);
        allFillColors.forEach(color => console.log(`  - ${color}`));
        
        console.log(`\nTotal unique CSS selectors: ${allSelectors.size}`);
        console.log('\nTop 10 CSS selectors:');
        Array.from(allSelectors).slice(0, 10).forEach(selector => {
            console.log(`  - ${selector}`);
        });
        
        console.log('\n✅ Analysis complete!');
        
    } catch (error) {
        console.error('❌ Error during analysis:', error);
    }
}

// Run the analysis
analyzeMermaidCSS();
