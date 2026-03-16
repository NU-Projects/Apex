import Navbar from '../components/Navbar'

function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in relative overflow-hidden">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Job Matches</h1>
          <p className="text-text-secondary text-lg">Explore career opportunities tailored exactly to your skills.</p>
          
          <div className="mt-12 flex flex-col items-center justify-center text-center p-10 bg-surface rounded-xl border border-dashed border-border-default">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Coming Soon</h3>
            <p className="text-text-muted max-w-sm">We are preparing data and curating the most precise matching jobs for your profile.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default JobsPage
