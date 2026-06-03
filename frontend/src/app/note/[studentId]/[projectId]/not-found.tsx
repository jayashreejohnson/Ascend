import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-ink">Note not found</h1>
      <p className="mt-2 text-ink-muted">
        This shared note isn’t in the demo set yet.
      </p>
      <Link href="/" className="mt-6 inline-block text-coral hover:underline">
        Back home
      </Link>
    </main>
  );
}
