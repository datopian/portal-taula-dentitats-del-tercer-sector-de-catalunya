import useTranslation from "next-translate/useTranslation";
import { useResourceData } from "./DataProvider";

export default function TablePagination() {
  const { currentPage, totalPages, setCurrentPage } = useResourceData();
  const {t} = useTranslation("common");
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between bg-white  py-3 w-full"
      role="navigation"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          {t("page")} <span className="font-medium">{currentPage}</span> {t("of")} {" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <a
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="cursor-pointer relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          aria-label="Previous page"
        >
          {t("previous")}
        </a>
        <a
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="cursor-pointer relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          aria-label="Next page"
        >
          {t("next")}
        </a>
      </div>
    </nav>
  );
}
