import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const flowChartDefinition = `
graph TD
    A[Start Recording] -->|Audio Data| B[Convert to Base64]
    B --> C[Send to Server /sts]
    C --> D[Convert Audio to Text]
    D --> E[OpenAI Processing]
    E --> F[Generate Response]
    F --> G[Lip Sync Generation]
    G --> H[Send Response]
    H --> I[Play Audio]
    I --> J[Animate Avatar]

    classDef primary fill:#4f46e5,stroke:#3730a3,color:white,stroke-width:2px
    classDef secondary fill:#8b5cf6,stroke:#6d28d9,color:white,stroke-width:2px
    classDef tertiary fill:#ec4899,stroke:#be185d,color:white,stroke-width:2px
    
    class A,B,C primary
    class D,E,F secondary
    class G,H,I,J tertiary
`;

export const FlowChart = () => {
  const mermaidRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: true,
        theme: 'forest',
        securityLevel: 'loose',
        flowchart: {
          curve: 'basis',
          nodeSpacing: 50, // This line remains unchanged
          rankSpacing: 40,
          diagramPadding: 10,
        },
      });
      
      try {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = flowChartDefinition;
          mermaid.default.contentLoaded();
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    });
  }, []);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div 
      className={`fixed z-50 rounded-lg shadow-xl overflow-hidden ${
        isFullScreen 
          ? 'inset-0 rounded-none w-4/5 h-screen' 
          : 'bottom-6 left-6 w-[400px] h-[500px]'
      }`}
    >
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white flex justify-between items-center">
        <h3 className="font-medium">System Architecture</h3>
        <div className="flex space-x-2">
          <button 
            onClick={zoomIn}
            className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center"
            title="Zoom in"
          >
            {/* Zoom in SVG */}
          </button>
          <button 
            onClick={zoomOut}
            className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center"
            title="Zoom out"
          >
            {/* Zoom out SVG */}
          </button>
          <button 
            onClick={resetZoom}
            className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center"
            title="Reset view"
          >
            {/* Reset SVG */}
          </button>
          
          {/* New fullscreen button */}
          <button 
            onClick={toggleFullScreen}
            className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center"
            title={isFullScreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 0 1 1-1h3V6a1 1 0 0 1 2 0v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 0 1-1-1z" clipRule="evenodd" transform="rotate(45 10 10)" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="bg-white h-[450px] overflow-auto relative">
        <div 
          className="min-h-full min-w-full flex items-center justify-center p-4"
          style={{ 
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s ease-out',
            transformOrigin: 'center center'
          }}
        >
          <div className="mermaid" ref={mermaidRef}>
            {flowChartDefinition}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-gray-600">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default FlowChart;