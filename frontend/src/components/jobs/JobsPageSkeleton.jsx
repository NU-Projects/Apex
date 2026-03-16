import Navbar from '../Navbar'

function JobsPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <section className="relative overflow-hidden rounded-3xl border border-border-light bg-white p-8 shadow-sm">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent-cyan/20 blur-3xl" />

          <div className="relative flex flex-col items-center justify-center py-24 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
            <p className="mt-6 text-lg font-semibold text-text-primary">Loading job roles...</p>
            <p className="mt-1 text-sm text-text-muted">Preparing smart job matches for you</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default JobsPageSkeleton
