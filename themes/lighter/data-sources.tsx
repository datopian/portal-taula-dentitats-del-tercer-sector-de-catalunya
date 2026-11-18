import dataSources from "@/content/data-sources.json";

// "D'on venen les dades": logos of the organisations the portal's data comes
// from, shown on every page right before the footer. The list is edited in
// content/data-sources.json (logos go in public/images/data-sources/).
const DataSources: React.FC = () => (
  <section
    className="custom-container mx-auto pt-16"
    aria-labelledby="data-sources-title"
  >
    <h2 id="data-sources-title" className="text-2xl md:text-3xl font-black">
      {dataSources.title}
    </h2>
    <div className="mt-6 grid gap-8 md:grid-cols-2">
      {dataSources.groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-gray)]">
            {group.title}
          </h3>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {group.organizations.map((org) => (
              <li key={org.name}>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={org.name}
                  className="flex h-24 items-center justify-center rounded-lg bg-white p-4 ring-1 ring-gray-200 hover:ring-accent transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={org.logo}
                    alt={org.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default DataSources;
