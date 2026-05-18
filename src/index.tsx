import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './components/router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import 'katex/dist/katex.min.css';

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider defaultTheme="system">
      <Router />
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 4000,
          style: {
            
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </ThemeProvider>
  );
}
