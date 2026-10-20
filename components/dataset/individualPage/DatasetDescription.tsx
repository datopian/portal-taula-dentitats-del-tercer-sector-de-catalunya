import useTranslation from "next-translate/useTranslation";

// Full dataset description, shown under the resources so long texts are
// readable (the sidebar used to cut them after 4 lines)
export default function DatasetDescription({ notes }: { notes?: string }) {
  const { t } = useTranslation("common");
  const text = notes?.replace(/<\/?[^>]+(>|$)/g, "").trim();

  return (
    <section className="mt-8 pt-6 border-t">
      <h3 className="pb-2 text-xs label-txt tracking-wider">
        {t("description")}
      </h3>
      <p className="text-sm font-normal text-stone-600 whitespace-pre-line">
        {text || t("noDescriptionAvailable")}
      </p>
    </section>
  );
}
