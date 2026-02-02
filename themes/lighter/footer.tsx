import PortalDefaultLogo from "@/components/_shared/PortalDefaultLogo";
import { useTheme } from "@/components/theme/theme-provider";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import {
  RiFacebookFill,
  RiFlickrFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from "react-icons/ri";

interface IconProps {
  className: string;
  title: string;
  "aria-hidden": boolean;
}

const LighterThemeFooter: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const navigation = {
    about: [
      {
        name: "Què és l’Espai de Dades",
        href: "/about",
      },
      {
        name: "Sobre la Taula del Tercer Sector",
        href: "https://www.tercersector.cat/qui-som/la-taula-del-tercer-sector",
        target: "_blank",
      },
    ],
    useful: [
      { name: "Entitats de la Taula", href: "/entitats" },
      { name: "Col·lectius", href: "/collectius" },
      { name: "Àmbits", href: "/ambits" },
    ],
    getStarted: [
      {
        name: "Contacte",
        href: "/contacte",
      },
      {
        name: "Afegeix dades",
        href: "https://cloud.portaljs.com/auth/signin",
      }
    ],
    social: [
      {
        name: "x",
        href: "https://x.com/taula3sector",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiTwitterXFill {...props} />,
      },
      {
        name: "facebook",
        href: "https://www.facebook.com/tercersector.cat",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiFacebookFill {...props} />,
      },
      {
        name: "instagram",
        href: "https://www.instagram.com/taula3sector/",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiInstagramFill {...props} />,
      },
      {
        name: "flickr",
        href: "https://www.flickr.com/photos/tercersector/",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiFlickrFill {...props} />,
      },
      {
        name: "linkedin",
        href: "https://www.linkedin.com/company/taula-d%27entitats-del-tercer-sector-social-de-catalunya",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiLinkedinFill {...props} />,
      },
      {
        name: "youtube",
        href: "https://www.youtube.com/user/tercersectorcat",
        // eslint-disable-next-line
        icon: (props: IconProps) => <RiYoutubeFill {...props} />,
      },
    ],
  };

  const portalLogo =
    process.env.NEXT_PUBLIC_PORTAL_LOGO ?? "/images/logos/taula.svg";

  return (
    <footer className="bg-accent-50  mt-[155px]">
      <div
        className={`custom-container flex flex-col flex-wrap py-10 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap`}
      >
        <div className="justify-between w-full text-center md:text-left lg:flex">
          <div className="w-full lg:w-1/3 md:w-1/2">
            <h2 className="mt-4 mb-4 font-roboto font-black uppercase">
              {t("footer.about")}
            </h2>
            <ul className="space-y-4 text-sm list-none">
              {navigation.about.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="font-roboto font-normal hover:text-accent transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/3 md:w-1/2">
            <h2 className="mt-4 mb-4 font-roboto font-black uppercase">
              {t("footer.links")}
            </h2>
            <ul className="space-y-4 text-sm list-none">
              {navigation.useful.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="font-roboto font-normal hover:text-accent transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/3 md:w-1/2">
            <h2 className="mt-4 mb-4 font-roboto font-black uppercase">
              {t("footer.getStarted")}
            </h2>
            <ul className="space-y-4 text-sm list-none">
              {navigation.getStarted.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="font-roboto font-normal hover:text-accent transition-all"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between text-center md:text-left">
          <h2 className="mt-4 mb-4 font-roboto font-black uppercase">
            {t("footer.socials")}
          </h2>
          <div className="flex mt-5 space-x-5 justify-center md:justify-start">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="transition-all hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon
                  className="h-7 w-7"
                  aria-hidden={true}
                  title={item.name}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`custom-container flex flex-col items-center flex-wrap py-6 mx-auto md:flex-row md:items-center   md:flex-nowrap`}
      >
        <Link
          href="https://portaljs.com"
          className="flex gap-1 items-center"
          target={"_blank"}
          rel="noopener noreferrer"
        >
          <span className="text-sm">Built with</span>
          <span className="font-extrabold text-[#1f2937] text-xl sm:text-lg font-roboto ">
            🌀 PortalJS
          </span>
        </Link>

        <div className="md:ml-auto mt-4 md:mt-0">
          <Link
            href={"https://www.barcelona.cat/ca"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center gap-1"
          >
            <Image
              alt="Barcelona"
              width={180}
              height={50}
              src={"/images/logos/barcelona.jpg"}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default LighterThemeFooter;
