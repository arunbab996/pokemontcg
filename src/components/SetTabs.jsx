export default function SetTabs({ sets, activeSet, onSelect }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {sets.map(({ name, count }) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-body font-medium transition-colors whitespace-nowrap ${
            activeSet === name ? 'tab-active' : 'tab-inactive'
          }`}
        >
          {name}
          <span
            className={`font-mono text-[11px] px-1.5 py-0.5 rounded-full ${
              activeSet === name
                ? 'bg-accent/20 text-accent'
                : 'bg-border text-text-2'
            }`}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
