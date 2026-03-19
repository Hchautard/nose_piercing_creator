'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function BagMesh({ shape, onClick, isSelected = false }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current && isSelected) {
      // Subtle breathing effect on selected
    }
  });

  const { dimensions, material, position, rotation, scale } = shape;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <RoundedBox
        ref={meshRef}
        args={[dimensions.width, dimensions.height, dimensions.depth]}
        radius={0.04}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={hovered && !isSelected ? '#aaaadd' : material.color}
          roughness={material.roughness}
          metalness={material.metalness}
          opacity={material.opacity}
          transparent={material.transparent || material.opacity < 1}
          clearcoat={0.1}
          clearcoatRoughness={0.4}
        />
        {isSelected && (
          <Edges
            threshold={15}
            color="#4f8cff"
            lineWidth={2}
          />
        )}
      </RoundedBox>

      {/* Dimension labels on hover or select */}
      {(hovered || isSelected) && (
        <Html
          position={[0, dimensions.height / 2 + 0.3, 0]}
          center
          style={{
            background: 'rgba(18,18,20,0.9)',
            color: '#e8e8ec',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'nowrap',
            border: '1px solid rgba(79,140,255,0.3)',
            pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
          }}
        >
          {dimensions.width.toFixed(1)} × {dimensions.height.toFixed(1)} × {dimensions.depth.toFixed(1)}
        </Html>
      )}
    </group>
  );
}
