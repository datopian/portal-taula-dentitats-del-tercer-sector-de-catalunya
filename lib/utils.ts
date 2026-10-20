import { format, register } from "timeago.js";
import ca from "timeago.js/lib/lang/ca";
import en from "timeago.js/lib/lang/en_US";
import clsx, {type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

register("en", en);
register("ca", ca);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDatasetName(name: string) {
  const mainOrg = process.env.NEXT_PUBLIC_ORG;
  const datasetName =
    name?.indexOf(`${mainOrg}--`) >= 0 ? name?.split(`${mainOrg}--`)[1] : name;

  return datasetName;
}

export function getTimeAgo(timestamp: string, locale: string = "ca") {
  const trimmed = timestamp.trim();
  const hasTZ = /Z$|[+-]\d{2}:\d{2}$/.test(trimmed);
  const normalized = hasTZ ? trimmed : `${trimmed}Z`;

  const date = new Date(normalized);
  if (isNaN(date.getTime())) {
    return timestamp;
  }

  return format(date, locale);
}

// Catalan dates built by hand instead of Intl.DateTimeFormat("ca"): Node and
// browsers ship different ICU data ("del 2026" vs "de 2026"), which breaks
// hydration. Read in UTC so server and browser agree on the day too.
const CA_MONTHS = [
  "gener", "febrer", "març", "abril", "maig", "juny",
  "juliol", "agost", "setembre", "octubre", "novembre", "desembre",
];
const CA_MONTHS_SHORT = [
  "gen.", "febr.", "març", "abr.", "maig", "juny",
  "jul.", "ag.", "set.", "oct.", "nov.", "des.",
];

export function formatDateCa(timestamp: string, short = false) {
  const trimmed = timestamp.trim();
  const hasTZ = /Z$|[+-]\d{2}:\d{2}$/.test(trimmed);
  const date = new Date(hasTZ ? trimmed : `${trimmed}Z`);
  if (isNaN(date.getTime())) {
    return timestamp;
  }

  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  if (short) {
    return `${String(day).padStart(2, "0")} ${CA_MONTHS_SHORT[month]} ${year}`;
  }
  const name = CA_MONTHS[month];
  // "d’abril", "d’agost", "d’octubre"; "de gener", "de març"...
  const of = /^[aeiou]/.test(name) ? "d’" : "de ";
  return `${day} ${of}${name} de ${year}`;
}

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Display label for a resource format. CKAN stores "Link" for external
// resources; show it in Catalan (DAT-05) without changing the stored value.
const FORMAT_LABELS: Record<string, string> = { LINK: "Enllaç" };

export function formatLabel(format?: string) {
  if (!format) return format;
  return FORMAT_LABELS[format.toUpperCase()] ?? format;
}
