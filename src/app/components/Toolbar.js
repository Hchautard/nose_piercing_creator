'use client';

import { useEditorStore } from '@/app/store/editorStore';
import styles from '@/app/styles/editor.module.css';

const PRESETS = [
  { key: 'cube', label: 'Cube', icon: '▣' },
  { key: 'tallBag', label: 'Sac haut', icon: '▯' },
  { key: 'wideBag', label: 'Sac large', icon: '▭' },
  { key: 'flatBag', label: 'Sac plat', icon: '▬' },
  { key: 'shoebox', label: 'Boîte', icon: '⊟' },
];

const TRANSFORM_MODES = [
  { key: 'translate', label: 'Déplacer', shortcut: 'G', icon: '✥' },
  { key: 'rotate', label: 'Tourner', shortcut: 'R', icon: '↻' },
  { key: 'scale', label: 'Échelle', shortcut: 'S', icon: '⤡' },
];

export default function Toolbar() {
  const {
    addShape,
    transformMode,
    setTransformMode,
    snapEnabled,
    toggleSnap,
    showGrid,
    toggleGrid,
    showAxes,
    toggleAxes,
    undo,
    redo,
    historyIndex,
    history,
    exportScene,
    shapes,
  } = useEditorStore();

  return (
    <div className={styles.toolbar}>
      {/* Left section — Add shapes */}
      <div className={styles.toolbarSection}>
        <span className={styles.toolbarLabel}>Ajouter</span>
        <div className={styles.toolbarGroup}>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              className={styles.toolBtn}
              onClick={() => addShape(p.key)}
              title={p.label}
            >
              <span className={styles.toolIcon}>{p.icon}</span>
              <span className={styles.toolText}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Center — Transform mode */}
      <div className={styles.toolbarSection}>
        <span className={styles.toolbarLabel}>Transformer</span>
        <div className={styles.toolbarGroup}>
          {TRANSFORM_MODES.map((m) => (
            <button
              key={m.key}
              className={`${styles.toolBtn} ${transformMode === m.key ? styles.toolBtnActive : ''}`}
              onClick={() => setTransformMode(m.key)}
              title={`${m.label} (${m.shortcut})`}
            >
              <span className={styles.toolIcon}>{m.icon}</span>
              <span className={styles.toolText}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.toolbarDivider} />

      {/* View options */}
      <div className={styles.toolbarSection}>
        <div className={styles.toolbarGroup}>
          <button
            className={`${styles.toolBtn} ${snapEnabled ? styles.toolBtnActive : ''}`}
            onClick={toggleSnap}
            title="Snap to grid"
          >
            <span className={styles.toolIcon}>⊞</span>
            <span className={styles.toolText}>Snap</span>
          </button>
          <button
            className={`${styles.toolBtn} ${showGrid ? styles.toolBtnActive : ''}`}
            onClick={toggleGrid}
            title="Toggle grid"
          >
            <span className={styles.toolIcon}>⊡</span>
            <span className={styles.toolText}>Grille</span>
          </button>
          <button
            className={`${styles.toolBtn} ${showAxes ? styles.toolBtnActive : ''}`}
            onClick={toggleAxes}
            title="Toggle axes"
          >
            <span className={styles.toolIcon}>⁘</span>
            <span className={styles.toolText}>Axes</span>
          </button>
        </div>
      </div>

      <div className={styles.toolbarSpacer} />

      {/* Right — Undo/Redo/Export */}
      <div className={styles.toolbarSection}>
        <div className={styles.toolbarGroup}>
          <button
            className={styles.toolBtn}
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Annuler (Ctrl+Z)"
          >
            <span className={styles.toolIcon}>↩</span>
          </button>
          <button
            className={styles.toolBtn}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Refaire (Ctrl+Shift+Z)"
          >
            <span className={styles.toolIcon}>↪</span>
          </button>
          <button
            className={`${styles.toolBtn} ${styles.toolBtnExport}`}
            onClick={exportScene}
            disabled={shapes.length === 0}
            title="Exporter JSON"
          >
            <span className={styles.toolIcon}>⤓</span>
            <span className={styles.toolText}>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
