import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import JobsHero from '../components/jobs/JobsHero'
import JobsFilterBar from '../components/jobs/JobsFilterBar'
import JobsResultsPanel from '../components/jobs/JobsResultsPanel'
import JobsPageSkeleton from '../components/jobs/JobsPageSkeleton'
import { fetchDistinctRoles, fetchJobsByRole, getCompatibilityScore } from '../services/jobService'
import { useSkills } from '../hooks/useSkills'

function JobsPage() {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobsError, setJobsError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [compatibilityState, setCompatibilityState] = useState({})
  const { skills } = useSkills()

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true)
      const data = await fetchDistinctRoles()
      setRoles(data)
      setLoading(false)
    }

    loadRoles()
  }, [])

  const handleFilterJobs = async () => {
    if (!selectedRole) return

    setHasSearched(true)
    setJobsLoading(true)
    setJobsError('')
    setCompatibilityState({})

    const data = await fetchJobsByRole(selectedRole)
    setJobs(data)
    setJobsLoading(false)

    if (!data.length) {
      setJobsError('No jobs found for this role yet.')
    }
  }

  const handleCompatibilityCheck = async (job) => {
    const jobId = job.id
    if (!jobId) return

    setCompatibilityState((prev) => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || {}),
        loading: true,
        error: '',
      },
    }))

    try {
      const result = await getCompatibilityScore({
        skills,
        jobTitle: job.title,
        jobDescription: job.description,
      })

      setCompatibilityState((prev) => ({
        ...prev,
        [jobId]: {
          loading: false,
          error: '',
          score: result.compatibility_score,
          gap: result.gap_analysis,
        },
      }))
    } catch {
      setCompatibilityState((prev) => ({
        ...prev,
        [jobId]: {
          ...(prev[jobId] || {}),
          loading: false,
          error: 'Compatibility check failed. Please try again.',
        },
      }))
    }
  }

  const normalizedJobs = useMemo(
    () =>
      jobs.map((job, index) => ({
        id: job.id || `${job.title || 'job'}-${index}`,
        title: job.title || 'Untitled job',
        platform: (job.platform || '').toLowerCase(),
        description: job.description || '',
        applyUrl: job.apply_url || job.url || '',
      })),
    [jobs],
  )

  if (loading) {
    return <JobsPageSkeleton />
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 space-y-6">
        <JobsHero />

        <JobsFilterBar
          roles={roles}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          onFilterJobs={handleFilterJobs}
          jobsLoading={jobsLoading}
        />

        <JobsResultsPanel
          hasSearched={hasSearched}
          jobsLoading={jobsLoading}
          jobsError={jobsError}
          jobs={normalizedJobs}
          compatibilityState={compatibilityState}
          onCheckCompatibility={handleCompatibilityCheck}
        />
      </main>
    </div>
  )
}

export default JobsPage
