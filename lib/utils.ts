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

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
