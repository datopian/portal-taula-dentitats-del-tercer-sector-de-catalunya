import nextSeoConfig, { description, siteTitle, title, url } from "@/next-seo.config";
import { BreadcrumbJsonLd, LogoJsonLd, NextSeo, WebPageJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo";

export function HomePageStructuredData() {
  return (
    <>
      <LogoJsonLd
        url={url}
        logo={`${url}/favicon.ico`}
      />
      <NextSeo title={`Inici | ${siteTitle}`} {...nextSeoConfig} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Inici',
            item: url,
          },
        ]}
      />
      <WebPageJsonLd
        id={`${url}#webpage`}
        url={url}
        name={siteTitle}
        description={description}
      />
      <SiteLinksSearchBoxJsonLd
        url={url}
        potentialActions={[
          {
            target: `${url}/cerca?q={search_term_string}`,
            queryInput: "required name=search_term_string",
          },
        ]}
      />
    </>
  );
}
