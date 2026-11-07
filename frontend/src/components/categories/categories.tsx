"use client";

import { CategoryPayload } from "@/types/category";
import { useTranslations } from "next-intl";
interface CategoriesProps {
  categories: CategoryPayload[];
}
export const Categories = ({ categories }: CategoriesProps) => {
  const t = useTranslations("categoriesPage");
  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category: CategoryPayload) => (
          <div
            key={category.id}
            className="border bg-white rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-lg text-black font-bold">
              {category.nameEn}
            </h2>
            <p className="text-sm text-gray-500">{category.nameAr}</p>
            <p className="text-sm text-gray-600 mt-2">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
