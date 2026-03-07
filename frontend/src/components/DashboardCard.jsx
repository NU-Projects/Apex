function DashboardCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-xl border border-border-light p-6 hover:border-brand-200 transition-colors duration-150">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-600 mb-4">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>

      {/* Action link */}
      <div className="mt-4 flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors cursor-pointer">
        <span>Explore</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

export default DashboardCard
