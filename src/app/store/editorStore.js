import { create } from 'zustand';

const MOTIFS = [
  { id: 'none', name: 'Aucun', icon: '○' },
  { id: 'heart-star', name: 'Cœur étoilé', icon: '✦' },
  { id: 'star', name: 'Étoile', icon: '★' },
  { id: 'heart', name: 'Cœur', icon: '♥' },
  { id: 'diamond', name: 'Losange', icon: '◆' },
  { id: 'circle', name: 'Cercle', icon: '●' },
  { id: 'cross', name: 'Croix', icon: '✚' },
];

const PRESET_COLORS = [
  '#e8175d', '#ff4488', '#cc2255', '#ff6b9d',
  '#222222', '#f5f0e8', '#4466cc', '#44aa77',
  '#cc8833', '#8855bb', '#dd4444', '#6699cc',
];

export { MOTIFS, PRESET_COLORS };

export const useEditorStore = create((set, get) => ({
  bag: {
    width: 3.2,
    height: 3.6,
    depth: 0.35,
    puffiness: 0.15,
  },
  handles: {
    width: 0.28,
    height: 2.6,
    gap: 1.2,
    visible: true,
  },
  material: {
    color: '#e8175d',
    roughness: 0.65,
    metalness: 0.0,
  },
  selectedMotif: 'heart-star',
  motifScale: 0.65,
  motifDepth: 0.04,
  showGrid: true,
  autoRotate: false,

  // --- Actions ---
  updateBag: (u) => set((s) => ({ bag: { ...s.bag, ...u } })),
  updateHandles: (u) => set((s) => ({ handles: { ...s.handles, ...u } })),
  updateMaterial: (u) => set((s) => ({ material: { ...s.material, ...u } })),
  setMotif: (id) => set({ selectedMotif: id }),
  setMotifScale: (v) => set({ motifScale: v }),
  setMotifDepth: (v) => set({ motifDepth: v }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),

  exportScene: () => {
    const { bag, handles, material, selectedMotif, motifScale, motifDepth } = get();
    const data = JSON.stringify({ bag, handles, material, selectedMotif, motifScale, motifDepth }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tote-bag-config.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  motifs: MOTIFS,
}));