"use client";

import { login } from "@/actions/authActions";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ lang }: { lang: string }) {
  const t = useTranslations("login");
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <Card className="w-full max-w-sm">
      <form action={formAction}>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
          <CardAction>
            <Link
              href={`/${lang}/register`}
              className="text-sm underline-offset-4 hover:underline"
            >
              {t("signUp")}
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <input type="hidden" name="lang" value={lang} />
          <div className="flex flex-col gap-6">
            {state?.message && (
              <p role="alert" className="text-sm text-destructive">
                {state.message}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t("password")}</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </a>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? t("submitting") : t("submit")}
          </Button>
          <Button variant="outline" type="button" className="w-full">
            {t("google")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
