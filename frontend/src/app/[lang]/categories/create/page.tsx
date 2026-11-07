import { CreateCategoryForm } from "@/components/categories/create-category-form";
import { Locale } from "@/lib/i18n/settings";
import Link from "next/link";
import { Suspense } from "react";

export default async function CreateCategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link
        href={`/${lang}/categories`}
        className="mb-4 text-sm text-primary underline-offset-4 hover:underline"
      >
        Back to categories
      </Link>
      <Suspense fallback={<p>Loading...</p>}>
        <CreateCategoryForm lang={lang} />
      </Suspense>
    </div>
  );
}
