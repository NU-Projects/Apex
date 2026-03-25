function RoadmapProgressBar({ value }) {
  const segments = 12;
  const activeSegments = Math.round((value / 100) * segments);

  return (
    <section className="mt-5 rounded-3xl border border-border-light bg-white/95 backdrop-blur-sm p-5 md:p-6 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Overall Progress</p>
        <p className="text-base font-bold text-text-primary">{value}%</p>
      </div>

      <div className="h-3.5 w-full bg-surface rounded-full overflow-hidden ring-1 ring-brand-100">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-accent-cyan transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-1.5">
        {Array.from({ length: segments }).map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-colors ${idx < activeSegments ? 'bg-brand-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default RoadmapProgressBar;
