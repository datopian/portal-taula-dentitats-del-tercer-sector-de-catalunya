import { Dataset } from "@portaljs/ckan";
import useTranslation from "next-translate/useTranslation";

export default function DatasetOverview({ dataset }: { dataset: Dataset }) {
  const {t} = useTranslation("common");

  const ambits = dataset.groups.filter(g => !g.name.includes("col--"))
  const colletius = dataset.groups.filter(g => g.name.includes("col--"))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
      <div className=" pb-5">
        <h4 className="pb-2 text-xs label-txt tracking-wider">{t("author")}</h4>
        <p className="font-semibold">
          {dataset.author
            ? dataset.author
            : dataset.organization
            ? dataset.organization.title
            : ""}
        </p>
      </div>
      <div className="pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">
          {t("authorEmail")}
        </h4>
        <p className="font-semibold">
          {dataset.author_email ? dataset.author_email : ""}
        </p>
      </div>
      <div className="pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">{t("group")}</h4>
        <p className="font-semibold">
          {ambits.length > 0
            ? ambits.map((group) => group.title).join(", ")
            : "N/A"}
        </p>
      </div>
      <div className="pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">Col·lectius</h4>
        <p className="font-semibold">
          {colletius.length > 0
            ? colletius.map((group) => group.title).join(", ")
            : "N/A"}
        </p>
      </div>
      <div className="  pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">
          {t("datasetDate")}
        </h4>
        <p className="font-semibold">
          {dataset.metadata_created
            ? new Intl.DateTimeFormat("en-GB", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(dataset.metadata_created))
            : "N/A"}
        </p>
      </div>
      <div className="  pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">
          {t("version")}
        </h4>
        <p className="font-semibold">
          {dataset.version ? dataset.version : "1.0"}
        </p>
      </div>
    </div>
  );
}
