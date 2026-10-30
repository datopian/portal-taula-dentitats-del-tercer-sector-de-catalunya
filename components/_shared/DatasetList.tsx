import { Dataset } from "@portaljs/ckan";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import DatasetItem from "../dataset/search/DatasetItem";

interface DatasetListProps {
  datasets: Array<Dataset>;
}

const PAGE_SIZE = 20;

export default function DatasetList({ datasets }: DatasetListProps) {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <div className="py-8 w-full flex flex-col gap-y-4">
      {datasets.slice(0, visible).map((dataset: Dataset) => (
        <DatasetItem key={dataset.id} dataset={dataset} />
      ))}
      {datasets.length > visible && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="self-start bg-[var(--dark)] hover:bg-black text-white py-[10px] px-[12px] rounded-[4px] transition font-[600] text-[12px] leading-[15px]"
        >
          {t("showMore")} ({datasets.length - visible})
        </button>
      )}
    </div>
  );
}
