import { RegisterForm } from "./registerForm";
import { Locale } from "@/lib/i18n/settings";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm lang={lang} />
    </div>
  );
}
