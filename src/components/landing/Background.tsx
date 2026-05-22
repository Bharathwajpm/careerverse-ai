export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -top-40 -left-40 size-[600px] rounded-full bg-neon-purple/20 blur-[140px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-40 size-[500px] rounded-full bg-neon-blue/20 blur-[140px] animate-pulse-glow [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-neon-cyan/10 blur-[160px] animate-pulse-glow [animation-delay:4s]" />
    </div>
  );
}
