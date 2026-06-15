import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import VariantBadge from '../components/VariantBadge';

const SESSION_KEY = 'binder_admin_auth';
const CORRECT_PW = 'SCOUT996';

function PasswordGate({ onAuth }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (value === CORRECT_PW) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 320, padding: '0 1.5rem' }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Arun's Binder — Admin
        </p>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false); }}
          placeholder="Password"
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            fontSize: '0.85rem',
            background: 'white',
            border: `1px solid ${error ? '#e53e3e' : 'var(--border)'}`,
            borderRadius: 6,
            outline: 'none',
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
          }}
        />
        {error && (
          <p style={{ fontSize: '0.75rem', color: '#e53e3e', marginTop: '0.5rem' }}>
            Incorrect password.
          </p>
        )}
        <button type="submit" style={{
          marginTop: '0.75rem',
          width: '100%',
          padding: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          background: 'var(--text-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          Enter
        </button>
      </form>
    </div>
  );
}

const VARIANTS = [
  'Normal',
  'Holo',
  'Reverse Holo',
  'Full Art',
  'Special Art Rare',
  'Illustration Rare',
  'Promo',
  'Promo Full Art',
  'Non-Holo',
  'Holo Rare',
  'Full Art Special',
  'Double Rare (Holo Foil)',
  'Uncommon',
];

const EMPTY_FORM = {
  name: '',
  set_name: '',
  set_code: '',
  card_number: '',
  display_number: '',
  language: 'English',
  variant: 'Holo Rare',
  image_url: '',
};

function CardForm({ initial = EMPTY_FORM, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.set_name || !form.set_code || !form.card_number) return;
    onSave({ ...form, display_number: form.display_number || form.card_number });
  };

  const inputClass =
    'w-full bg-bg border border-border rounded-lg px-3 py-2 text-text-1 font-body text-sm placeholder:text-text-2 focus:outline-none focus:border-accent transition-colors';
  const labelClass = 'block text-text-2 font-body text-xs font-medium mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-xl font-bold text-text-1">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Charizard" required />
        </div>
        <div>
          <label className={labelClass}>Set Name *</label>
          <input className={inputClass} value={form.set_name} onChange={set('set_name')} placeholder="Base Set" required />
        </div>
        <div>
          <label className={labelClass}>Set Code *</label>
          <input className={inputClass} value={form.set_code} onChange={set('set_code')} placeholder="base1" required />
        </div>
        <div>
          <label className={labelClass}>Card Number *</label>
          <input className={inputClass} value={form.card_number} onChange={set('card_number')} placeholder="4" required />
        </div>
        <div>
          <label className={labelClass}>Display Number (e.g. 4/102)</label>
          <input className={inputClass} value={form.display_number} onChange={set('display_number')} placeholder="4/102" />
        </div>
        <div>
          <label className={labelClass}>Variant</label>
          <select className={inputClass} value={form.variant} onChange={set('variant')}>
            {VARIANTS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Language</label>
          <div className="flex gap-2 mt-1">
            {['English', 'Japanese'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setForm((f) => ({ ...f, language: lang }))}
                className={`flex-1 py-2 rounded-lg text-sm font-body font-medium border transition-colors ${
                  form.language === lang
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-bg border-border text-text-2 hover:border-text-2'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Image URL override (optional)</label>
          <input className={inputClass} value={form.image_url} onChange={set('image_url')} placeholder="https://..." />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-accent text-white font-body font-medium text-sm rounded-lg hover:bg-accent/80 transition-colors"
        >
          Save Card
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-surface border border-border text-text-2 font-body text-sm rounded-lg hover:text-text-1 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function AdminPanel() {
  const { binder, fetchingIds, addCard, updateCard, deleteCard } = useCollection();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = async (formData) => {
    await addCard(formData);
    setShowAdd(false);
    navigate('/');
  };

  const handleUpdate = async (formData) => {
    await updateCard(editingId, formData);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this card?')) deleteCard(id);
  };

  const editingCard = binder.cards.find((c) => c.id === editingId);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-1">Admin Panel</h1>
            <p className="text-text-2 text-sm font-body mt-0.5">Manage your collection</p>
          </div>
          <a
            href="/"
            className="text-text-2 text-sm font-body hover:text-text-1 transition-colors"
          >
            ← Back to Gallery
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Add card section */}
        {!editingId && (
          <section className="bg-surface border border-border rounded-xl p-6">
            {showAdd ? (
              <CardForm
                title="Add New Card"
                onSave={handleAdd}
                onCancel={() => setShowAdd(false)}
              />
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-medium text-sm rounded-lg hover:bg-accent/80 transition-colors"
              >
                <span className="text-lg leading-none">+</span> Add Card
              </button>
            )}
          </section>
        )}

        {/* Edit card section */}
        {editingId && editingCard && (
          <section className="bg-surface border border-accent/30 rounded-xl p-6">
            <CardForm
              title={`Editing: ${editingCard.name}`}
              initial={editingCard}
              onSave={handleUpdate}
              onCancel={() => setEditingId(null)}
            />
          </section>
        )}

        {/* Card table */}
        <section>
          <h2 className="font-display text-lg font-bold text-text-1 mb-4">
            Collection ({binder.cards.length} cards)
          </h2>
          {binder.cards.length === 0 ? (
            <p className="text-text-2 font-body text-sm">No cards yet.</p>
          ) : (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-text-2 font-medium px-4 py-3">Card</th>
                      <th className="text-left text-text-2 font-medium px-4 py-3 hidden sm:table-cell">Set</th>
                      <th className="text-left text-text-2 font-medium px-4 py-3 hidden md:table-cell">Variant</th>
                      <th className="text-left text-text-2 font-medium px-4 py-3 hidden md:table-cell">Lang</th>
                      <th className="text-right text-text-2 font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binder.cards.map((card, i) => (
                      <tr
                        key={card.id}
                        className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg/30'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-11 flex-shrink-0 rounded overflow-hidden bg-bg border border-border relative">
                              {fetchingIds.has(card.id) ? (
                                <div className="absolute inset-0 card-image-shimmer" />
                              ) : card.image_url ? (
                                <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-2 text-xs">?</div>
                              )}
                            </div>
                            <div>
                              <p className="text-text-1 font-medium">{card.name}</p>
                              <p className="font-mono text-text-2 text-xs">{card.display_number || card.card_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-2 hidden sm:table-cell">{card.set_name}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <VariantBadge variant={card.variant} />
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="font-mono text-text-2 text-xs">
                            {card.language === 'Japanese' ? 'JPN' : 'ENG'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => { setEditingId(card.id); setShowAdd(false); }}
                              className="px-3 py-1 text-xs font-medium bg-bg border border-border text-text-2 rounded hover:text-text-1 hover:border-text-2 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="px-3 py-1 text-xs font-medium bg-bg border border-accent/30 text-accent/70 rounded hover:text-accent hover:border-accent transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  return <AdminPanel />;
}
