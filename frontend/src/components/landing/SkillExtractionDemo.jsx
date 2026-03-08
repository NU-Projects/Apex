const linkedInSkills = [
  "JavaScript",
  "React.js",
  "Project Management",
]

const githubSkills = [
  "TypeScript",
  "Docker",
  "CI/CD Pipelines",
]

const combinedSkills = [
  "JavaScript",
  "React.js",
  "Project Management",
  "TypeScript",
  "Docker",
  "CI/CD Pipelines",
]

function SkillExtractionDemo() {
  return (
    <section className="bg-white py-32 px-6 border-b border-border-light overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side: Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            Skill Extraction
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-text-primary tracking-tight leading-[1.1] mb-6">
            We read your profile so you don’t have to.
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-12">
            Connect LinkedIn and GitHub. Apex AI automatically extracts, categorizes, and scores your skills—no manual entry required.
          </p>
          
          {/* Logos */}
          <div className="flex items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* LinkedIn Mock Text Logo */}
            <span className="text-2xl font-bold font-sans tracking-tight text-[#0077b5]">Linked<span className="bg-[#0077b5] text-white px-1 ml-0.5 rounded-sm">in</span></span>
            {/* GitHub Mock Text Logo */}
            <span className="flex items-center gap-1.5 text-xl font-bold text-gray-900">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </span>
            {/* Indeed Mock Text Logo */}
            <span className="text-2xl font-bold font-sans tracking-tight text-[#003A9B]">indeed</span>
          </div>
        </div>

        {/* Right Side: Skill Boxes Flow */}
        <div className="w-full lg:w-1/2 flex flex-col items-start relative max-w-[450px]">
          
          {/* Top Row: LinkedIn & GitHub side-by-side */}
          <div className="flex flex-row w-full gap-4 mb-4 z-10">
            {/* LinkedIn Box (Blue Theme) */}
            <div className="flex-1 rounded-2xl border border-[#0077b5]/20 bg-[#f3f9fd] p-4 shadow-sm h-full flex flex-col transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4 border-b border-[#0077b5]/10 pb-2">
                <div className="w-6 h-6 rounded bg-[#0077b5] flex items-center justify-center text-white shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <span className="text-xs font-bold text-[#0077b5] uppercase tracking-wider">LinkedIn</span>
              </div>
              <div className="flex flex-col gap-2">
                {linkedInSkills.map((skill, i) => (
                  <div key={i} className="px-3 py-2 bg-white rounded border border-[#0077b5]/10 text-xs font-semibold text-text-secondary shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Box (Black Theme) */}
            <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm h-full flex flex-col transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </div>
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">GitHub</span>
              </div>
              <div className="flex flex-col gap-2">
                {githubSkills.map((skill, i) => (
                  <div key={i} className="px-3 py-2 bg-white rounded border border-gray-200 text-xs font-semibold text-text-secondary shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merge Arrows */}
          <div className="w-full flex justify-center py-2 relative z-0">
             <div className="w-0.5 h-8 bg-border-light relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-border-default">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
               </div>
             </div>
          </div>

          {/* Bottom Row: Unified Skills Box */}
          <div className="w-full rounded-2xl border-2 border-brand-100 bg-brand-50/50 p-6 shadow-md mt-2 z-10 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">Unified Skills Map</span>
            </div>
            
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {combinedSkills.map((skill, i) => (
                <div key={i} className="w-full px-3 py-2 bg-white border border-brand-200 rounded lg shadow-sm text-xs font-bold text-brand-900 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 shrink-0"></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default SkillExtractionDemo
