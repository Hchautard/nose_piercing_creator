'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEditorStore } from '@/app/store/editorStore';

// ── Motif shape generators (2D THREE.Shape for extrusion) ──

function createHeartShape(scale = 1) {
  const s = new THREE.Shape();
  const k = scale;
  s.moveTo(0, -0.7 * k);
  s.bezierCurveTo(0, -0.9 * k, -0.5 * k, -1.1 * k, -1 * k, -0.6 * k);
  s.bezierCurveTo(-1.5 * k, -0.1 * k, -0.8 * k, 0.5 * k, 0, 1 * k);
  s.bezierCurveTo(0.8 * k, 0.5 * k, 1.5 * k, -0.1 * k, 1 * k, -0.6 * k);
  s.bezierCurveTo(0.5 * k, -1.1 * k, 0, -0.9 * k, 0, -0.7 * k);
  return s;
}

function createStarShape(scale = 1, points = 5) {
  const s = new THREE.Shape();
  const outer = 1 * scale;
  const inner = 0.4 * scale;
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

function createHeartStarShape(scale = 1) {
  // Return an array of shapes: a heart + spiky rays
  const shapes = [];
  // Heart
  shapes.push(createHeartShape(scale * 0.6));
  // Star rays around
  const rayCount = 8;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    const rs = new THREE.Shape();
    const len = scale * (0.7 + Math.random() * 0.4);
    const w = scale * 0.04;
    const cx = Math.cos(angle);
    const cy = Math.sin(angle);
    const px = -cy * w;
    const py = cx * w;
    rs.moveTo(cx * scale * 0.35 + px, cy * scale * 0.35 + py);
    rs.lineTo(cx * len, cy * len);
    rs.lineTo(cx * scale * 0.35 - px, cy * scale * 0.35 - py);
    rs.closePath();
    shapes.push(rs);
  }
  return shapes;
}

function createDiamondShape(scale = 1) {
  const s = new THREE.Shape();
  s.moveTo(0, scale);
  s.lineTo(scale * 0.6, 0);
  s.lineTo(0, -scale);
  s.lineTo(-scale * 0.6, 0);
  s.closePath();
  return s;
}

function createCircleShape(scale = 1) {
  const s = new THREE.Shape();
  s.absarc(0, 0, scale * 0.8, 0, Math.PI * 2, false);
  return s;
}

function createCrossShape(scale = 1) {
  const s = new THREE.Shape();
  const a = scale * 0.25;
  const b = scale * 0.85;
  s.moveTo(-a, b);
  s.lineTo(a, b);
  s.lineTo(a, a);
  s.lineTo(b, a);
  s.lineTo(b, -a);
  s.lineTo(a, -a);
  s.lineTo(a, -b);
  s.lineTo(-a, -b);
  s.lineTo(-a, -a);
  s.lineTo(-b, -a);
  s.lineTo(-b, a);
  s.lineTo(-a, a);
  s.closePath();
  return s;
}

function getMotifShapes(motifId, scale) {
  switch (motifId) {
    case 'heart-star': return createHeartStarShape(scale);
    case 'star': return [createStarShape(scale)];
    case 'heart': return [createHeartShape(scale)];
    case 'diamond': return [createDiamondShape(scale)];
    case 'circle': return [createCircleShape(scale)];
    case 'cross': return [createCrossShape(scale)];
    default: return [];
  }
}

// ── Bag body with puffy effect ──

function BagBody({ width, height, depth, puffiness, color, roughness, metalness }) {
  const geometry = useMemo(() => {
    // Create a rounded rectangle shape for the bag front/back
    const shape = new THREE.Shape();
    const r = 0.08;
    const w = width / 2;
    const h = height / 2;
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const extrudeSettings = {
      steps: 1,
      depth: depth,
      bevelEnabled: true,
      bevelThickness: puffiness,
      bevelSize: puffiness * 0.8,
      bevelOffset: 0,
      bevelSegments: 6,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, [width, height, depth, puffiness]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={0.05}
        clearcoatRoughness={0.6}
        sheen={0.3}
        sheenColor={color}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Motif applied on the bag surface ──

function MotifMesh({ motifId, motifScale, motifDepth, bagWidth, bagHeight, bagDepth, color }) {
  const geometries = useMemo(() => {
    if (motifId === 'none') return [];
    const shapes = getMotifShapes(motifId, motifScale);
    return shapes.map((shape) => {
      const extrudeSettings = {
        steps: 1,
        depth: motifDepth,
        bevelEnabled: true,
        bevelThickness: motifDepth * 0.5,
        bevelSize: motifDepth * 0.3,
        bevelSegments: 3,
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    });
  }, [motifId, motifScale, motifDepth]);

  if (geometries.length === 0) return null;

  // Slightly darker shade for the motif (same hue, tonal relief)
  const motifColor = new THREE.Color(color).multiplyScalar(0.88);
  const offset = bagDepth / 2 + 0.01;

  return (
    <group>
      {/* Front face motif */}
      <group position={[0, 0, offset]} rotation={[0, 0, 0]}>
        {geometries.map((geo, i) => (
          <mesh key={`f-${i}`} geometry={geo} castShadow>
            <meshPhysicalMaterial
              color={motifColor}
              roughness={0.7}
              metalness={0}
              clearcoat={0.05}
              sheen={0.2}
              sheenColor={motifColor}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── Handle (anse) ──

function Handle({ x, handleWidth, handleHeight, bagHeight, bagDepth, color, roughness, metalness }) {
  const curve = useMemo(() => {
    const h = handleHeight;
    const topY = bagHeight / 2;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - handleWidth * 1.5, topY, 0),
      new THREE.Vector3(x - handleWidth * 1.2, topY + h * 0.5, 0),
      new THREE.Vector3(x, topY + h, 0),
      new THREE.Vector3(x + handleWidth * 1.2, topY + h * 0.5, 0),
      new THREE.Vector3(x + handleWidth * 1.5, topY, 0),
    ]);
  }, [x, handleWidth, handleHeight, bagHeight]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, handleWidth / 2, 12, false);
  }, [curve, handleWidth]);

  return (
    <mesh geometry={geometry} castShadow>
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={0.05}
        sheen={0.3}
        sheenColor={color}
      />
    </mesh>
  );
}

// ── Main ToteBag component ──

export default function ToteBag() {
  const groupRef = useRef();
  const { bag, handles, material, selectedMotif, motifScale, motifDepth } = useEditorStore();

  return (
    <group ref={groupRef} position={[0, bag.height / 2 + 0.1, 0]}>
      <BagBody
        width={bag.width}
        height={bag.height}
        depth={bag.depth + bag.puffiness * 2}
        puffiness={bag.puffiness}
        color={material.color}
        roughness={material.roughness}
        metalness={material.metalness}
      />

      <MotifMesh
        motifId={selectedMotif}
        motifScale={motifScale}
        motifDepth={motifDepth}
        bagWidth={bag.width}
        bagHeight={bag.height}
        bagDepth={bag.depth + bag.puffiness * 2}
        color={material.color}
      />

      {handles.visible && (
        <>
          <Handle
            x={-handles.gap / 2}
            handleWidth={handles.width}
            handleHeight={handles.height}
            bagHeight={bag.height}
            bagDepth={bag.depth}
            color={material.color}
            roughness={material.roughness}
            metalness={material.metalness}
          />
          <Handle
            x={handles.gap / 2}
            handleWidth={handles.width}
            handleHeight={handles.height}
            bagHeight={bag.height}
            bagDepth={bag.depth}
            color={material.color}
            roughness={material.roughness}
            metalness={material.metalness}
          />
        </>
      )}
    </group>
  );
}
