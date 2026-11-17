import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center sm:py-36">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">This page wandered off.</h1>
      <p className="lede mx-auto mt-5 max-w-md">Probably chasing a squirrel. Let’s get you back to somewhere useful.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
        <Link href="/create" className="btn btn-primary">
          Make my calendar
        </Link>
      </div>
    </div>
  )
}
