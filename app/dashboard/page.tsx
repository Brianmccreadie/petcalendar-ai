import Link from 'next/link'

const statusConfig: Record<string, { label: string; emoji: string; color: string }> = {
  draft: { label: 'Draft', emoji: '📝', color: 'bg-gray-100 text-gray-600' },
  uploading: { label: 'Uploading', emoji: '📤', color: 'bg-[#FFF8E8] text-[#FFD166]' },
  generating: { label: 'Creating...', emoji: '✨', color: 'bg-[#E8F0FA] text-[#FF6B35]' },
  preview: { label: 'Ready to Order', emoji: '✅', color: 'bg-[#E8FFF7] text-[#06D6A0]' },
  ordered: { label: 'Ordered', emoji: '📦', color: 'bg-blue-50 text-blue-600' },
  shipped: { label: 'On Its Way!', emoji: '🚚', color: 'bg-[#E8FFF7] text-[#06D6A0]' },
}

const resumableStatuses = ['uploading', 'generating', 'preview']

// Demo data — in production this comes from Supabase
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
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="heading-playful text-3xl sm:text-4xl font-extrabold text-[#2D1B69]">
            My Calendars 📚
          </h1>
          <Link
            href="/create"
            className="inline-flex items-center rounded-full bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white hover:bg-[#E55A2B] transition-all duration-300 shadow-md shadow-[#89CFF0]/20 hover:-translate-y-0.5"
          >
            Create New Calendar 🎨
          </Link>
        </div>

        {/* Project cards */}
        {demoProjects.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border-2 border-dashed border-[#89CFF0]/30">
            <span className="text-7xl block mb-4">🐾</span>
            <h2 className="text-2xl font-extrabold text-[#2D1B69] mb-2">
              No calendars yet!
            </h2>
            <p className="text-[#2D1B69]/50 mb-6 text-lg">
              Your pet deserves to be a calendar star ⭐
            </p>
            <Link
              href="/create"
              className="btn-primary"
            >
              Create Your First Calendar →
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
                  className="group rounded-3xl bg-white border-2 border-[#89CFF0]/20 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Preview thumbnail */}
                  <Link href={href}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#FFF0E8] via-[#FFF8E8] to-[#E8FFF7] flex items-center justify-center relative">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {petEmojis[project.pet_type] ?? '🐾'}
                      </span>
                      {/* Decorative paw */}
                      <span className="absolute bottom-3 right-3 text-3xl opacity-10">🐾</span>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-extrabold text-[#2D1B69] text-lg flex items-center gap-1.5">
                        {petEmojis[project.pet_type] ?? '🐾'} {project.pet_name}
                      </h3>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}
                      >
                        {status.emoji} {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#2D1B69]/50 font-medium">{project.style}</p>
                    <p className="text-xs text-[#2D1B69]/30 mt-2">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Continue button for resumable projects */}
                    {canResume && (
                      <Link
                        href={href}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-5 py-2 text-sm font-bold text-white hover:bg-[#E55A2B] transition-all duration-300 shadow-sm"
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
