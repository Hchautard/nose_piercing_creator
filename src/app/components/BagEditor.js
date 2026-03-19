'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useEditorStore } from '@/app/store/editorStore';
import ToteBag from '@/app/components/ToteBag';
import Sidebar from '@/app/components/Sidebar';
import { Grid } from '@react-three/drei';
import styles from '@/app/styles/editor.module.css';

export default function BagEditor() {
  const { showGrid, autoRotate } = useEditorStore();

  return (
      <div className={styles.layout}>
        <div className={styles.viewport}>
          <Canvas
              camera={{ position: [0, 3, 9], fov: 40, near: 0.1, far: 100 }}
              shadows
              gl={{ antialias: true, alpha: false, toneMapping: 3 }}
              dpr={[1, 2]}
          >
            <color attach="background" args={['#1a1a20']} />
            <fog attach="fog" args={['#1a1a20', 18, 40]} />

            <ambientLight intensity={0.4} />
            <directionalLight
                position={[5, 10, 6]}
                intensity={1.4}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={30}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
            />
            <directionalLight position={[-3, 5, -4]} intensity={0.25} color="#aaccff" />
            <pointLight position={[0, 2, 5]} intensity={0.3} color="#ffeedd" />

            <Environment preset="studio" environmentIntensity={0.15} />

            <ToteBag />

            <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.5}
                scale={20}
                blur={2.5}
                far={8}
            />

            {showGrid && (
                <Grid
                    args={[30, 30]}
                    position={[0, 0, 0]}
                    cellSize={0.5}
                    cellThickness={0.4}
                    cellColor="#2a2a34"
                    sectionSize={2}
                    sectionThickness={0.8}
                    sectionColor="#3a3a48"
                    fadeDistance={20}
                    fadeStrength={1}
                    infiniteGrid
                />
            )}

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.06}
                minDistance={3}
                maxDistance={25}
                maxPolarAngle={Math.PI / 2 + 0.05}
                autoRotate={autoRotate}
                autoRotateSpeed={1.2}
                target={[0, 2.2, 0]}
            />

            <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          </Canvas>

          <div className={styles.viewportBadge}>
            Tote Bag Editor
          </div>
        </div>
        <Sidebar />
      </div>
  );
}