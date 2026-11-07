import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./lib/i18n/settings";

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );
  if (pathIsMissingLocale) {
    const locale = i18n.defaultLocal;
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.well-known).*)"],
};
