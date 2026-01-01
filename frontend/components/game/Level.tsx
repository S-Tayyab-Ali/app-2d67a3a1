"use client";

import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Sky, Stars } from '@react-three/drei';

export default function Level() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <directionalLight 
        position={[50, 50, 25]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />

      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </RigidBody>

      {/* Walls */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Back Wall */}
        <mesh position={[0, 5, -25]} receiveShadow>
          <boxGeometry args={[50, 10, 1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-25, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[50, 10, 1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Right Wall */}
        <mesh position={[25, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[50, 10, 1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Behind Player Wall */}
        <mesh position={[0, 5, 25]} receiveShadow>
          <boxGeometry args={[50, 10, 1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </RigidBody>

      {/* Obstacles / Cover */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-5, 1, -5]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[5, 1, -10]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 0.5, -15]} castShadow receiveShadow>
          <boxGeometry args={[4, 1, 1]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </RigidBody>
    </>
  );
}

