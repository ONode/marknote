# Bun Setup Guide for Markdown Mermaid Viewer

This guide explains how to set up and run this Next.js TypeScript application using Bun.

## Prerequisites

1. **Install Bun**: Make sure you have Bun installed on your system
   ```bash
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash
   
   # Windows (WSL)
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Verify Installation**:
   ```bash
   bun --version
   ```

## Quick Start

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Development Mode**:
   ```bash
   bun run dev
   ```

3. **Build for Production**:
   ```bash
   bun run build
   ```

4. **Start Production Server**:
   ```bash
   bun run start
   ```

## Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript type checking
- `bun run clean` - Clean build artifacts
- `bun run install-deps` - Install dependencies using Bun

## Configuration Files

### `bunfig.toml`
- Bun-specific configuration for package management and testing
- Enables exact version pinning for reproducible builds

### `.bunrc`
- Additional Bun runtime configuration
- Ensures Bun-specific optimizations are enabled

### `next.config.ts`
- Next.js configuration optimized for Bun
- Enables Turbo mode and SWC minification
- Configures image optimization

### `tsconfig.json`
- TypeScript configuration optimized for modern features
- Target ES2022 for better performance
- Strict type checking enabled

## Benefits of Using Bun

1. **Faster Package Installation**: Bun installs packages significantly faster than npm/yarn
2. **Improved Build Performance**: Better TypeScript compilation and bundling
3. **Memory Efficiency**: Lower memory usage during development
4. **Native TypeScript Support**: Built-in TypeScript support without additional tooling
5. **Compatibility**: Full compatibility with existing Node.js/npm ecosystem

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure Bun has proper permissions
   ```bash
   chmod +x ~/.bun/bin/bun
   ```

2. **TypeScript Errors**: Run type checking
   ```bash
   bun run type-check
   ```

3. **Build Failures**: Clean and rebuild
   ```bash
   bun run clean
   bun run build
   ```

### Performance Tips

1. **Use Turbopack**: Already enabled in dev script for faster builds
2. **Enable SWC**: Already configured for faster compilation
3. **Optimize Images**: WebP and AVIF formats are configured
4. **Strict Mode**: Enabled for better development experience

## Development Workflow

1. **Start Development**: `bun run dev`
2. **Make Changes**: Edit TypeScript/TSX files
3. **Type Check**: `bun run type-check` (optional, runs automatically in dev)
4. **Lint Code**: `bun run lint`
5. **Build**: `bun run build`
6. **Test Production**: `bun run start`

## Environment Variables

Copy `bun-env.example` to `.env.local` and adjust as needed:
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry
- `NODE_ENV=development` - Set development mode
- `BUN_INSTALL=1` - Enable Bun-specific optimizations
