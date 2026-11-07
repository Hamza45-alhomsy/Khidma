"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/actions/authActions";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  lang: string;
}

export function RegisterForm({ lang }: RegisterFormProps) {
  const t = useTranslations("register");
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Link
            href={`/${lang}/login`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("login")}
          </Link>
        </div>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          <input type="hidden" name="lang" value={lang} />
          {state?.errors && (
            <p className="text-sm text-destructive">
              {state.message ||
                Object.values(state.errors ?? {})
                  .flat()
                  .join(" ")}
            </p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input id="fullName" name="fullName" required />
          </div>

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
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">{t("city")}</Label>
            <Input id="city" name="city" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 mt-2">
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
