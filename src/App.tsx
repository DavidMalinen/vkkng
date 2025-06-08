import { memo, useEffect, useRef, useState, useCallback, type ReactElement } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import { PostProcessing } from 'components/dithering/PostProcessing';
import { EnvironmentWrapper } from 'components/dithering/Environment';
import * as THREE from 'three';
import { useControls, folder, Leva } from 'leva';
import { Chalice } from 'components/models/Chalice';
import 'styles/main.css';

/**
 * Main application component
 */
export default function App(): ReactElement {
  const { bgColor } = useControls({
    'Scene Settings': folder({
      bgColor: {
        value: '#ffffff',
        label: 'Background Color'
      }
    })
  });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [modelScale, setModelScale] = useState(3);

  const { intensity, highlight } = useControls({
    'Environment Settings': folder({
      intensity: {
        value: 1.5,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Environment Intensity'
      },
      highlight: {
        value: '#066aff',
        label: 'Highlight Color'
      }
    })
  });

  // Update renderer clear color when background color changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setClearColor(new THREE.Color(bgColor));
    }
  }, [bgColor]);

  // Responsive adjustment handler for model scale
  const handleResize = useCallback(() => {
    const isSmallScreen = window.innerWidth <= 768;
    setModelScale(isSmallScreen ? 2.4 : 3); // 20% reduction on small screens
  }, []);

  // Set up resize handling
  useEffect(() => {
    // Initial check
    handleResize();
    
    // Add listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <>
      <Leva collapsed hidden={false} />
      <Canvas 
        shadows 
        camera={{ position: [0, -1, 4], fov: 65 }}
        gl={{ 
          alpha: false 
        }}
        onCreated={({ gl }) => {
          rendererRef.current = gl;
          gl.setClearColor(new THREE.Color(bgColor));
        }}
      >
        <group position={[0, -0.5, 0]}>
          <Float 
            floatIntensity={2} 
            rotationIntensity={1}
            speed={2}
          >
            <Center scale={modelScale} position={[0, .8, 0]} rotation={[0, -Math.PI / 3.5, -0.4]}>
              <Chalice />
            </Center>
          </Float>
        </group>
        <OrbitControls />
        <EnvironmentWrapper intensity={intensity} highlight={highlight} />
        <Effects />
      </Canvas>
    </>
  )
}

/**
 * Post-processing effects wrapper component
 * Memoized to prevent unnecessary re-renders
 */
const Effects: React.FC = memo(() => (
  <PostProcessing />
))