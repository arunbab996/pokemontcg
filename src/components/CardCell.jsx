import { useState } from 'react';

export default function CardCell({ card, isFetching, onOpen, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const delay = `${Math.min(index * 40, 600)}ms`;

  return (
    <div
      className="card-item card-enter"
      style={{ cursor: card.image_url && !isFetching ? 'pointer' : 'default', position: 'relative', animationDelay: delay }}
      onClick={card.image_url && !isFetching ? onOpen : undefined}
    >
      <div className={`card-flip${flipped ? ' card-flip--flipped' : ''}`}>
        <div className="card-flip-inner">
          <div className="card-back-face">
            <img src="/cardback.jpg" alt="Card back" />
          </div>
          <div className="card-front-face">
            {(card.image_url && !isFetching) && (
              <img
                src={card.image_url}
                alt={card.name}
                loading="lazy"
                onLoad={() => setFlipped(true)}
                onError={() => setFlipped(true)}
              />
            )}
          </div>
        </div>
      </div>
      {flipped && (
        <div className="card-tag">
          <div className="card-tag-name">{card.name}</div>
          <div className="card-tag-meta">{card.set_name} · {card.variant}</div>
        </div>
      )}
    </div>
  );
}
