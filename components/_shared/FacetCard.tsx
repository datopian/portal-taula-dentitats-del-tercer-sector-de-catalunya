import useTranslation from "next-translate/useTranslation";
import { useTheme } from "../theme/theme-provider";

export default function FacetCard({
  title,
  children,
  showClear,
  clearAction,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  showClear?: boolean;
  clearAction?: Function;
}) {
  const {
    theme: { styles },
  } = useTheme();

  const { t } = useTranslation("common");

  return (
    <section className={`bg-white rounded-[10px] p-5 mb-4  ${styles.shadowMd}`}>
      <div className="flex items-center pb-4 ">
        {title && <h1 className="font-bold m-0">{title}</h1>}
      </div>
      <div>{children}</div>
      {showClear && (
        <div>
          <span
            role="button"
            className="text-sm cursor-pointer hover:underline"
            onClick={() => clearAction && clearAction()}
          >
            {t("clear")}
          </span>
        </div>
      )}
    </section>
  );
}
