// Resource type label ("Informe", "Dades"...) shown before the format badges
export default function ResourceTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-accent-50 px-2 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-[rgba(0,0,0,0.05)]">
      {type}
    </span>
  );
}
