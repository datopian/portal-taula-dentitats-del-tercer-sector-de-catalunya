import getConfig from "next/config";
import Image from "next/image";
import Link from "next/link";
import { Group } from "@portaljs/ckan";
import { useTheme } from "../theme/theme-provider";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import useTranslation from "next-translate/useTranslation";
import { RiFunctionLine, RiGroupLine } from "react-icons/ri";

type GroupCardProps = Pick<
  Group,
  "display_name" | "image_display_url" | "description" | "name"
>;

export default function GroupCard({
  display_name,
  image_display_url,
  description,
  name,
}: GroupCardProps) {
  const { theme } = useTheme();
  const url = image_display_url ? new URL(image_display_url) : undefined;
  const isCollectiu = name?.includes("col--");
  const hasImage =
    !!image_display_url &&
    !!url &&
    (getConfig().publicRuntimeConfig.DOMAINS ?? []).includes(url.hostname);
  return (
    <Link
      href={`/${isCollectiu ? "collectius" : "ambits"}/${name}`}
      className={`bg-white hover:bg-accent-50 group border-b-[4px] border-white hover:border-accent p-8 col-span-3 rounded-lg flex flex-col h-full text-accent  ${theme.styles.shadowSm}`}
    >
      {isCollectiu ? (
        // All col·lectius share the same icon
        <RiGroupLine size={54} aria-hidden={true} />
      ) : hasImage ? (
        <Image
          src={image_display_url}
          alt={`${name}-collection`}
          width="54"
          height="54"
        ></Image>
      ) : (
        // Neutral default until an icon is uploaded for the àmbit in CKAN
        <RiFunctionLine size={54} aria-hidden={true} />
      )}
      <div className={`text-black`}>
        <h3 className="font-inter font-semibold text-lg mt-4 group-hover:text-accent">
          {display_name}
        </h3>
        <p className="font-inter font-medium text-sm mt-1 mb-6 line-clamp-2">
          {description}
        </p>
      </div>
      <span
        className={`mt-auto font-inter font-medium text-sm flex items-center gap-2`}
      >
      Veure
        <ArrowRightIcon width={16} />
      </span>
    </Link>
  );
}
