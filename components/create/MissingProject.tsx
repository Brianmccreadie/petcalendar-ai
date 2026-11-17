import Link from 'next/link'

export default function MissingProject({ message = 'We couldn’t find that calendar.' }: { message?: string }) {
  return (
    <div className="mx-auto max-w-md px-5 py-28 text-center">
      <h1 className="display text-4xl">{message}</h1>
      <p className="lede mt-4">It may have been started in another browser. You can pick up a saved calendar or start a new one.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className="btn btn-ghost">
          My calendars
        </Link>
        <Link href="/create" className="btn btn-primary">
          Start a new one
        </Link>
      </div>
    </div>
  )
}
