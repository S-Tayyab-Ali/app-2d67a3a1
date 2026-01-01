"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/gameStore';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playHitSound } from '@/utils/sound';

interface TargetProps {
  position: [number, number, number];
  isMoving?: boolean;
}

export default function Target({ position, isMoving = false }: TargetProps) {
  const [isActive, setIsActive] = useState(true);
  const rigidBody = useRef<RapierRigidBody>(null);
  const hitTarget = useGameStore((state) => state.hitTarget);
  const timeOffset = useRef(Math.random() * 100);
  const initialPos = useRef(new THREE.Vector3(...position));

  // Respawn logic
  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        setIsActive(true);
        // Reset physics position if needed
        if (rigidBody.current) {
          rigidBody.current.setTranslation(initialPos.current, true);
          rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rigidBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  useFrame((state) => {
    if (isMoving && isActive && rigidBody.current) {
      const time = state.clock.getElapsedTime();
      const x = initialPos.current.x + Math.sin(time + timeOffset.current) * 2;
      const nextPos = new THREE.Vector3(x, initialPos.current.y, initialPos.current.z);
      rigidBody.current.setNextKinematicTranslation(nextPos);
    }
  });

  const handleCollision = (payload: any) => {
    if (!isActive) return;
    
    // Check if hit by bullet
    if (payload.other.rigidBodyObject?.userData?.type === 'bullet') {
      setIsActive(false);
      hitTarget();
      playHitSound();
    }
  };

  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      type={isMoving ? "kinematicPosition" : "fixed"}
      colliders="cuboid"
      userData={{ type: 'target' }}
      onCollisionEnter={handleCollision}
    >
      <group visible={isActive}>
        {/* Target Stand */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        
        {/* Target Face */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0.2, 0.06]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <mesh position={[0, 0.2, 0.06]}>
          <ringGeometry args={[0.25, 0.3, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </RigidBody>
  );
}
