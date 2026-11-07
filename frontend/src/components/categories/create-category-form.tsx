"use client";

import { createCategoryAction } from "@/actions/categoriesActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryPayload } from "@/types/category";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryFormState = Omit<CategoryPayload, "id">;

const initialState: CategoryFormState = {
  nameEn: "",
  nameAr: "",
  description: "",
  icon: "",
};

export function CreateCategoryForm({ lang }: { lang: string }) {
  const t = useTranslations("categoriesPage");
  const router = useRouter();
  const [form, setForm] = useState<CategoryFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateField = (field: keyof CategoryFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createCategoryAction(form);

      if (!result.success) {
        setError(result.error ?? t("unexpectedError"));
        return;
      }

      setForm(initialState);
      router.push(`/${lang}/categories`);
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 w-full max-w-2xl rounded-lg border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-bold text-black">{t("createTitle")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-black">
          {t("nameEn")}
          <Input
            value={form.nameEn}
            onChange={(event) => updateField("nameEn", event.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-black">
          {t("nameAr")}
          <Input
            value={form.nameAr}
            onChange={(event) => updateField("nameAr", event.target.value)}
            required
            dir="rtl"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-black sm:col-span-2">
          {t("description")}
          <Input
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-black">
          {t("icon")}
          <Input
            value={form.icon}
            onChange={(event) => updateField("icon", event.target.value)}
            placeholder={t("iconPlaceholder")}
            required
          />
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="mt-5">
        {isSubmitting ? t("creating") : t("create")}
      </Button>
    </form>
  );
}
