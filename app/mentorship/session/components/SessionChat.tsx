"use client"

import { ChatInterface } from "@/components/avatar/chat-interface";
import { Scenario } from "@/components/avatar/scenario";
import { Chat } from "@/components/Chat/Chat";
import { FlowChart } from "@/components/Chat/flow-chart";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";


function App() {
  return (
    <div className="flex h-screen">
        <Loader />
        <Leva collapsed hidden/>
        <ChatInterface />
        <FlowChart/>
        <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
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
          }}/>
        </Canvas>
        <Chat />
      </div>

  );
}

export default App;

