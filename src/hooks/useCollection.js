import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { SEED_CARDS } from '../data/seed';

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

async function fetchMissingImages(cards, setBinder, setFetchingIds) {
  const missing = cards.filter(c => !c.image_url);
  if (missing.length === 0) return;

  setFetchingIds(new Set(missing.map(c => c.id)));

  missing.forEach(async (card) => {
    const url = await fetchCardImage(card);
    if (url) {
      await supabase.from('cards').update({ image_url: url }).eq('id', card.id);
      setBinder(prev => ({
        ...prev,
        cards: prev.cards.map(c => c.id === card.id ? { ...c, image_url: url } : c),
      }));
    }
    setFetchingIds(prev => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
  });
}

export function useCollection() {
  const [binder, setBinder] = useState({ cards: [], last_updated: new Date().toISOString() });
  const [fetchingIds, setFetchingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const initRan = useRef(false);

  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    async function init() {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('added_at', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        setLoading(false);
        return;
      }

      if (data.length === 0) {
        // First time — seed the database
        const { error: insertError } = await supabase.from('cards').insert(SEED_CARDS);
        if (!insertError) {
          setBinder({ cards: SEED_CARDS, last_updated: new Date().toISOString() });
          fetchMissingImages(SEED_CARDS, setBinder, setFetchingIds);
        }
      } else {
        setBinder({ cards: data, last_updated: data[data.length - 1]?.added_at || new Date().toISOString() });
        fetchMissingImages(data, setBinder, setFetchingIds);
      }

      setLoading(false);
    }

    init();
  }, []);

  const addCard = useCallback(async (cardData) => {
    const id = cardData.id || `${cardData.set_code}-${cardData.card_number}-${Date.now()}`;
    const newCard = {
      ...cardData,
      id,
      image_url: cardData.image_url || '',
      added_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('cards').insert(newCard);
    if (error) { console.error(error); return; }

    setBinder(prev => ({
      ...prev,
      cards: [...prev.cards, newCard],
      last_updated: new Date().toISOString(),
    }));

    if (!newCard.image_url) {
      setFetchingIds(prev => new Set([...prev, id]));
      const url = await fetchCardImage(newCard);
      if (url) {
        await supabase.from('cards').update({ image_url: url }).eq('id', id);
        setBinder(prev => ({
          ...prev,
          cards: prev.cards.map(c => c.id === id ? { ...c, image_url: url } : c),
        }));
      }
      setFetchingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }, []);

  const updateCard = useCallback(async (id, cardData) => {
    const updated = {
      ...cardData,
      id,
      image_url: cardData.image_url || '',
      added_at: cardData.added_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('cards').update(updated).eq('id', id);
    if (error) { console.error(error); return; }

    setBinder(prev => ({
      ...prev,
      cards: prev.cards.map(c => c.id === id ? updated : c),
      last_updated: new Date().toISOString(),
    }));

    if (!updated.image_url) {
      setFetchingIds(prev => new Set([...prev, id]));
      const url = await fetchCardImage(updated);
      if (url) {
        await supabase.from('cards').update({ image_url: url }).eq('id', id);
        setBinder(prev => ({
          ...prev,
          cards: prev.cards.map(c => c.id === id ? { ...c, image_url: url } : c),
        }));
      }
      setFetchingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  }, []);

  const deleteCard = useCallback(async (id) => {
    await supabase.from('cards').delete().eq('id', id);
    setBinder(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== id),
      last_updated: new Date().toISOString(),
    }));
  }, []);

  return { binder, fetchingIds, loading, addCard, updateCard, deleteCard };
}
