'use client';

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useState, useRef } from 'react';

export default function NoseScene() {
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    const urlNose = '../../assets/models/nose/scene.gltf';

    useEffect(() => {
        setIsClient(true);

        if (typeof window !== 'undefined' && canvasRef.current) {
            const canvas = canvasRef.current;
            const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

            const fov = 45;
            const aspect = 2;
            const near = 0.1;
            const far = 100;
            const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(0, 10, 20);

            const controls = new OrbitControls(camera, canvas);
            controls.target.set(0, 5, 0);
            controls.update();

            const scene = new THREE.Scene();
            scene.background = new THREE.Color('black');

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(10, 10, 10);
            scene.add(light);

            let cars = null;

            const gltfLoader = new GLTFLoader();
            gltfLoader.load(
                urlNose,
                (gltf) => {
                    scene.add(gltf.scene);
                    cars = gltf.scene;
                    setLoading(false);
                },
                undefined,
                (err) => {
                    console.error('An error happened', err);
                    setError('Erreur de chargement du modèle 3D');
                    setLoading(false);
                }
            );

            function resizeRendererToDisplaySize(renderer) {
                const canvas = renderer.domElement;
                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                const needResize = canvas.width !== width || canvas.height !== height;
                if (needResize) {
                    renderer.setSize(width, height, false);
                }
                return needResize;
            }

            function render(time) {
                time *= 0.001;

                if (resizeRendererToDisplaySize(renderer)) {
                    const canvas = renderer.domElement;
                    camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    camera.updateProjectionMatrix();
                }

                if (cars) {
                    for (const car of cars.children) {
                        car.rotation.y = time;
                    }
                }

                renderer.render(scene, camera);
                requestAnimationFrame(render);
            }

            requestAnimationFrame(render);

            return () => {
                renderer.dispose();
                controls.dispose();
            };
        }
    }, []);

    if (!isClient) {
        return <div>Chargement de la page...</div>;
    }

    return (
        <div className="nose-scene">
            {loading && (
                <div className="loading-overlay">
                    <div>Chargement du modèle 3D...</div>
                </div>
            )}

            {error && (
                <div className="error-overlay">
                    <div>{error}</div>
                </div>
            )}

            <canvas ref={canvasRef} id="c"></canvas>
        </div>
    );
}