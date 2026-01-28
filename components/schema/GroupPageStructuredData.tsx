import nextSeoConfig, { imageUrl, siteTitle, url } from "@/next-seo.config";
import { BreadcrumbJsonLd, LogoJsonLd, NextSeo, WebPageJsonLd, SiteLinksSearchBoxJsonLd } from "next-seo";

export function GroupPageStructuredData({
  title = "Àmbits",
  path = "/ambits",
}: {
  title?: string;
  path?: string;
}) {
  const description = `${title} de ${siteTitle}`
  return (
    <>
      <LogoJsonLd
        url={`${url}${path}`}
        logo={`${url}/favicon.ico`}
      />
      <NextSeo
        canonical={`${url}${path}`}
        title={`${title} | ${siteTitle}`}
        description={description}
        openGraph={{
          url: `${url}${path}`,
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
            item: `${url}${path}`,
          },
        ]}
      />
      <WebPageJsonLd
        id={`${url}${path}#webpage`}
        url={`${url}${path}`}
        name={title}
        description={description}
      />
      <SiteLinksSearchBoxJsonLd
        url={`${url}${path}`}
        potentialActions={[
          {
            target: `${url}${path}`,
            queryInput: "search_term_string"
          },
        ]}
      />
    </>
  );
}
