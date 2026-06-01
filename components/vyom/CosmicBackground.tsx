export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="cosmic-void absolute inset-0" />
      <div className="cosmic-grid absolute inset-0" />
      <div className="cosmic-drift absolute inset-x-[-12%] top-[-18%] h-[72vh]" />
      <div className="cosmic-drift-secondary absolute bottom-[-22%] left-[-10%] h-[58vh] w-[70vw]" />
      <div className="particle-field absolute inset-0" />
      <div className="particle-field particle-field-near absolute inset-0" />
      {/* Faint radial glow behind hero capsule area */}
      <div className="cosmic-hero-glow absolute inset-0" />
      <div className="cosmic-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,4,10,0.18)_42%,rgba(2,4,10,0.86)_100%)]" />
    </div>
  );
}
