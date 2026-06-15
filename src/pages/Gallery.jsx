import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import CardCell from '../components/CardCell';
import CardModal from '../components/CardModal';

const SET_ORDER = [
  'base1','base2','base3','base4','base5',
  'gym1','gym2','neo1','neo2','neo3','neo4',
  'ecard1','ecard2','ecard3',
  'ex1','ex2','ex3','ex4','ex5','ex6','ex7','ex8',
  'ex9','ex10','ex11','ex12','ex13','ex14','ex15','ex16',
  'dp1','dp2','dp3','dp4','dp5','dp6',
  'pl1','pl2','pl3','pl4',
  'hgss1','hgss2','hgss3','hgss4',
  'bw1','bw2','bw3','bw4','bw5','bw6','bw7','bw8','bw9','bw10','bw11',
  'xy1','xy2','xy3','xy4','xy5','xy6','xy7','xy8','xy9','xy10','xy11','xy12',
  'me1','mep',
  'sm1','sm2','sm3','sm4','sm5','sm6','sm7','sm8','sm9','sm10','sm11','sm12',
  'swsh1','swsh2','swsh3','swsh4','swsh5','swsh6','swsh7','swsh8','swsh9','swsh10','swsh11','swsh12',
  'sv1','sv2','sv2a','sv3','sv3pt5','sv3pt5','sv4','sv4pt5','sv5','sv6','sv7','sv8',
  'svp',
];

function sortCards(cards) {
  return [...cards].sort((a, b) => {
    const ai = SET_ORDER.indexOf(a.set_code);
    const bi = SET_ORDER.indexOf(b.set_code);
    const sd = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    if (sd !== 0) return sd;
    return parseInt(a.card_number, 10) - parseInt(b.card_number, 10);
  });
}

export default function Gallery() {
  const { binder, fetchingIds } = useCollection();
  const [activeSet, setActiveSet] = useState('All');
  const [dark, setDark] = useState(() => localStorage.getItem('vault_theme') === 'dark');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('vault_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const setGroups = useMemo(() => {
    const counts = {};
    for (const card of binder.cards) {
      counts[card.set_name] = (counts[card.set_name] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => {
      const ac = binder.cards.find(c => c.set_name === a[0])?.set_code || '';
      const bc = binder.cards.find(c => c.set_name === b[0])?.set_code || '';
      return (SET_ORDER.indexOf(ac) + 1 || 999) - (SET_ORDER.indexOf(bc) + 1 || 999);
    });
  }, [binder.cards]);

  const filteredCards = useMemo(() => {
    const cards = activeSet === 'All'
      ? binder.cards
      : binder.cards.filter(c => c.set_name === activeSet);
    return sortCards(cards);
  }, [binder.cards, activeSet]);

  const openPrev = useCallback(() => setOpenIndex(i => (i > 0 ? i - 1 : i)), []);
  const openNext = useCallback(() => setOpenIndex(i => (i < filteredCards.length - 1 ? i + 1 : i)), [filteredCards.length]);

  const lastUpdated = useMemo(() => {
    const d = new Date(binder.last_updated);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [binder.last_updated]);

  return (
    <div className="binder-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            The Vault
          </p>
        </div>

        <hr className="divider" />

        {/* Set filters */}
        <div>
          <p className="nav-section-label">Sets</p>
          <button
            className={`nav-link${activeSet === 'All' ? ' active' : ''}`}
            onClick={() => setActiveSet('All')}
          >
            All
          </button>
          {setGroups.map(([name, count]) => (
            <button
              key={name}
              className={`nav-link${activeSet === name ? ' active' : ''}`}
              onClick={() => setActiveSet(name)}
            >
              {name} <span style={{ opacity: 0.45, fontWeight: 400 }}>· {count}</span>
            </button>
          ))}
        </div>

        <hr className="divider" />

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          {binder.cards.length} cards
        </p>

        {/* Spacer pushes admin link to bottom */}
        <div style={{ flex: 1 }} />

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button className="theme-toggle" data-on={dark ? 'true' : 'false'} onClick={() => setDark(d => !d)}>
            <span className="toggle-track"><span className="toggle-thumb" /></span>
            {dark ? 'Light' : 'Dark'}
          </button>
          <Link
            to="/admin"
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            Admin
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Card grid */}
        <main style={{ flex: 1 }}>
          {filteredCards.length === 0 ? (
            <div style={{ padding: '4rem 2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No cards yet. <Link to="/admin" style={{ textDecoration: 'underline' }}>Add your first card →</Link>
            </div>
          ) : (
            <div className="card-grid">
              {filteredCards.map((card, i) => (
                <CardCell key={card.id} card={card} isFetching={fetchingIds.has(card.id)} onOpen={() => setOpenIndex(i)} />
              ))}
            </div>
          )}
        </main>

        {openIndex !== null && filteredCards[openIndex]?.image_url && (
          <CardModal
            card={filteredCards[openIndex]}
            onClose={() => setOpenIndex(null)}
            onPrev={openIndex > 0 ? openPrev : null}
            onNext={openIndex < filteredCards.length - 1 ? openNext : null}
          />
        )}

        {/* Footer */}
        <footer style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Last updated {lastUpdated}
          </span>
        </footer>
      </div>
    </div>
  );
}
