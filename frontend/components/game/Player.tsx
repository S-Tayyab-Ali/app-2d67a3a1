"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import Bullet from './Bullet';
import Weapon from './Weapon';
import { playShootSound, playReloadSound } from '@/utils/sound';

const SPEED = 5;
const JUMP_FORCE = 5;

export default function Player() {
  const { camera } = useThree();
  const rigidBody = useRef<RapierRigidBody>(null);
  const { status, shoot, reload, finishReload, isReloading, ammo } = useGameStore();
  
  // Movement state
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  // Bullets state
  const [bullets, setBullets] = useState<{ id: number; position: [number, number, number]; velocity: [number, number, number] }[]>([]);
  const bulletIdCounter = useRef(0);
  const weaponGroupRef = useRef<THREE.Group>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
        case 'Space': setMovement(m => ({ ...m, jump: true })); break;
        case 'KeyR': 
          if (ammo < 30 && !isReloading) {
            playReloadSound();
            reload(); 
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
        case 'Space': setMovement(m => ({ ...m, jump: false })); break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (status !== 'playing' || isReloading || ammo <= 0) return;
      if (e.button === 0) { // Left click
        handleShoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [status, isReloading, ammo, reload]);

  // Reload logic
  useEffect(() => {
    if (isReloading) {
      const timer = setTimeout(() => {
        finishReload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isReloading, finishReload]);

  const handleShoot = () => {
    shoot();
    playShootSound();
    
    // Calculate bullet spawn position and velocity
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    const position = new THREE.Vector3();
    camera.getWorldPosition(position);
    // Offset slightly to match gun barrel
    position.add(direction.clone().multiplyScalar(0.5));
    position.add(new THREE.Vector3(0, -0.1, 0).applyQuaternion(camera.quaternion));

    const velocity = direction.multiplyScalar(50); // Bullet speed

    const newBullet = {
      id: bulletIdCounter.current++,
      position: [position.x, position.y, position.z] as [number, number, number],
      velocity: [velocity.x, velocity.y, velocity.z] as [number, number, number],
    };

    setBullets(prev => [...prev, newBullet]);
  };

  const removeBullet = (id: number) => {
    setBullets(prev => prev.filter(b => b.id !== id));
  };

  useFrame(() => {
    if (!rigidBody.current || status !== 'playing') return;

    // Get current velocity
    const vel = rigidBody.current.linvel();

    // Calculate movement direction relative to camera
    const frontVector = new THREE.Vector3(
      0,
      0,
      Number(movement.backward) - Number(movement.forward)
    );
    const sideVector = new THREE.Vector3(
      Number(movement.left) - Number(movement.right),
      0,
      0
    );

    const direction = new THREE.Vector3();
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    // Apply velocity (keep Y velocity for gravity)
    rigidBody.current.setLinvel({ x: direction.x, y: vel.y, z: direction.z }, true);

    // Jump
    if (movement.jump && Math.abs(vel.y) < 0.05) { // Simple ground check
      rigidBody.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
    }

    // Sync camera to player body
    const translation = rigidBody.current.translation();
    camera.position.set(translation.x, translation.y + 1.5, translation.z);

    // Sync weapon to camera
    if (weaponGroupRef.current) {
      weaponGroupRef.current.position.copy(camera.position);
      weaponGroupRef.current.rotation.copy(camera.rotation);
    }
  });

  return (
    <>
      <RigidBody 
        ref={rigidBody} 
        colliders={false} 
        mass={1} 
        type="dynamic" 
        position={[0, 5, 10]} 
        enabledRotations={[false, false, false]}
        friction={0}
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>

      {/* Weapon attached to camera */}
      <group ref={weaponGroupRef}>
        <Weapon />
      </group>

      {/* Bullets */}
      {bullets.map(bullet => (
        <Bullet 
          key={bullet.id} 
          position={bullet.position} 
          velocity={bullet.velocity} 
          onHit={() => removeBullet(bullet.id)} 
        />
      ))}

      {status === 'playing' && <PointerLockControls />}
    </>
  );
}
