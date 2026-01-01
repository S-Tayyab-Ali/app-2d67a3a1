"use client";

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameStore } from '@/store/gameStore';

export default function Weapon() {
  const group = useRef<THREE.Group>(null);
  const { isReloading, ammo } = useGameStore();
  const recoilTime = useRef(0);

  // Listen for shoot events to trigger recoil
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.shots > prevState.shots) {
        recoilTime.current = Date.now();
      }
    });
    return unsubscribe;
  }, []);

  useFrame(() => {
    if (!group.current) return;

    // Simple recoil animation
    const now = Date.now();
    const timeSinceShot = now - recoilTime.current;
    
    if (timeSinceShot < 100) {
      // Kick back
      group.current.position.z = 0.2;
      group.current.rotation.x = 0.1;
    } else {
      // Return to rest
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.1);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.1);
    }

    // Reload animation
    if (isReloading) {
      group.current.rotation.x = -0.5; // Point down
      group.current.position.y = -0.2;
    } else if (timeSinceShot > 100) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
    }
  });

  return (
    <group ref={group} position={[0.3, -0.25, -0.5]}>
      {/* Gun Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.15, 0.4]} />
        <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Barrel */}
      <mesh position={[0, 0.05, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Handle */}
      <mesh position={[0, -0.1, 0.1]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Sight */}
      <mesh position={[0, 0.1, 0.15]}>
        <boxGeometry args={[0.02, 0.05, 0.05]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

import * as THREE from 'three';

