import { Locale } from "@/lib/i18n/settings";
import { LoginForm } from "@/components/login/loginForm";
export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm lang={lang} />
    </div>
  );
}
