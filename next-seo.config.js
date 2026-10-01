/* eslint-disable import/no-anonymous-default-export */

export const siteTitle = "Espai de Dades";
export const title = "Espai de Dades";
export const description =
  "Un nou espai per trobar, compartir i utilitzar dades de l’àmbit social disponibles per a tothom.";

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
    locale: "ca_ES",
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
    handle: "@taula3sector",
    site: "@taula3sector",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content: "dades obertes, tercer sector social, Catalunya, Taula del Tercer Sector, acció social, PortalJS",
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
      content: "ca_ES",
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
