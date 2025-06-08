import { useGLTF } from "@react-three/drei";
import type { ReactElement } from "react";

interface ChaliceProps {
  [key: string]: any;
}

export function Chalice(props: ChaliceProps): ReactElement {
  const { nodes, materials } = useGLTF('/chalice-transformed.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.dragon_chalice.geometry} material={materials.Obsidian} position={[-12.624, 6.324, 0.933]} rotation={[-1.555, 0, -Math.PI]} scale={0.009} />
    </group>
  )
}

useGLTF.preload('/chalice-transformed.glb')