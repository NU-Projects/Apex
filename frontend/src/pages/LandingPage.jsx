import LandingNav from '../components/landing/LandingNav'
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
    <div className="relative min-h-screen bg-white">
      <LandingNav />

      {/* Background is simple white */}

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
