#!/usr/bin/env bun

// Script to analyze Mermaid SVG stroke colors
import { JSDOM } from 'jsdom';

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
            A[Start] --> B{Is it working?}
            B -->|Yes| C[Great!]
            B -->|No| D[Debug]
            D --> B
            C --> E[Continue]
    </div>
</body>
</html>
`, {
    runScripts: "dangerously",
    resources: "usable"
});

const window = dom.window;
const document = window.document;

// Wait for Mermaid to load and render
setTimeout(async () => {
    try {
        console.log('=== MERMAID SVG STROKE COLOR ANALYSIS ===\n');
        
        // Initialize Mermaid
        window.mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose"
        });
        
        // Render the diagram
        const mermaidElement = document.querySelector('.mermaid');
        const { svg } = await window.mermaid.render('test-diagram', mermaidElement.textContent);
        
        console.log('Rendered SVG:');
        console.log(svg);
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Parse the SVG
        const parser = new window.DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        
        // Analyze stroke colors
        console.log('STROKE COLOR ANALYSIS:');
        console.log('-'.repeat(30));
        
        const strokeElements = svgDoc.querySelectorAll('[stroke]');
        console.log(`Found ${strokeElements.length} elements with stroke attributes:\n`);
        
        strokeElements.forEach((element, index) => {
            const stroke = element.getAttribute('stroke');
            const strokeWidth = element.getAttribute('stroke-width');
            const tagName = element.tagName;
            const className = element.getAttribute('class') || 'no-class';
            const id = element.getAttribute('id') || 'no-id';
            
            console.log(`${index + 1}. Element: ${tagName}`);
            console.log(`   Class: ${className}`);
            console.log(`   ID: ${id}`);
            console.log(`   Stroke: ${stroke}`);
            console.log(`   Stroke Width: ${strokeWidth || 'default'}`);
            console.log('');
        });
        
        // Analyze fill colors
        console.log('\nFILL COLOR ANALYSIS:');
        console.log('-'.repeat(30));
        
        const fillElements = svgDoc.querySelectorAll('[fill]');
        console.log(`Found ${fillElements.length} elements with fill attributes:\n`);
        
        fillElements.forEach((element, index) => {
            const fill = element.getAttribute('fill');
            const tagName = element.tagName;
            const className = element.getAttribute('class') || 'no-class';
            const id = element.getAttribute('id') || 'no-id';
            
            console.log(`${index + 1}. Element: ${tagName}`);
            console.log(`   Class: ${className}`);
            console.log(`   ID: ${id}`);
            console.log(`   Fill: ${fill}`);
            console.log('');
        });
        
        // Look for style definitions
        console.log('\nSTYLE DEFINITIONS:');
        console.log('-'.repeat(30));
        
        const styleElements = svgDoc.querySelectorAll('style');
        styleElements.forEach((style, index) => {
            console.log(`Style ${index + 1}:`);
            console.log(style.textContent);
            console.log('');
        });
        
        // Summary of unique colors
        console.log('\nCOLOR SUMMARY:');
        console.log('-'.repeat(30));
        
        const strokeColors = new Set();
        const fillColors = new Set();
        
        strokeElements.forEach(el => {
            const stroke = el.getAttribute('stroke');
            if (stroke && stroke !== 'none') {
                strokeColors.add(stroke);
            }
        });
        
        fillElements.forEach(el => {
            const fill = el.getAttribute('fill');
            if (fill && fill !== 'none') {
                fillColors.add(fill);
            }
        });
        
        console.log('Unique stroke colors:');
        strokeColors.forEach(color => console.log(`  - ${color}`));
        
        console.log('\nUnique fill colors:');
        fillColors.forEach(color => console.log(`  - ${color}`));
        
    } catch (error) {
        console.error('Error analyzing Mermaid SVG:', error);
    }
}, 2000);
