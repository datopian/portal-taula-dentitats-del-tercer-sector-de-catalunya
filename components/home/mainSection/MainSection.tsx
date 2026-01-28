import { Group } from "@portaljs/ckan";
import GroupCard from "../../groups/GroupCard";
import PopularDatasets from "./PopularDatasets";
import ActionCard from "../actions/actionCard";
import Link from "next/link";
import {
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import {
  RiQuestionnaireLine,
  RiSearch2Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { Dataset } from "@/schemas/dataset.interface";
import useTranslation from "next-translate/useTranslation";


export default function MainSection({
  groups,
  datasets,
}: {
  groups: Array<Group>;
  datasets: Array<Dataset>;
}) {
   const { t } = useTranslation('common')
  return (
    <section className="custom-container homepage-padding bg-white">
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-[100px]">
        {[
          {
            title: t("home.findData"),
            description: t("home.findDataDescription"),
            href: "/cerca",
            icon: <RiSearch2Line width={48} />,
            target: ""
          },
          {
            title: t("home.addData"),
            description: t("home.addDataDescription"),
            href: "https://cloud.portaljs.com/auth/signin",
            icon: <RiUploadCloud2Line width={48} />,
            target: "_blank"
          },
          {
            title: t("home.requestData"),
            description: t("home.requestDataDescription"),
            href: "https://m4social.org/contacte/",
            icon: <RiQuestionnaireLine width={48} />,
            target: "_blank"
          },
        ].map((item, i): JSX.Element => {
          return <ActionCard key={i} {...item} />;
        })}
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10">
        {datasets.length > 0 && (
          <section className="col-span-1 md:pr-2 mb-8 lg:mb-0">
            <PopularDatasets datasets={datasets} />
          </section>
        )}
        <section className="relative">
          {groups.length > 4 && (
            <Link
              href="/ambits"
              className={`font-montserrat font-semibold flex items-center gap-1 uppercase hover:text-darkaccent ml-auto w-fit absolute right-0 top-[-30px]`}
            >
              {t("seeAllGroups")}
              <ArrowLongRightIcon width={16} />
            </Link>
          )}
          <div className="col-span-1 grid sm:grid-cols-2 gap-4 md:pl-2">
            {groups.slice(0, 4).map((group) => (
              <article key={group.id} className="col-span-1 h-fit">
                <GroupCard
                  description={group.description}
                  display_name={group.display_name}
                  image_display_url={group.image_display_url}
                  name={group.name}
                />
              </article>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
