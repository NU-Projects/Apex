import Navbar from '../components/Navbar'

function RoadmapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in relative overflow-hidden">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Learning Roadmap</h1>
          <p className="text-text-secondary text-lg">Your personalized path to mastering new skills and filling knowledge gaps.</p>
          
          <div className="mt-12 flex flex-col items-center justify-center text-center p-10 bg-surface rounded-xl border border-dashed border-border-default">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Coming Soon</h3>
            <p className="text-text-muted max-w-sm">We are generating advanced personalized guides to boost your career. Check back later!</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RoadmapPage
