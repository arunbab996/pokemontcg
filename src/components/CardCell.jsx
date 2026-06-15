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
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="#c8c4bc" strokeWidth="2"/>
            <circle cx="16" cy="16" r="4" fill="#c8c4bc"/>
            <line x1="4" y1="16" x2="28" y2="16" stroke="#c8c4bc" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-item" style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
        <img
          src={card.image_url}
          alt={card.name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
      {open && <CardModal card={card} onClose={() => setOpen(false)} />}
    </>
  );
}
