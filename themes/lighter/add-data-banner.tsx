import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";

// FOO-06: call to action shown on every page, right before the footer
const AddDataBanner: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  // The banner links to the contact page, so it's pointless there
  if (router.pathname === "/contacte") {
    return null;
  }

  return (
    <section className="custom-container mx-auto mt-[155px]">
      <div className="bg-accent rounded-lg px-8 py-10 md:px-12 flex flex-col md:flex-row md:items-center gap-6 text-white">
        <div>
          <h2 className="text-2xl md:text-3xl font-black">
            {t("addDataBanner.title")}
          </h2>
          <p className="mt-2 text-base md:text-lg">
            {t("addDataBanner.description")}
          </p>
        </div>
        <Link
          href="/contacte"
          className="md:ml-auto shrink-0 bg-white text-accent font-semibold uppercase rounded-[10px] px-6 py-3 hover:bg-accent-50 transition-all"
        >
          {t("addDataBanner.cta")}
        </Link>
      </div>
    </section>
  );
};

export default AddDataBanner;
