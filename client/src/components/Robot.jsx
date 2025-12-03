import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function SamuraiModel() {
  // 1. Načtení modelu
  // 'nodes' obsahuje všechny části modelu (Head, Body, Arm...)
  const { scene, nodes } = useGLTF("/junomi_samurai.glb");
  
  // Reference pro přímý přístup k částem robota
  const headRef = useRef();
  const armRef = useRef();

  // 2. Najdeme konkrétní části modelu a přiřadíme je do refs
  // Toto se spustí jen jednou po načtení
  useEffect(() => {
    // Vypíše do konzole názvy všech částí - zkontroluj si je v prohlížeči (F12)!
    console.log("Dostupné nody:", nodes);

    // ZDE UPRAV NÁZVY "Head" a "ArmRight" PODLE BLENDERU
    if (nodes.Head) headRef.current = nodes.Head;
    if (nodes.ArmRight) armRef.current = nodes.ArmRight;
  }, [nodes]);

  // 3. Animace (běží každý frame)
  useFrame((state) => {
    const t = state.clock.getElapsedTime(); // Čas pro sinusoidu
    
    // A) Mávání rukou
    if (armRef.current) {
      // Sinusoida: (rychlost * t) * rozsah + offset
      // Změň 'z' na 'x' nebo 'y' podle toho, jak máš otočené osy v Blenderu
      armRef.current.rotation.z = Math.sin(t * 5) * 0.5 + 0.5; 
    }

    // B) Otáčení hlavy za myší
    if (headRef.current) {
      // state.pointer.x je hodnota od -1 do 1 (poloha myši)
      const targetX = state.pointer.x * 0.5; // 0.5 omezuje úhel otáčení
      const targetY = state.pointer.y * 0.5;

      // Lerp = Linear Interpolation (pro plynulý dojezd hlavy)
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -targetY, 0.1);
    }
  });

  return <primitive object={scene} scale={2} position={[0, -2, 0]} />;
}

// Hlavní komponenta, kterou vložíš do stránky
export default function RobotScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#333" }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        {/* Světla */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Model */}
        <SamuraiModel />
        
        {/* Ovládání myší (nepovinné, pro debugování) */}
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

// Preload modelu, aby neproblikl při načítání
useGLTF.preload("/junomi_samurai.glb");