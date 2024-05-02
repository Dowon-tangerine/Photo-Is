// src/components/ModelViewer.tsx
import React, { Suspense, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const fallbackRender = () => (
    <div>Error loading the model. Please try reloading.</div>
  );

  return hasError ? fallbackRender() : children;
};

const Model = ({ modelPath }) => {
  const model = useLoader(FBXLoader, modelPath);
  return <primitive object={model} scale={0.01} />;
};

const ModelViewer = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading Model...</div>}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Model modelPath="assets/models/yourModelFileName.fbx" />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
};

export default ModelViewer;
