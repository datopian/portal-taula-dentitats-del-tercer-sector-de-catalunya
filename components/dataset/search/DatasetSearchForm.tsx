import {  useState } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import { useSearchState } from "./SearchContext";
import useTranslation from "next-translate/useTranslation";

export default function DatasetSearchForm() {
  const { theme } = useTheme();
  const { setOptions, options } = useSearchState();
  const [q, setQ] = useState(options.query ?? "");
  const handleSubmit = (e) => {
    e.preventDefault();
    setOptions({
      query: q,
    });
    return false;
  };

  const { t } = useTranslation('common')

  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="min-h-[70px] flex flex-col lg:flex-row bg-white pr-5 py-3 rounded-xl">
        <input
          type="text"
          placeholder={t("searchTypeInPlaceholder")}
          className="mx-4 grow py-3 border-0 placeholder:text-neutral-400 outline-0"
          name="query"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("searchDatasets")}
        />

        <button
          className={`font-bold border-b-[4px] border-accent text-white px-12 py-3 rounded-lg bg-accent hover:bg-cyan-500 duration-150 ${theme.styles.bgDark}`}
          type="submit"
        >
          {t("search")}
        </button>
      </div>
    </form>
  );
}
