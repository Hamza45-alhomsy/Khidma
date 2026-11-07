// src/app/[lang]/layout.tsx

import { getDirection, type Locale } from "@/lib/i18n/settings";
import React from "react";
import { ThemeProvider } from "@/components/landingPage/themeProvider";
import { ThemeToggle } from "@/components/landingPage/themeButton";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { getSessionToken } from "@/lib/auth/session";
import "./globals.css";
import LogoutButton from "@/components/logoutButton";
export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

// 1. Allow `lang` to be `string` to satisfy Next.js route validator constraints
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lang: rawLang } = await params;

  // 2. Cast/Fallback safely to your strict Locale type
  const lang = (rawLang === "en" ? "en" : "ar") as Locale;

  const dir = getDirection(lang);
  const t = await getTranslations("common");
  const messages = await getMessages();
  const token = await getSessionToken();
  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="mx-auto flex max-w-6xl items-center justify-between border-b bg-background p-4">
              {" "}
              <h1 className="text-xl font-bold">{t("welcome")}</h1>
              <nav className="flex gap-4">
                <a href={`/${lang}/services`} className="hover:underline">
                  {t("services")}
                </a>
                <a href={`/${lang}/tasks`} className="hover:underline">
                  {t("tasks")}
                </a>
              </nav>
              {token && <LogoutButton lang={lang} />}
              <ThemeToggle />
            </header>

            <main className="max-w-6xl mx-auto p-6">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
