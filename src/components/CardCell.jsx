import { useState } from 'react';

export default function CardCell({ card, isFetching, onOpen, index = 0, reveal = false }) {
  const [imageReady, setImageReady] = useState(false);
  const flipped = reveal && imageReady;
  const cardBack = card.language === 'Japanese' ? '/cardback-jp.jpg' : '/cardback.jpg';
  const flipDelay = `${Math.min(index * 50, 1000)}ms`;
  const enterDelay = `${Math.min(index * 30, 400)}ms`;

  return (
    <div
      className="card-item card-enter"
      style={{ cursor: flipped ? 'pointer' : 'default', position: 'relative', animationDelay: enterDelay }}
      onClick={flipped ? onOpen : undefined}
    >
      <div className={`card-flip${flipped ? ' card-flip--flipped' : ''}`} style={{ '--flip-delay': flipDelay }}>
        <div className="card-flip-inner">
          <div className="card-back-face">
            <img src={cardBack} alt="Card back" />
          </div>
          <div className="card-front-face">
            {card.image_url && !isFetching && (
              <img
                src={card.image_url}
                alt={card.name}
                loading="lazy"
                onLoad={() => setImageReady(true)}
                onError={() => setImageReady(true)}
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
