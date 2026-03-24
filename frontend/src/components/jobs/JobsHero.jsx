function JobsHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-light bg-white p-8 md:p-10 shadow-sm">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-100/70 blur-3xl" />
      <div className="absolute left-1/3 top-0 h-40 w-40 rounded-full bg-accent-cyan/20 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">Job Match Studio</h1>
          <p className="mt-2 max-w-2xl text-text-secondary text-base md:text-lg">
            Select a role, filter live listings, then run compatibility checks to see where you stand.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-brand-700 font-semibold">Workflow</p>
          <p className="mt-1 text-sm text-text-secondary">Pick role | Filter jobs | Check score | Apply</p>
        </div>
      </div>
    </section>
  )
}

export default JobsHero
