import { useState, useEffect, useCallback, useRef } from 'react';
import { SEED_CARDS } from '../data/seed';

const STORAGE_KEY = 'binder_v4';
const PTCG_BASE = 'https://api.pokemontcg.io/v2/cards';

async function fetchCardImage(card) {
  try {
    const num = parseInt(card.card_number, 10);
    const q = `set.id:${card.set_code} number:${num}`;
    const res = await fetch(`${PTCG_BASE}?q=${encodeURIComponent(q)}`);
    if (!res.ok) return '';
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data[0].images?.large || json.data[0].images?.small || '';
    }
    return '';
  } catch {
    return '';
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(binder) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(binder));
  } catch {}
}

export function useCollection() {
  const [binder, setBinder] = useState(() => {
    const stored = loadFromStorage();
    if (stored) return stored;
    return { cards: SEED_CARDS, last_updated: new Date().toISOString() };
  });
  const [fetchingIds, setFetchingIds] = useState(new Set());
  const fetchRan = useRef(false);

  const persistBinder = useCallback((next) => {
    setBinder(next);
    saveToStorage(next);
  }, []);

  // On mount: fetch missing images, one at a time so state updates are visible immediately
  useEffect(() => {
    if (fetchRan.current) return;
    fetchRan.current = true;

    const stored = loadFromStorage();
    const cards = stored ? stored.cards : SEED_CARDS;
    const missing = cards.filter((c) => !c.image_url);
    if (missing.length === 0) return;

    setFetchingIds(new Set(missing.map((c) => c.id)));

    missing.forEach(async (card) => {
      const url = await fetchCardImage(card);
      setBinder((prev) => {
        const updated = {
          ...prev,
          cards: prev.cards.map((c) => (c.id === card.id ? { ...c, image_url: url } : c)),
          last_updated: new Date().toISOString(),
        };
        saveToStorage(updated);
        return updated;
      });
      setFetchingIds((prev) => {
        const s = new Set(prev);
        s.delete(card.id);
        return s;
      });
    });
  }, []);

  const addCard = useCallback(
    async (cardData) => {
      const id = cardData.id || `${cardData.set_code}-${cardData.card_number}-${Date.now()}`;
      const newCard = {
        ...cardData,
        id,
        image_url: cardData.image_url || '',
        added_at: new Date().toISOString(),
      };

      const next = {
        cards: [...binder.cards, newCard],
        last_updated: new Date().toISOString(),
      };
      persistBinder(next);

      if (!newCard.image_url) {
        setFetchingIds((prev) => new Set([...prev, id]));
        const url = await fetchCardImage(newCard);
        setBinder((prev) => {
          const updated = {
            ...prev,
            cards: prev.cards.map((c) => (c.id === id ? { ...c, image_url: url } : c)),
          };
          saveToStorage(updated);
          return updated;
        });
        setFetchingIds((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    },
    [binder, persistBinder]
  );

  const updateCard = useCallback(
    async (id, cardData) => {
      const shouldRefetch = !cardData.image_url;
      const updated = {
        ...cardData,
        id,
        image_url: cardData.image_url || '',
        added_at: cardData.added_at || new Date().toISOString(),
      };
      const next = {
        ...binder,
        cards: binder.cards.map((c) => (c.id === id ? updated : c)),
        last_updated: new Date().toISOString(),
      };
      persistBinder(next);

      if (shouldRefetch) {
        setFetchingIds((prev) => new Set([...prev, id]));
        const url = await fetchCardImage(updated);
        setBinder((prev) => {
          const u = {
            ...prev,
            cards: prev.cards.map((c) => (c.id === id ? { ...c, image_url: url } : c)),
          };
          saveToStorage(u);
          return u;
        });
        setFetchingIds((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    },
    [binder, persistBinder]
  );

  const deleteCard = useCallback(
    (id) => {
      persistBinder({
        ...binder,
        cards: binder.cards.filter((c) => c.id !== id),
        last_updated: new Date().toISOString(),
      });
    },
    [binder, persistBinder]
  );

  return { binder, fetchingIds, addCard, updateCard, deleteCard };
}
