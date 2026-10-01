import { useTheme } from "@/components/theme/theme-provider";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LighterThemeHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const portalLogo =
    process.env.NEXT_PUBLIC_PORTAL_LOGO ?? "/images/logos/taula.svg";

  const { t } = useTranslation("common");

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false); // Close the menu
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  const navItems = [
    { href: "/que-es", label: t("project") },
    { href: "/cerca", label: t("datasets") },
    { href: "/entitats", label: t("organizations") },
    { href: "/ambits", label: t("groups") },
    { href: "/collectius", label: "Col·lectius" },
  ];

  const siteName = (
    <Link
      href="/"
      className="flex flex-col font-black leading-tight text-[15px] sm:text-[17px] shrink-0"
    >
      <span>{t("siteName.line1")}</span>
      <span className="text-accent">{t("siteName.line2")}</span>
    </Link>
  );

  const taulaLogo = (
    <Link
      href="https://www.tercersector.cat"
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0"
    >
      <Image
        src={portalLogo}
        alt="Taula d’entitats del Tercer Sector Social de Catalunya"
        height={40}
        width={123}
      />
    </Link>
  );

  return (
    <header className="bg-transparent ">
      <nav
        className={`mx-auto py-4 flex custom-container items-center justify-between gap-x-6 ${theme.styles.containerWide}`}
        aria-label="Navegació principal"
      >
        {siteName}

        <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8 ml-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-semibold text-sm xl:text-base uppercase whitespace-nowrap ${
                router.pathname === item.href ? "text-accent" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block ml-auto lg:ml-4 xl:ml-6">{taulaLogo}</div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 bg-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Obre el menú principal</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            {siteName}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-[var(--text-base)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Tanca el menú</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-semibold my-auto"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="py-6">{taulaLogo}</div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
