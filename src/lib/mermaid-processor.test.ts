/**
 * Test file for Mermaid Processor
 * 
 * This file demonstrates the functionality of the Mermaid processor
 * and can be used for testing various Mermaid syntax issues.
 */

import { MermaidProcessor, processMermaidCode } from './mermaid-processor';

// Test cases demonstrating common Mermaid issues
const testCases = [
  {
    name: 'Missing quotes in subgraph labels',
    input: `graph TB
    subgraph Input Layer
        A[Multi-Exchange Price Feeds<br/>(Binance, OKX, Deribit, etc.)]
        B[Market Daemons<br/>(Orderbook, Last Trade Data)]
        C[Oracles<br/>(Pyth, Chainlink)]
    end`,
    expectedFixes: ['fixed subgraph labels', 'fixed node labels']
  },
  {
    name: 'Missing quotes in node labels with spaces',
    input: `graph TB
    A[Multi-Exchange Price Feeds]
    B[Market Daemons]
    C[Oracles]`,
    expectedFixes: ['fixed node labels']
  },
  {
    name: 'Mixed bracket types without quotes',
    input: `graph TB
    A(Multi-Exchange Price Feeds)
    B{Market Daemons}
    C[Oracles]`,
    expectedFixes: ['fixed node labels']
  },
  {
    name: 'Line breaks in labels',
    input: `graph TB
    A[Multi-Exchange
    Price Feeds]
    B[Market
    Daemons]`,
    expectedFixes: ['fixed line breaks in labels', 'fixed node labels']
  },
  {
    name: 'Special characters in labels',
    input: `graph TB
    A[Price Feeds & Data]
    B[Market > Orderbook]
    C[Oracles (Pyth, Chainlink)]`,
    expectedFixes: ['fixed node labels']
  }
];

// Function to run tests
export function runMermaidProcessorTests(): void {
  console.log('🧪 Running Mermaid Processor Tests\n');
  
  const processor = new MermaidProcessor({ enableLogging: true });
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log('Input:');
    console.log(testCase.input);
    console.log('\nProcessing...\n');
    
    const result = processor.process(testCase.input);
    
    console.log('Output:');
    console.log(result.processedCode);
    console.log('\nFixes Applied:', result.fixesApplied);
    console.log('Has Errors:', result.hasErrors);
    if (result.errors.length > 0) {
      console.log('Errors:', result.errors);
    }
    console.log('─'.repeat(50));
    console.log();
  });
}

// Example usage function
export function demonstrateMermaidProcessor(): void {
  console.log('🎯 Mermaid Processor Demonstration\n');
  
  // Example 1: The specific case mentioned in the user query
  const problematicCode = `graph TB
    subgraph "Input Layer"
        A[Multi-Exchange Price Feeds<br/>(Binance, OKX, Deribit, etc.)]
        B[Market Daemons<br/>(Orderbook, Last Trade Data)]
        C[Oracles<br/>(Pyth, Chainlink)]
    end
    
    subgraph "Process Layer"
        D[TWAP Calculator]
        E[Enhanced Funding Rate Calculator<br/>(Linear Perps)]
        F[Options Perp Funding Calculator<br/>(NEW: Perp Options)]
        G[Anomaly Detection System]
        H[Hybrid Accrual Engine<br/>(Intra-Interval PnL)]
    end`;

  console.log('Original Code:');
  console.log(problematicCode);
  console.log('\n' + '─'.repeat(50) + '\n');

  const result = processMermaidCode(problematicCode, {
    enableLogging: true,
    fixQuotes: true,
    fixSubgraphLabels: true,
    fixNodeLabels: true,
    fixLineBreaks: true,
    normalizeWhitespace: true
  });

  console.log('Processed Code:');
  console.log(result.processedCode);
  console.log('\nFixes Applied:', result.fixesApplied);
  console.log('Has Errors:', result.hasErrors);
  
  if (result.errors.length > 0) {
    console.log('Errors:', result.errors);
  }
}

// Export test functions for use in other files
export { testCases };

// If running this file directly, execute the tests
if (typeof window === 'undefined' && require.main === module) {
  runMermaidProcessorTests();
  demonstrateMermaidProcessor();
}
