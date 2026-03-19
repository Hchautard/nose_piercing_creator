'use client';

import { useRef, useEffect } from 'react';
import { TransformControls, Grid } from '@react-three/drei';
import { useEditorStore } from '@/app/store/editorStore';
import BagMesh from '@/app/components/BagMesh';

function TransformableShape({ shape }) {
  const transformRef = useRef();
  const { selectedId, transformMode, snapEnabled, snapValue, updateShapeTransform, commitTransform, selectShape } = useEditorStore();
  const isSelected = selectedId === shape.id;

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const onDraggingChanged = (event) => {
      // Disable orbit controls while dragging
      const orbitControls = controls?.parent?.parent?.children?.find(
        (c) => c.type === 'OrbitControls'
      );

      if (!event.value) {
        // Drag ended — commit transform
        const obj = controls.object;
        if (obj) {
          updateShapeTransform(shape.id, {
            position: obj.position.toArray(),
            rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
            scale: obj.scale.toArray(),
          });
          commitTransform();
        }
      }
    };

    controls.addEventListener('dragging-changed', onDraggingChanged);
    return () => controls.removeEventListener('dragging-changed', onDraggingChanged);
  }, [shape.id, updateShapeTransform, commitTransform]);

  if (!isSelected) {
    return <BagMesh shape={shape} onClick={() => selectShape(shape.id)} />;
  }

  return (
    <TransformControls
      ref={transformRef}
      mode={transformMode}
      translationSnap={snapEnabled ? snapValue : null}
      rotationSnap={snapEnabled ? Math.PI / 12 : null}
      scaleSnap={snapEnabled ? 0.1 : null}
      size={0.7}
    >
      <BagMesh shape={shape} onClick={() => {}} isSelected />
    </TransformControls>
  );
}

export default function SceneContent() {
  const { shapes, showGrid, showAxes } = useEditorStore();

  return (
    <>
      {showGrid && (
        <Grid
          args={[40, 40]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#333340"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#444458"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {showAxes && <axesHelper args={[6]} />}

      {shapes.map((shape) => (
        <TransformableShape key={shape.id} shape={shape} />
      ))}
    </>
  );
}
