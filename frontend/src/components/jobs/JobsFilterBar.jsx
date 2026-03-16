function JobsFilterBar({ roles, selectedRole, onRoleChange, onFilterJobs, jobsLoading }) {
  return (
    <section className="rounded-2xl border border-border-light bg-white p-5 md:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="w-full lg:max-w-lg">
          <label htmlFor="role-select" className="mb-2 block text-sm font-semibold text-text-primary">
            Job role
          </label>

          <div className="relative">
            <select
              id="role-select"
              value={selectedRole}
              onChange={(event) => onRoleChange(event.target.value)}
              className="w-full appearance-none rounded-xl border border-border-default bg-surface px-4 py-3 pr-10 text-base font-medium text-text-primary transition-all hover:border-brand-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Choose a role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onFilterJobs}
          disabled={!selectedRole || jobsLoading}
          className="inline-flex h-[50px] min-w-40 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-200"
        >
          {jobsLoading ? 'Filtering jobs...' : 'Filter Jobs'}
        </button>
      </div>
    </section>
  )
}

export default JobsFilterBar
