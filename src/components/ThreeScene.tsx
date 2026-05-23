import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Stars, useGLTF, Environment } from "@react-three/drei";

function Model({ url }: { url: string }) {
  try {
    const gltf = useGLTF(url) as any;
    return <primitive object={gltf.scene} scale={1.2} position={[0, -0.6, 0]} />;
  } catch (error) {
    console.warn("Failed to load model:", error);
    return null;
  }
}

export default function ThreeScene({ modelUrl, className = "" }: { modelUrl?: string; className?: string }) {
  const [modelError, setModelError] = useState(false);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }} 
        style={{ width: "100%", height: "100%" }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />

        <Stars radius={50} depth={10} count={200} factor={4} saturation={0} fade />

        <Suspense fallback={<Html center>Loading 3D scene…</Html>}>
          {modelUrl && !modelError ? (
            <>
              <Model url={modelUrl} />
              <Environment preset="studio" />
            </>
          ) : (
            <Html center>3D scene</Html>
          )}
        </Suspense>

        <OrbitControls enableZoom autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
