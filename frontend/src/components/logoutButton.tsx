"use client";
import { logout } from "../actions/authActions";
import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

export default function LogoutButton({ lang }: { lang: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");
  const handleLogout = () => {
    startTransition(async () => {
      await logout(lang);
    });
  };
  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center w-full px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
    >
      <LogOutIcon />
      <span>{isPending ? t("loggingOut") : t("logout")}</span>
    </button>
  );
}
