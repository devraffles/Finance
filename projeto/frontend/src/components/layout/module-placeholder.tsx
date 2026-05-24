interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export const ModulePlaceholder = ({
  title,
  description,
}: ModulePlaceholderProps) => {
  return (
    <section className="rounded-lg border border-dashed border-kwak-border bg-kwak-surface/70 p-6">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-kwak-lavender-200">
        {description}
      </p>
    </section>
  );
};
