import Link from 'next/link'

const statusConfig: Record<string, { label: string; emoji: string; color: string }> = {
  draft: { label: 'Draft', emoji: '📝', color: 'bg-gray-100 text-gray-600' },
  uploading: { label: 'Uploading', emoji: '📤', color: 'bg-[var(--yellow)]/20 text-[var(--ebony)]' },
  generating: { label: 'Creating...', emoji: '✨', color: 'bg-[var(--purple)]/10 text-[var(--purple)]' },
  preview: { label: 'Ready to Order', emoji: '✅', color: 'bg-[var(--green)]/15 text-[var(--green)]' },
  ordered: { label: 'Ordered', emoji: '📦', color: 'bg-blue-50 text-blue-600' },
  shipped: { label: 'On Its Way!', emoji: '🚚', color: 'bg-[var(--green)]/15 text-[var(--green)]' },
}

const resumableStatuses = ['uploading', 'generating', 'preview']

const demoProjects = [
  {
    id: '1',
    name: 'My Pet Calendar',
    pet_name: 'Buddy',
    pet_type: 'dog',
    style: 'Mythical Quest',
    status: 'preview',
    created_at: '2026-03-28T12:00:00Z',
  },
]

const petEmojis: Record<string, string> = {
  dog: '🐕',
  cat: '🐱',
  other: '🐾',
}

function getResumeHref(project: { id: string; status: string }): string {
  switch (project.status) {
    case 'uploading':
      return `/create?project=${project.id}`
    case 'generating':
    case 'preview':
      return `/create/preview?project=${project.id}`
    default:
      return `/create?project=${project.id}`
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--alabaster)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--ebony)] capitalize">
            My Calendars 📚
          </h1>
          <Link href="/create" className="btn-primary">
            <span className="btn-text">Create New</span>
            <span className="btn-arrow">→</span>
            <span className="btn-circle"></span>
          </Link>
        </div>

        {demoProjects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white border-2 border-dashed border-[var(--purple)]/15">
            <span className="text-7xl block mb-4">🐾</span>
            <h2 className="text-2xl font-bold text-[var(--ebony)] mb-2 capitalize">
              No calendars yet!
            </h2>
            <p className="text-[var(--wenge)] mb-6 text-lg font-medium">
              Your pet deserves to be a calendar star ⭐
            </p>
            <Link href="/create" className="btn-primary">
              <span className="btn-text">Create Your First Calendar</span>
              <span className="btn-arrow">→</span>
              <span className="btn-circle"></span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProjects.map((project) => {
              const status = statusConfig[project.status] ?? statusConfig.draft
              const canResume = resumableStatuses.includes(project.status)
              const href = canResume ? getResumeHref(project) : `/create?project=${project.id}`

              return (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-white border-2 border-[var(--purple)]/10 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <Link href={href}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-[var(--purple)]/5 via-[var(--green)]/5 to-[var(--yellow)]/10 flex items-center justify-center relative">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {petEmojis[project.pet_type] ?? '🐾'}
                      </span>
                      <span className="absolute bottom-3 right-3 text-3xl opacity-10">🐾</span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[var(--ebony)] text-lg flex items-center gap-1.5">
                        {petEmojis[project.pet_type] ?? '🐾'} {project.pet_name}
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>
                        {status.emoji} {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--wenge)] font-medium">{project.style}</p>
                    <p className="text-xs text-[var(--wenge)]/50 mt-2">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    {canResume && (
                      <Link
                        href={href}
                        className="mt-4 inline-flex items-center gap-2 btn-purple text-sm px-5 py-2"
                      >
                        Continue →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
