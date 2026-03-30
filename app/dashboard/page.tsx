import Link from 'next/link'

const statusColors: Record<string, string> = {
  uploading: 'bg-yellow-100 text-yellow-700',
  generating: 'bg-blue-100 text-blue-700',
  preview: 'bg-purple-100 text-purple-700',
  ordered: 'bg-green-100 text-green-700',
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
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Calendars
            </h1>
            <p className="mt-2 text-gray-500">
              Manage your calendar projects and orders.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
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
          <div className="text-center py-20 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <span className="text-5xl block mb-4">🐾</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No calendars yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first AI-powered pet calendar!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Preview thumbnail */}
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
                  <span className="text-5xl">🐾</span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">
                      {project.pet_name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        statusColors[project.status] ?? 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{project.style}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created{' '}
                    {new Date(project.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
