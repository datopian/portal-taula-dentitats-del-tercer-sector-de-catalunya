import { Dataset } from "@portaljs/ckan";
import useTranslation from "next-translate/useTranslation";
import { formatDateCa } from "@/lib/utils";

// Fields from the PortalJS Cloud dataset schema not in the @portaljs/ckan type
type DatasetWithCloudFields = Dataset & { coverage?: string; frequency?: string };

export default function DatasetOverview({
  dataset,
}: {
  dataset: DatasetWithCloudFields;
}) {
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
      {dataset.coverage && (
        <div className="pb-5">
          <h4 className="pb-1 text-xs label-txt tracking-wider">
            {t("coverage")}
          </h4>
          <p className="font-semibold">{dataset.coverage}</p>
        </div>
      )}
      {dataset.frequency && (
        <div className="pb-5">
          <h4 className="pb-1 text-xs label-txt tracking-wider">
            {t("frequency")}
          </h4>
          <p className="font-semibold">
            {t(`frequencies.${dataset.frequency}`, {}, { fallback: dataset.frequency })}
          </p>
        </div>
      )}
      <div className="  pb-5">
        <h4 className="pb-1 text-xs label-txt tracking-wider">
          {t("datasetDate")}
        </h4>
        <p className="font-semibold">
          {dataset.metadata_created
            ? formatDateCa(dataset.metadata_created, true)
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
