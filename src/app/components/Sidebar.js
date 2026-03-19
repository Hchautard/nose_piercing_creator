'use client';

import { useEditorStore, MOTIFS, PRESET_COLORS } from '@/app/store/editorStore';
import styles from '@/app/styles/editor.module.css';

function Section({ title, children, icon }) {
  return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {icon && <span className={styles.sectionIcon}>{icon}</span>}
          {title}
        </h3>
        <div className={styles.sectionBody}>{children}</div>
      </div>
  );
}

function SliderRow({ label, value, onChange, min, max, step = 0.01, unit = '' }) {
  return (
      <div className={styles.row}>
        <label className={styles.label}>{label}</label>
        <div className={styles.sliderWrap}>
          <input
              type="range"
              className={styles.slider}
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              min={min}
              max={max}
              step={step}
          />
          <span className={styles.sliderVal}>
          {value.toFixed(2)}{unit}
        </span>
        </div>
      </div>
  );
}

export default function Sidebar() {
  const {
    bag, handles, material,
    selectedMotif, motifScale, motifDepth,
    showGrid, autoRotate,
    updateBag, updateHandles, updateMaterial,
    setMotif, setMotifScale, setMotifDepth,
    toggleGrid, toggleAutoRotate,
    exportScene,
    motifs,
  } = useEditorStore();

  return (
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarLogo}>
            <span className={styles.logoIcon}>◈</span>
            Bag Editor
          </h2>
        </div>

        <div className={styles.sidebarScroll}>
          {/* ── Bag dimensions ── */}
          <Section title="Corps du sac" icon="▭">
            <SliderRow label="Largeur" value={bag.width} onChange={(v) => updateBag({ width: v })} min={1} max={6} step={0.05} />
            <SliderRow label="Hauteur" value={bag.height} onChange={(v) => updateBag({ height: v })} min={1} max={6} step={0.05} />
            <SliderRow label="Épaisseur" value={bag.depth} onChange={(v) => updateBag({ depth: v })} min={0.1} max={1.5} step={0.02} />
            <SliderRow label="Puffiness" value={bag.puffiness} onChange={(v) => updateBag({ puffiness: v })} min={0} max={0.5} step={0.01} />
          </Section>

          {/* ── Handles ── */}
          <Section title="Anses" icon="⌒">
            <div className={styles.row}>
              <label className={styles.label}>Visible</label>
              <button
                  className={`${styles.toggleBtn} ${handles.visible ? styles.toggleActive : ''}`}
                  onClick={() => updateHandles({ visible: !handles.visible })}
              >
                {handles.visible ? 'Oui' : 'Non'}
              </button>
            </div>
            {handles.visible && (
                <>
                  <SliderRow label="Hauteur" value={handles.height} onChange={(v) => updateHandles({ height: v })} min={0.5} max={5} step={0.05} />
                  <SliderRow label="Épaisseur" value={handles.width} onChange={(v) => updateHandles({ width: v })} min={0.1} max={0.6} step={0.02} />
                  <SliderRow label="Écartement" value={handles.gap} onChange={(v) => updateHandles({ gap: v })} min={0.3} max={3} step={0.05} />
                </>
            )}
          </Section>

          {/* ── Material ── */}
          <Section title="Matériau" icon="◉">
            <div className={styles.row}>
              <label className={styles.label}>Couleur</label>
              <div className={styles.colors}>
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        className={`${styles.swatch} ${material.color === c ? styles.swatchActive : ''}`}
                        style={{ background: c }}
                        onClick={() => updateMaterial({ color: c })}
                    />
                ))}
                <label className={styles.customColor}>
                  <input
                      type="color"
                      value={material.color}
                      onChange={(e) => updateMaterial({ color: e.target.value })}
                      className={styles.colorInput}
                  />
                  <span className={styles.customColorIcon}>⊕</span>
                </label>
              </div>
            </div>
            <SliderRow label="Rugosité" value={material.roughness} onChange={(v) => updateMaterial({ roughness: v })} min={0} max={1} />
            <SliderRow label="Métal" value={material.metalness} onChange={(v) => updateMaterial({ metalness: v })} min={0} max={1} />
          </Section>

          {/* ── Motif ── */}
          <Section title="Motif" icon="✦">
            <div className={styles.motifGrid}>
              {motifs.map((m) => (
                  <button
                      key={m.id}
                      className={`${styles.motifBtn} ${selectedMotif === m.id ? styles.motifBtnActive : ''}`}
                      onClick={() => setMotif(m.id)}
                      title={m.name}
                  >
                    <span className={styles.motifIcon}>{m.icon}</span>
                    <span className={styles.motifName}>{m.name}</span>
                  </button>
              ))}
            </div>
            {selectedMotif !== 'none' && (
                <>
                  <SliderRow label="Taille" value={motifScale} onChange={setMotifScale} min={0.2} max={1.5} step={0.02} />
                  <SliderRow label="Relief" value={motifDepth} onChange={setMotifDepth} min={0.005} max={0.15} step={0.005} />
                </>
            )}
          </Section>

          {/* ── View ── */}
          <Section title="Affichage" icon="◫">
            <div className={styles.viewBtns}>
              <button
                  className={`${styles.viewBtn} ${showGrid ? styles.viewBtnActive : ''}`}
                  onClick={toggleGrid}
              >
                ⊡ Grille
              </button>
              <button
                  className={`${styles.viewBtn} ${autoRotate ? styles.viewBtnActive : ''}`}
                  onClick={toggleAutoRotate}
              >
                ↻ Rotation
              </button>
            </div>
          </Section>
        </div>

        {/* ── Export ── */}
        <div className={styles.sidebarFooter}>
          <button className={styles.exportBtn} onClick={exportScene}>
            ⤓ Exporter la configuration
          </button>
        </div>
      </div>
  );
}