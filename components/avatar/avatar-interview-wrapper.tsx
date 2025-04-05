import React from "react";
import { Canvas } from "@react-three/fiber";
import { Avatar } from "./avatar";

interface AvatarInterviewWrapperProps {
  size?: number;
}

export const AvatarInterviewWrapper: React.FC<AvatarInterviewWrapperProps> = ({ size = 200 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "fixed",
        left: 20,
        bottom: 20,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 2.5], fov: 30 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Avatar size={size} />
      </Canvas>
    </div>
  );
};