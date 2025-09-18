import PortalDefaultLogo from "@/components/_shared/PortalDefaultLogo";
import { useTheme } from "@/components/theme/theme-provider";
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
  const navigation = {
    about: [
      { name: "About Us", href: "https://www.datopian.com/about/" },
      {
        name: "Our Technology",
        href: "https://portaljs.com",
      },
      {
        name: "Playbook",
        href: "https://www.datopian.com/playbook",
      },
    ],
    useful: [
      { name: "Organizations", href: "/organizations" },
      { name: "Request data", href: "/request" },
      { name: "Login", href: "https://cloud.portaljs.com/auth/signin" },
    ],
    getStarted: [
      {
        name: "Find data",
        href: "/search",
      },
      {
        name: "Publish data",
        href: "#",
      },
      {
        name: "Get help",
        href: "#",
      },
    ],
    social: [
      {
        name: "x",
        href: "https://x.com/taula3sector",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiTwitterXFill {...props} />
        ),
      },
      {
        name: "facebook",
        href: "https://www.facebook.com/tercersector.cat",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiFacebookFill {...props} />
        ),
      },
      {
        name: "instagram",
        href: "https://www.instagram.com/taula3sector/",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiInstagramFill {...props} />
        ),
      },
      {
        name: "flickr",
        href: "https://www.flickr.com/photos/tercersector/",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiFlickrFill {...props} />
        ),
      },
      {
        name: "linkedin",
        href: "https://www.linkedin.com/company/taula-d%27entitats-del-tercer-sector-social-de-catalunya",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiLinkedinFill {...props} />
        ),
      },
      {
        name: "youtube",
        href: "https://www.youtube.com/user/tercersectorcat",
        // eslint-disable-next-line
        icon: (props: IconProps) => (
          <RiYoutubeFill {...props} />
        ),
      },
    ],
  };

  const portalLogo = process.env.NEXT_PUBLIC_PORTAL_LOGO ?? '/images/logos/taula.svg';

  return (
    <footer className="bg-accent-50  mt-[155px]">
      <div
        className={`custom-container flex flex-col flex-wrap py-10 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap`}
      >
        <div className="justify-between w-full text-center md:text-left lg:flex">
          <div className="w-full lg:w-1/3 md:w-1/2">
            <h2 className="mt-4 mb-4 font-roboto font-black">ABOUT DATOPIAN</h2>
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
            <h2 className="mt-4 mb-4 font-roboto font-black">USEFUL LINKS</h2>
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
            <h2 className="mt-4 mb-4 font-roboto font-black">GET STARTED</h2>
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
          <h2 className="mt-4 mb-4 font-roboto font-black">
            STAY UP TO DATE WITH THE NEWS
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
                <item.icon className="h-7 w-7" aria-hidden={true} title={item.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`custom-container flex flex-col flex-wrap py-6 mx-auto md:items-center lg:items-start md:flex-row md:flex-nowrap`}
      >
        {portalLogo ? (
          <Link href="/">
            <Image src={portalLogo} alt="logo" height={75} width={230} />
          </Link>
        ) : (
          <PortalDefaultLogo />
        )}
      </div>
    </footer>
  );
};

export default LighterThemeFooter;
