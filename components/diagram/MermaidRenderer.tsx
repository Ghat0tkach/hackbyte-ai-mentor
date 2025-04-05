import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  className?: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, className = '' }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (mermaidRef.current && chart) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        flowchart: {
          curve: 'basis',
          htmlLabels: true
        },
        animation: true
      });
      
      // Generate a unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      mermaidRef.current.id = id;
      mermaidRef.current.innerHTML = chart;
      
      try {
        // Render the new diagram
        mermaid.init(undefined, mermaidRef.current);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    }
  }, [chart]);

  return (
    <div className={`mermaid-diagram ${className}`}>
      <div ref={mermaidRef} className="mermaid">
        {chart}
      </div>
    </div>
  );
};

export default MermaidRenderer;