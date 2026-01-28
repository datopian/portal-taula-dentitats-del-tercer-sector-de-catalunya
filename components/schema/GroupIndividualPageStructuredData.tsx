import nextSeoConfig, { imageUrl, siteTitle, url } from "@/next-seo.config";
import { Group } from "@portaljs/ckan";
import { BreadcrumbJsonLd, LogoJsonLd, NextSeo, WebPageJsonLd } from "next-seo";

export function GroupIndividualPageStructuredData({ group }: { group: Group }) {
  const title = group.title || group.name
  const isCollectiu = group?.name?.includes("col--");
  const basePath = isCollectiu ? "/collectius" : "/ambits";
  const baseLabel = isCollectiu ? "Col·lectius" : "Àmbits";
  const groupUrl = `${url}${basePath}/${group.name}`
  const description = group.description || `Pàgina de ${title}`
  const image = group.image_display_url || imageUrl

  return (
    <>
      <LogoJsonLd
        url={groupUrl}
        logo={group.image_display_url || `${url}/favicon.ico`}
      />
      <NextSeo
        canonical={groupUrl}
        title={`${title} | ${siteTitle}`}
        description={description}
        openGraph={{
          url: groupUrl,
          title: `${title} | ${siteTitle}`,
          description,
          images: [
            {
              url: image,
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
            name: baseLabel,
            item: `${url}${basePath}`,
          },
          {
            position: 3,
            name: title,
            item: groupUrl,
          },
        ]}
      />
      <WebPageJsonLd
        id={`${groupUrl}#grouppage`}
        url={groupUrl}
        name={title}
        description={description}
      />
    </>
  );
}
