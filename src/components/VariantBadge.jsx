const VARIANT_STYLES = {
  'Holo Rare': 'text-accent-2 border-accent-2/40',
  'Full Art': 'text-accent-2 border-accent-2/40',
  'Full Art Special': 'text-accent-2 border-accent-2/40',
  'Promo Full Art': 'text-accent border-accent/40',
  'Special Art Rare': 'text-accent-2 border-accent-2/40',
  'Illustration Rare': 'text-accent-2 border-accent-2/40',
  Promo: 'text-accent border-accent/40',
  'Non-Holo': 'text-text-2 border-border',
  'Reverse Holo': 'text-accent-2/70 border-accent-2/20',
  Normal: 'text-text-2 border-border',
  'Holo': 'text-accent-2 border-accent-2/40',
};

export default function VariantBadge({ variant }) {
  const style = VARIANT_STYLES[variant] || 'text-text-2 border-border';
  return (
    <span
      className={`font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border ${style} bg-bg/80 leading-none whitespace-nowrap block truncate`}
    >
      {variant}
    </span>
  );
}
