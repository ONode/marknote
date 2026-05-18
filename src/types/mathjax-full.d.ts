// TypeScript declarations for MathJax v4.0.0
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements: HTMLElement[]) => Promise<void>;
      config: any;
      startup: {
        ready: () => void;
        defaultReady: () => void;
      };
      loader: {
        load: string[];
      };
      tex: {
        inlineMath: string[][];
        displayMath: string[][];
        processEscapes: boolean;
        processEnvironments: boolean;
        packages: string[];
      };
      chtml: {
        scale: number;
        minScale: number;
      };
      options: {
        enableMenu: boolean;
        menuOptions: any;
      };
      version: string;
      [key: string]: any;
    };
  }
}
