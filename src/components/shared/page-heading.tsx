export function PageHeading({
  actions,
  description,
  eyebrow,
  title,
}: {
  actions?: React.ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="animate-page-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="gradient-text text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
