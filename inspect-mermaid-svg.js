#!/usr/bin/env bun

// Script to inspect Mermaid SVG structure and stroke colors
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    logLevel: 'error'
});

// Sample Mermaid diagram
const mermaidCode = `
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Continue]
`;

console.log('Analyzing Mermaid SVG structure...\n');

// Create a temporary container
const container = document.createElement('div');
container.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;

// Get the mermaid element
const mermaidElement = container.querySelector('.mermaid');

// Render the diagram
try {
    const { svg } = await mermaid.render('test-diagram', mermaidCode);
    
    console.log('=== MERMAID SVG ANALYSIS ===\n');
    console.log('Full SVG:');
    console.log(svg);
    console.log('\n=== STROKE COLOR ANALYSIS ===\n');
    
    // Parse the SVG to find stroke colors
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
    
    // Find all elements with stroke attributes
    const elementsWithStroke = svgDoc.querySelectorAll('[stroke]');
    console.log(`Found ${elementsWithStroke.length} elements with stroke attributes:`);
    
    elementsWithStroke.forEach((element, index) => {
        const stroke = element.getAttribute('stroke');
        const strokeWidth = element.getAttribute('stroke-width');
        const tagName = element.tagName;
        const className = element.getAttribute('class') || 'no-class';
        
        console.log(`${index + 1}. ${tagName} (class: ${className})`);
        console.log(`   stroke: ${stroke}`);
        console.log(`   stroke-width: ${strokeWidth || 'default'}`);
        console.log('');
    });
    
    // Find all elements with fill attributes
    const elementsWithFill = svgDoc.querySelectorAll('[fill]');
    console.log(`\nFound ${elementsWithFill.length} elements with fill attributes:`);
    
    elementsWithFill.forEach((element, index) => {
        const fill = element.getAttribute('fill');
        const tagName = element.tagName;
        const className = element.getAttribute('class') || 'no-class';
        
        console.log(`${index + 1}. ${tagName} (class: ${className})`);
        console.log(`   fill: ${fill}`);
        console.log('');
    });
    
    // Look for CSS classes that might define colors
    const styleElements = svgDoc.querySelectorAll('style');
    console.log(`\nFound ${styleElements.length} style elements:`);
    
    styleElements.forEach((style, index) => {
        console.log(`Style ${index + 1}:`);
        console.log(style.textContent);
        console.log('');
    });
    
} catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
}
