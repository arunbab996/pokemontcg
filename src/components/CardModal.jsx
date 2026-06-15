import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CardModal({ card, onClose }) {
  const [closing, setClosing] = useState(false);

  const dismiss = () => {
    setClosing(true);
    setTimeout(onClose, 180);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div
      className={`card-modal-backdrop${closing ? ' closing' : ''}`}
      onClick={dismiss}
    >
      <img
        src={card.image_url}
        alt={card.name}
        className="card-modal-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}
