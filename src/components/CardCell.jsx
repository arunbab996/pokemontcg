import { useState } from 'react';
import CardModal from './CardModal';

export default function CardCell({ card, isFetching }) {
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  const hasImage = card.image_url && !imgError;

  if (isFetching) {
    return (
      <div className="card-item">
        <div className="shimmer" style={{ aspectRatio: '63/88' }} />
      </div>
    );
  }

  if (!hasImage) {
    return (
      <div className="card-item">
        <div className="card-placeholder">
          <img src="/cardback.jpg" alt="Card back" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-item" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setOpen(true)}>
        <img
          src={card.image_url}
          alt={card.name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="card-tag">
          <div className="card-tag-name">{card.name}</div>
          <div className="card-tag-meta">{card.set_name} · {card.variant}</div>
        </div>
      </div>
      {open && <CardModal card={card} onClose={() => setOpen(false)} />}
    </>
  );
}
