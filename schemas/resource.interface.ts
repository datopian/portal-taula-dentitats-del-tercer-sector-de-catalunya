import { type Resource as IResource } from "@portaljs/ckan";

export type Resource = IResource & {
  iframe?: boolean;
  // Custom field set in PortalJS Cloud (e.g. "Informe")
  resource_type?: string;
};
