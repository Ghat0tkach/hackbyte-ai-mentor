"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Avatar } from "./avatar";
import { Loader } from "@react-three/drei";

interface AvatarWrapperProps {
  size?: number;
}

export const AvatarWrapper: React.FC<AvatarWrapperProps> = ({ size = 200 }) => {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <Loader />
      <Canvas 
        shadows 
        camera={{ position: [0, 1.5, 2.5], fov: 30 }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Avatar size={size} />
      </Canvas>
    </div>
  );
};