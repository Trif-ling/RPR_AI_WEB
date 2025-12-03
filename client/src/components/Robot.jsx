import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber"; 
// DŮLEŽITÉ: Odstraněn import 'useFrame', už ho nepoužíváme.
import { useGLTF, Stage } from "@react-three/drei";

function SamuraiModel() {
  const { scene, nodes } = useGLTF("/junomi_samurai.glb");
  const headRef = useRef();

  useEffect(() => {
    // Toto se spustí jen jednou při načtení - nastaví polohu hlavy
    if (nodes.Head) {
      headRef.current = nodes.Head;
      headRef.current.rotation.x = 1.8;
      headRef.current.rotation.y = 0.5;
      headRef.current.rotation.z = 4.5;
    }
  }, [nodes]);

  // ZDE BYLA ANIMACE (useFrame). JE SMAZANÁ.
  // Robot se ani nehne.

  return <primitive object={scene} rotation={[0, -1.5, 0]} />;
}

export default function RobotScene() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || location.pathname !== '/') {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        
        // KLÍČOVÉ PRO SCROLLOVÁNÍ:
        // "none" zajistí, že tento overlay pro myš neexistuje.
        pointerEvents: "none", 
        
        // Zákaz jakýchkoliv CSS animací kontejneru
        transition: "none",
        transform: "none",
        
        // Flexbox pro stabilní umístění
        display: "flex",
        alignItems: "flex-end", // Zarovnat dolů
        justifyContent: "flex-end", // Zarovnat doprava
      }}
    >
      <div
        style={{
          // Tady nastavujeme odsazení od okrajů
          marginBottom: "200px", // Jak vysoko má být
          marginRight: "60px",   // Jak moc vlevo má být
          
          width: "450px",
          height: "550px",
          transition: "none",
          pointerEvents: "none"
        }}
      >
        <Canvas
          // === PERFORMANCE BOOST ===
          // "demand" = Vykresli 1 snímek a zastav se. 
          // Žádných 60 FPS, nulová zátěž na baterii a CPU.
          frameloop="demand"
          
          shadows={false}
          camera={{ fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          style={{ 
            background: "transparent", 
            pointerEvents: "none" // Pojistka i pro Canvas
          }}
        >
          <Stage
            environment="city"
            intensity={0.5}
            shadows={false}
            adjustCamera={1.2}
          >
            <SamuraiModel />
          </Stage>
        </Canvas>
      </div>
    </div>,
    document.body
  );
}

useGLTF.preload("/junomi_samurai.glb");