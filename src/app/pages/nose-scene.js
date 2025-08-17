'use client';

import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, useGLTF } from '@react-three/drei';
import '@/app/styles/nose-scene.css';

function NoseModel() {
    const { scene } = useGLTF('/assets/models/nose/scene.gltf');
    return <primitive object={scene} position={[0, 5, 0]} />;
}

function LoadingFallback() {
    return (
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#cccccc" />
        </mesh>
    );
}

export default function NoseScene() {
    const [isClient, setIsClient] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleError = (error) => {
        console.error('Erreur de chargement du modèle 3D:', error);
        setError('Impossible de charger le modèle 3D. Vérifiez que le fichier existe dans public/assets/models/nose/scene.gltf');
    };

    if (!isClient) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Chargement de la page...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                color: 'red'
            }}>
                <h3>Erreur</h3>
                <p>{error}</p>
                <small>Assurez-vous que le fichier scene.gltf est dans public/assets/models/nose/</small>
            </div>
        );
    }

    return (
        <div className="nose-scene">
            <Canvas
                camera={{
                    position: [15, 0, 20],
                    fov: 20,
                    near: 0.1,
                    far: 50
                }}
                shadows
                onError={handleError}
            >
                {/* Éclairage */}
                <directionalLight
                    position={[10, 10, 10]}
                    intensity={1}
                    castShadow
                />
                <ambientLight intensity={0.3} />

                <Suspense fallback={<LoadingFallback />}>
                    <NoseModel />
                </Suspense>

                <OrbitControls
                    target={[0, 5, 0]}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                />
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    );
}

useGLTF.preload('/assets/models/nose/scene.gltf');