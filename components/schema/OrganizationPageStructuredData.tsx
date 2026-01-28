import nextSeoConfig, { imageUrl, siteTitle, url } from "@/next-seo.config";
import { BreadcrumbJsonLd, LogoJsonLd, NextSeo, WebPageJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo";

export function OrganizationPageStructuredData() {
  const title = "Entitats de la Taula"
  const description = "Entitats de la Taula de " + siteTitle
  return (
    <>
      <LogoJsonLd
        url={`${url}/entitats`}
        logo={`${url}/favicon.ico`}
      />
      <NextSeo
        canonical={`${url}/entitats`}
        title={`${title} | ${siteTitle}`}
        description={description}
        openGraph={{
          url: `${url}/entitats`,
          title: `${title} | ${siteTitle}`,
          description: description,
          images: [
            {
              url: imageUrl,
              alt: title,
              width: 1200,
              height: 627,
            },
          ],
          site_name: siteTitle,
        }}
        twitter={nextSeoConfig.twitter}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Inici',
            item: url,
          },
          {
            position: 2,
            name: title,
            item: `${url}/entitats`,
          },
        ]}
      />
      <WebPageJsonLd
        id={`${url}/entitats#webpage`}
        url={`${url}/entitats`}
        name={title}
        description={description}
      />
      <SiteLinksSearchBoxJsonLd
        url={`${url}/entitats`}
        potentialActions={[
          {
            target: `${url}/entitats`,
            queryInput: "search_term_string"
          },
        ]}
      />
    </>
  );
}
