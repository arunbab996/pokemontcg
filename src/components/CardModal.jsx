import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function CardModal({ card, onClose, onPrev, onNext }) {
  const [closing, setClosing] = useState(false);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 180);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [dismiss, onPrev, onNext]);

  return createPortal(
    <div
      className={`card-modal-backdrop${closing ? ' closing' : ''}`}
      onClick={dismiss}
    >
      {onPrev && (
        <button className="modal-nav modal-nav-prev" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous card">
          ‹
        </button>
      )}
      <img
        src={card.image_url}
        alt={card.name}
        className="card-modal-img"
        onClick={(e) => e.stopPropagation()}
      />
      {onNext && (
        <button className="modal-nav modal-nav-next" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next card">
          ›
        </button>
      )}
    </div>,
    document.body
  );
}
