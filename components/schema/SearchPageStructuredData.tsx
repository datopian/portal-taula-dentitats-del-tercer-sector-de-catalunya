import nextSeoConfig, { imageUrl, siteTitle, url } from "@/next-seo.config";
import { BreadcrumbJsonLd, LogoJsonLd, NextSeo, SiteLinksSearchBoxJsonLd } from "next-seo";
import Script from "next/script";

export function SearchPageStructuredData() {
  const title = "Cerca"
  const description = "Cerca conjunts de dades disponibles a " + siteTitle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "name": title,
    "description": description,
    "url": url + "/cerca",
  };
  return (
    <>
      <LogoJsonLd
        url={`${url}/cerca`}
        logo={`${url}/favicon.ico`}
      />
      <NextSeo
        canonical={`${url}/cerca`}
        title={`${title} | ${siteTitle}`}
        description={description}
        openGraph={{
          url: `${url}/cerca`,
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
            name: 'Cerca',
            item: `${url}/cerca`,
          },
        ]}
      />
      <Script
        id="datacatalog-jsonld"
        type="application/ld+json"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <SiteLinksSearchBoxJsonLd
        url={`${url}/cerca`}
        potentialActions={[
          {
            target: `${url}/cerca?q={search_term_string}`,
            queryInput: "search_term_string"
          },
        ]}
      />
    </>
  );
}
