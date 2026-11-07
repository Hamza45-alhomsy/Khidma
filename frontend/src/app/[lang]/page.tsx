import Link from "next/link";

interface HomeProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;

  return (
    <section className="flex min-h-[calc(100vh-220px)] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Find help. Offer your skills.
      </h1>

      <p className="max-w-2xl text-muted-foreground">
        Khidma connects people who need services with people who can provide
        them.
      </p>

      <div className="flex gap-3">
        <Link
          href={`/${lang}/register`}
          className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Get started
        </Link>
        <Link
          href={`/${lang}/services`}
          className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Browse services
        </Link>{" "}
      </div>
    </section>
  );
}
