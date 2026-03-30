import Link from 'next/link'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  uploading: 'bg-yellow-100 text-yellow-700',
  generating: 'bg-blue-100 text-blue-700',
  preview: 'bg-purple-100 text-purple-700',
  ordered: 'bg-green-100 text-green-700',
  shipped: 'bg-emerald-100 text-emerald-700',
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  uploading: 'Uploading',
  generating: 'Generating',
  preview: 'Ready',
  ordered: 'Ordered',
  shipped: 'Shipped',
}

// Demo data — in production this comes from Supabase
const demoProjects = [
  {
    id: '1',
    name: 'My Pet Calendar',
    pet_name: 'Buddy',
    style: 'Watercolor',
    status: 'preview',
    created_at: '2026-03-28T12:00:00Z',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Calendars
          </h1>
          <Link
            href="/create"
            className="inline-flex items-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors shadow-sm"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create New Calendar
          </Link>
        </div>

        {/* Project cards */}
        {demoProjects.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-gray-50 border border-gray-100">
            <span className="text-6xl block mb-4">🐾</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No calendars yet!
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first one 🐾
            </p>
            <Link
              href="/create"
              className="inline-flex items-center rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProjects.map((project) => (
              <Link
                key={project.id}
                href="/create"
                className="group rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Preview thumbnail */}
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🐾</span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">
                      {project.pet_name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusColors[project.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {statusLabels[project.status] ?? project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{project.style}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
