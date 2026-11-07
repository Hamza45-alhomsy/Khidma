import { Categories } from "../../../components/categories/categories";
import { getAllCategoriesAction } from "@/actions/categoriesActions";
import { Locale } from "@/lib/i18n/settings";
import Link from "next/link";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const categories = await getAllCategoriesAction();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link
        href={`/${lang}/categories/create`}
        className="mb-6 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Create Category
      </Link>
      <Categories categories={categories} />
    </div>
  );
}
