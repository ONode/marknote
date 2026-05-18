import { useCallback, useRef } from 'react';

export interface PanZoomState {
  isPanning: boolean;
  startPoint: { x: number; y: number };
  currentTranslate: { x: number; y: number };
  currentScale: number;
  isHovering: boolean;
}

export interface UsePanZoomOptions {
  minScale?: number;
  maxScale?: number;
  zoomFactor?: number;
  resetOnMouseLeave?: boolean;
}

export interface UsePanZoomReturn {
  addPanZoomToChart: (svgElement: SVGElement, isMounted: boolean) => void;
  updateTransform: (svgElement: SVGElement, translate: { x: number; y: number }, scale: number) => void;
}

export function usePanZoom(options: UsePanZoomOptions = {}): UsePanZoomReturn {
  const {
    minScale = 0.5,
    maxScale = 3,
    zoomFactor = 0.1,
    resetOnMouseLeave = true
  } = options;

  // Function to update the transform of the SVG
  const updateTransform = useCallback((svgElement: SVGElement, translate: { x: number, y: number }, scale: number) => {
    if (!svgElement.isConnected) return;
    svgElement.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
    svgElement.style.transformOrigin = 'center';
  }, []);

  // Function to add pan and zoom functionality to a Mermaid chart
  const addPanZoomToChart = useCallback((svgElement: SVGElement, isMounted: boolean) => {
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let currentTranslate = { x: 0, y: 0 };
    let currentScale = 1;
    let isHovering = false;

    // Create a wrapper div for the SVG if it doesn't exist
    let wrapper = svgElement.parentElement;
    if (!wrapper || !wrapper.classList.contains('mermaid-wrapper')) {
      wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      // Check if the SVG is still in the DOM before manipulating it
      if (svgElement.parentNode && svgElement.isConnected) {
        svgElement.parentNode.insertBefore(wrapper, svgElement);
        wrapper.appendChild(svgElement);
        // Ensure the SVG takes full width and height of wrapper
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.margin = '0';
        svgElement.style.padding = '0';
        svgElement.style.display = 'block';
      } else {
        console.log('SVG element no longer in DOM, skipping wrapper creation');
        return;
      }

      // Only add event listeners if the component is still mounted
      if (!isMounted) {
        console.log('Component unmounted, skipping event listener setup');
        return;
      }
    }

    // Function to enable pan and zoom
    const enablePanZoom = () => {
      if (!isHovering || !isMounted) return;
      wrapper!.style.cursor = 'grab';
      wrapper!.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };

    // Function to disable pan and zoom
    const disablePanZoom = () => {
      if (!isMounted) return;
      isPanning = false;
      wrapper!.style.cursor = 'default';
      wrapper!.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    };

    // Hover events to trigger pan and zoom functionality
    wrapper!.addEventListener('mouseenter', () => {
      if (!isMounted) return;
      isHovering = true;
      enablePanZoom();
    });

    wrapper!.addEventListener('mouseleave', () => {
      if (!isHovering || !isMounted) return;
      isHovering = false;
      disablePanZoom();
      // Reset transform when leaving if option is enabled
      if (resetOnMouseLeave) {
        currentTranslate = { x: 0, y: 0 };
        currentScale = 1;
        updateTransform(svgElement, currentTranslate, currentScale);
      }
    });

    // Mouse event listeners for panning (only active when hovering)
    wrapper!.addEventListener('mousedown', (e) => {
      if (!isHovering || e.button !== 0 || !isMounted) return; // Only left mouse button and when hovering

      isPanning = true;
      startPoint = { x: e.clientX, y: e.clientY };
      wrapper!.style.cursor = 'grabbing';
      e.preventDefault();
    });

    wrapper!.addEventListener('mousemove', (e) => {
      if (!isHovering || !isPanning || !isMounted) return;

      const deltaX = e.clientX - startPoint.x;
      const deltaY = e.clientY - startPoint.y;

      currentTranslate.x += deltaX;
      currentTranslate.y += deltaY;

      startPoint = { x: e.clientX, y: e.clientY };

      updateTransform(svgElement, currentTranslate, currentScale);
    });

    wrapper!.addEventListener('mouseup', () => {
      if (!isHovering || !isMounted) return;
      isPanning = false;
      wrapper!.style.cursor = 'grab';
    });

    // Wheel event for zooming (only active when hovering)
    wrapper!.addEventListener('wheel', (e) => {
      if (!isHovering || !isMounted) return;

      e.preventDefault();

      const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;

      currentScale = Math.max(minScale, Math.min(maxScale, currentScale + delta));

      updateTransform(svgElement, currentTranslate, currentScale);
    });

    // Double-click to reset (only active when hovering)
    wrapper!.addEventListener('dblclick', () => {
      if (!isHovering || !isMounted) return;

      currentTranslate = { x: 0, y: 0 };
      currentScale = 1;
      updateTransform(svgElement, currentTranslate, currentScale);
    });
  }, [minScale, maxScale, zoomFactor, resetOnMouseLeave, updateTransform]);

  return {
    addPanZoomToChart,
    updateTransform
  };
}
