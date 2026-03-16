import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { fetchDistinctRoles } from '../services/jobService'

function JobsPage() {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true)
      const data = await fetchDistinctRoles()
      setRoles(data)
      setLoading(false)
    }
    loadRoles()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
          <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
              <p className="text-text-secondary text-lg font-medium">Loading job roles…</p>
              <p className="text-text-muted text-sm mt-1">Fetching available positions for you</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in relative overflow-hidden">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Job Matches</h1>
          <p className="text-text-secondary text-lg">Explore career opportunities tailored exactly to your skills.</p>

          {/* Role Selector */}
          <div className="mt-8">
            <label htmlFor="role-select" className="block text-sm font-semibold text-text-primary mb-2">
              Select a Job Role
            </label>
            <div className="relative w-full max-w-md">
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full appearance-none bg-surface border border-border-default rounded-xl px-4 py-3 pr-10 text-text-primary text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all cursor-pointer hover:border-brand-400"
              >
                <option value="">— Choose a role —</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {/* Chevron icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content area */}
          {selectedRole ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center p-10 bg-surface rounded-xl border border-dashed border-border-default">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {selectedRole}
              </h3>
              <p className="text-text-muted max-w-sm">
                Preparing job matches for <span className="font-medium text-brand-600">{selectedRole}</span>. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center text-center p-10 bg-surface rounded-xl border border-dashed border-border-default">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Select a Role</h3>
              <p className="text-text-muted max-w-sm">Choose a job role from the dropdown above to explore matching career opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobsPage
