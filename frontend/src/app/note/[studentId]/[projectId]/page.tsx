import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteWithProvenance } from "@/components/onboarding/NoteWithProvenance";
import { getMockNote } from "@/lib/mock/notes";

interface PageProps {
  params: Promise<{ studentId: string; projectId: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function NotePage({ params, searchParams }: PageProps) {
  const { studentId, projectId } = await params;
  const { created } = await searchParams;
  const note = getMockNote(studentId, projectId);

  if (!note) {
    notFound();
  }

  return (
    <>
      <nav className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-ink-muted transition hover:text-coral"
        >
          ← Home
        </Link>
      </nav>
      <NoteWithProvenance
        note={note}
        showCreatedBanner={created === "1"}
      />
    </>
  );
}
