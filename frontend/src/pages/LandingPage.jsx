import HeroSection from '../components/landing/HeroSection'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import SkillExtractionDemo from '../components/landing/SkillExtractionDemo'
import SkillGapAnalysis from '../components/landing/SkillGapAnalysis'
import HowItWorksRoadmap from '../components/landing/HowItWorksRoadmap'
import QuizDemo from '../components/landing/QuizDemo'
import JobBoard from '../components/landing/JobBoard'
import MarketDemand from '../components/landing/MarketDemand'
import Footer from '../components/landing/Footer'

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-surface">
      
      {/* Live AI-Style Animated Background */}
      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden mix-blend-multiply opacity-80" aria-hidden="true">
        
        {/* Animated Particle Texture / Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgwLCAwLCAxMDAsIDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-[0.15] mix-blend-color-burn"></div>

        {/* Dynamic Floating Blobs */}
        <div 
          className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-brand-400/25 blur-[120px] animate-blob" 
          style={{ animationDuration: '24s' }}
        ></div>
        
        <div 
          className="absolute top-[20%] -right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-accent-cyan/20 blur-[130px] animate-blob" 
          style={{ animationDuration: '28s', animationDelay: '4s' }}
        ></div>

        <div 
          className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-accent-purple/20 blur-[140px] animate-blob" 
          style={{ animationDuration: '32s', animationDelay: '8s' }}
        ></div>
      </div>

      <main className="relative z-10">
        <HeroSection />
        <FeaturesGrid />
        <SkillExtractionDemo />
        <SkillGapAnalysis />
        <HowItWorksRoadmap />
        <QuizDemo />
        <JobBoard />
        <MarketDemand />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
