const demandData = [
  { skill: 'AI', demand: 98, color: 'bg-brand-600' },
  { skill: 'Data Science', demand: 92, color: 'bg-accent-purple' },
  { skill: 'Cloud', demand: 88, color: 'bg-accent-cyan' },
  { skill: 'Cybersecurity', demand: 85, color: 'bg-accent-emerald' },
  { skill: 'Web Development', demand: 80, color: 'bg-accent-amber' },
]

function MarketDemand() {
  return (
    <section id="market" className="py-24 px-6 bg-surface border-t border-border-light">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-16">
        {/* Left side: Text & Stats */}
        <div className="flex-1 w-full lg:sticky lg:top-24">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Market Demand</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Stay ahead of market trends.
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Apex tracks which skills are most in-demand across thousands of job postings so you can focus your learning on what matters most.
          </p>

          <div className="mt-8 flex gap-4">
            <div className="rounded-xl border border-border-light bg-white p-5 flex-1 shadow-sm">
              <span className="block text-2xl font-bold text-text-primary mb-1">50k+</span>
              <span className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Job postings analyzed</span>
            </div>
            <div className="rounded-xl border border-border-light bg-white p-5 flex-1 shadow-sm border-b-4 border-b-accent-emerald">
              <span className="block text-2xl font-bold text-accent-emerald mb-1">+15%</span>
              <span className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Annual growth</span>
            </div>
          </div>
        </div>

        {/* Right side: Top Skills Histogram */}
        <div className="flex-1 w-full rounded-3xl border border-border-light bg-white p-6 sm:p-8 shadow-xl shadow-brand-500/5 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-1">Top Skills by Demand</h3>
              <p className="text-xs font-semibold text-text-secondary">Relative market growth (2024 Q4)</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-accent-emerald bg-accent-emerald/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
              Live Trends
            </span>
          </div>

          {/* Histogram Container */}
          <div className="relative w-full h-64 mt-12 flex items-end justify-between gap-1 sm:gap-2">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none z-0">
              <div className="w-full h-px bg-border-light/60 border-dashed border-t"></div>
              <div className="w-full h-px bg-border-light/60 border-dashed border-t"></div>
              <div className="w-full h-px bg-border-light/60 border-dashed border-t"></div>
              <div className="w-full h-px bg-border-light/60 border-dashed border-t"></div>
              <div className="w-full h-px bg-border-default"></div>
            </div>

            {demandData.map((d) => (
              <div key={d.skill} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                {/* Tooltip on hover */}
                <div className="absolute top-0 -translate-y-full mb-1 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 scale-95 origin-bottom group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-20">
                  {d.demand}% Demand
                  {/* Tooltip Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
                
                {/* Bar */}
                <div 
                  className={`w-full max-w-[64px] rounded-t-lg ${d.color} transition-all duration-300 relative overflow-hidden shadow-md z-10`}
                  style={{ height: `${d.demand}%` }}
                >
                </div>
                
                {/* X-axis Label */}
                <div className="absolute -bottom-8 h-8 flex items-center justify-center text-center w-[120%] -ml-[10%]">
                  <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary group-hover:text-brand-600 transition-colors line-clamp-1 truncate">
                    {d.skill.split(' /')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketDemand
