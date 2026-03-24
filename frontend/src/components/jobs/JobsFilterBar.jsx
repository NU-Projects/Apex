function JobsFilterBar({ roles, selectedRole, onRoleChange, onFilterJobs, jobsLoading, jobCount, hasSearched }) {
  return (
    <section className="rounded-3xl border border-border-light bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1 lg:max-w-md">
          <label htmlFor="role-select" className="mb-2 block text-[10px] font-black uppercase tracking-widest text-text-muted">
            Target Role Execution
          </label>

          <div className="relative">
            <select
              id="role-select"
              value={selectedRole}
              onChange={(event) => onRoleChange(event.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-border-light bg-surface px-4 py-2 text-sm font-black text-text-primary outline-none transition-all hover:border-brand-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            >
              <option value="">Choose a role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onFilterJobs}
          disabled={!selectedRole || jobsLoading}
          className="inline-flex h-[42px] min-w-36 items-center justify-center rounded-xl bg-brand-600 px-6 text-xs font-black uppercase tracking-widest text-white outline-none transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/20 active:scale-95 disabled:cursor-not-allowed disabled:bg-brand-200 disabled:shadow-none"
        >
          {jobsLoading ? 'Searching...' : 'Find Jobs'}
        </button>

        <div className="flex-1 flex justify-end items-center">
          {hasSearched && !jobsLoading ? (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Market Availability</span>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20">
                <span className="text-sm font-black">{jobCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Openings</span>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-end opacity-20 select-none">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Market Availability</span>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-border-default text-text-muted rounded-xl">
                <span className="text-sm font-black">--</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Openings</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default JobsFilterBar
