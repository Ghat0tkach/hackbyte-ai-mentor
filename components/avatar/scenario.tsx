import { CameraControls, Environment } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Avatar } from "./avatar";

interface SceneProps {
  hidden?: boolean;
  environment?: boolean;
  scale: number;
  cameraCoords?: {
    CameraPosition:{
      x: number;
      y: number;
      z: number;
    },
    CameraTarget:{
      x: number;
      y: number;
      z: number;
    }
  };
}
export const Scenario = ({environment, hidden, cameraCoords, scale}:SceneProps) => {
  const cameraControls = useRef();
  
  useEffect(() => {
    cameraControls.current.setLookAt(
      cameraCoords?.CameraPosition.x,cameraCoords?.CameraPosition.y,cameraCoords?.CameraPosition.z,
      cameraCoords?.CameraTarget.x,cameraCoords?.CameraTarget.y,cameraCoords?.CameraTarget.z,
      true
    );
    
  }, []);

  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment 
        files="/poly_haven_studio_4k.hdr"
        background
        backgroundBlurriness={0.1}
        ground={{
          height: 7,
          radius: 20,
          scale: 50
        }}
        resolution={2048}
        preset={null}
      />
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />
      <Avatar position={[0, 0, 0]} scale={scale} />
    </>
  );
};
