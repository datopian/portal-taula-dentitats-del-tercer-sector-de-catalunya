import dataSources from "@/content/data-sources.json";

// "D'on venen les dades": logos of the organisations the portal's data comes
// from, shown at the top of the footer on every page. The list is edited in
// content/data-sources.json (logos go in public/images/data-sources/).
const DataSources: React.FC = () => (
  <section
    className="custom-container mx-auto pt-12 pb-10 border-b border-gray-200 text-center"
    aria-labelledby="data-sources-title"
  >
    <h2 id="data-sources-title" className="text-xl md:text-2xl font-black">
      {dataSources.title}
    </h2>
    {dataSources.groups.map((group) => (
      <div key={group.title} className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-gray)]">
          {group.title}
        </h3>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {group.organizations.map((org) => (
            <li key={org.name}>
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                title={org.name}
                className="block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.logo}
                  alt={org.name}
                  loading="lazy"
                  className="h-10 md:h-12 w-auto max-w-[180px] object-contain mix-blend-multiply [filter:grayscale(1)_brightness(.8)_contrast(2.5)]"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

export default DataSources;
