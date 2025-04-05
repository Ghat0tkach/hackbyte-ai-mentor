"use client"

import { Scenario } from "@/components/avatar/scenario";
import { Chat } from "@/components/Chat/Chat";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Chat */}
      <div className="w-1/3 h-full">
        <Chat />
      </div>
      
      {/* Right side - 3D Avatar */}
      <div className="w-2/3 h-full relative bg-gray-900">
        <Loader />
        <Leva collapsed hidden/>
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 0], fov: 10 }}
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false
          }}
          dpr={[1, 2]} // Limit pixel ratio for better performance
          performance={{ min: 0.5 }} // Allow frame rate to drop to improve stability
        >
          <Scenario 
            environment={true} 
            scale={3.2}
            cameraCoords={{
              CameraPosition: {
                x: 0,
                y: 8.5,
                z: 25
              },
              CameraTarget: {
                x: 0,
                y: 4.2,
                z: 0
              }
            }}
          />
        </Canvas>
        
        {/* Controls overlay */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 bg-opacity-70 p-3 rounded-full">
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default App;

