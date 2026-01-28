/* eslint-disable import/no-anonymous-default-export */

export const siteTitle = "Espai de Dades";
export const title = "Espai de Dades";
export const description =
  "Un espai per trobar, compartir i utilitzar dades obertes d’interès en el dia a dia de l’acció social.";

export const url = "https://espaidedades.tercersector.cat";
export const imageUrl = `${url}/images/portaljs-frontend.png`;

export default {
  defaultTitle: `${siteTitle} | ${title}`,
  siteTitle,
  description,
  canonical: url,
  openGraph: {
    siteTitle,
    description,
    type: "website",
    locale: "en_US",
    url,
    site_name: siteTitle,
    images: [
      {
        url: imageUrl,
        alt: siteTitle,
        width: 1200,
        height: 627,
        type: "image/png",
      },
    ],
  },
  twitter: {
    handle: "@datopian",
    site: "@PortalJS_",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content: "PortalJS, open data, datasets, data portal, Portal, datopian, frontend template",
    },
    {
      name: "author",
      content: "Datopian / PortalJS",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "627",
    },
    {
      property: "og:locale",
      content: "en_US",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ]
};
