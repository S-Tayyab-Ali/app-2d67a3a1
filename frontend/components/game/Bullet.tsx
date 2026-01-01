"use client";

import React, { useEffect, useRef } from 'react';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3 } from 'three';

interface BulletProps {
  position: [number, number, number];
  velocity: [number, number, number];
  onHit: () => void;
}

export default function Bullet({ position, velocity, onHit }: BulletProps) {
  const rigidBody = useRef<RapierRigidBody>(null);
  const isHit = useRef(false);

  useEffect(() => {
    // Destroy bullet after 2 seconds if it hasn't hit anything
    const timer = setTimeout(() => {
      if (!isHit.current) {
        onHit();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [onHit]);

  return (
    <RigidBody 
      ref={rigidBody} 
      position={position} 
      linearVelocity={velocity} 
      gravityScale={0.5}
      colliders="ball"
      userData={{ type: 'bullet' }}
      onCollisionEnter={(payload) => {
        if (isHit.current) return;
        isHit.current = true;
        // We can check what we hit here if needed, but for now just destroy
        onHit();
      }}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={2} />
      </mesh>
    </RigidBody>
  );
}

