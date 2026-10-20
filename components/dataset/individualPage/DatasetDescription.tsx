import useTranslation from "next-translate/useTranslation";

// Full dataset description, shown right under the source of the resources so
// long texts are readable (the sidebar used to cut them after 4 lines)
export default function DatasetDescription({ notes }: { notes?: string }) {
  const { t } = useTranslation("common");
  const text = notes?.replace(/<\/?[^>]+(>|$)/g, "").trim();

  return (
    <section>
      <h3 className="sr-only">{t("description")}</h3>
      <p className="text-[15px] leading-relaxed font-normal text-stone-700 whitespace-pre-line">
        {text || t("noDescriptionAvailable")}
      </p>
    </section>
  );
}
