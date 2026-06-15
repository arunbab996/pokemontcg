import CardCell from './CardCell';

export default function CardGrid({ cards, fetchingIds }) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-text-1 font-body font-medium text-lg">No cards yet.</p>
        <p className="text-text-2 font-body text-sm mt-1">
          Go to{' '}
          <a href="/admin" className="text-accent underline">
            /admin
          </a>{' '}
          to add your first card.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <CardCell key={card.id} card={card} isFetching={fetchingIds.has(card.id)} />
      ))}
    </div>
  );
}
