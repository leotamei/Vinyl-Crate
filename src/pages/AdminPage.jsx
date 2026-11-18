import { useState, useId, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const VALID_GENRES = ['Jazz', 'Rock', 'Hip-Hop', 'Soul'];

export default function AdminPage() {
  const { addRecord } = useInventory();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const nameId = useId();
  const descId = useId();
  const originId = useId();
  const priceId = useId();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    origin: '',
    price: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Album name is required.';
    if (!formData.description.trim()) nextErrors.description = 'Artist & condition details are required.';
    if (!VALID_GENRES.includes(formData.origin)) {
      nextErrors.origin = 'Select or enter a valid genre: Jazz, Rock, Hip-Hop, or Soul.';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      nextErrors.price = 'Price must be greater than $0.00.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      nameInputRef.current?.focus();
      return;
    }
    await addRecord(formData);
    navigate('/shop');
  };

  return (
    <section className="admin-wrapper">
      <form className="admin-card" onSubmit={handleSubmit} noValidate>
        <h2>Add New Vinyl Pressing</h2>

        <div className="field-group">
          <label htmlFor={nameId}>Album Name</label>
          <input
            ref={nameInputRef}
            id={nameId}
            type="text"
            placeholder="e.g., Blue Train"
            className={errors.name ? 'input-error' : ''}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <small className={errors.name ? 'error-text' : 'assistive-text'}>
            {errors.name || 'Official album or EP release title'}
          </small>
        </div>

        <div className="field-group">
          <label htmlFor={descId}>Artist & Condition Description</label>
          <input
            id={descId}
            type="text"
            placeholder="e.g., John Coltrane • Near Mint (NM) — 180g reissue"
            className={errors.description ? 'input-error' : ''}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <small className={errors.description ? 'error-text' : 'assistive-text'}>
            {errors.description || 'Include artist name, Goldmine sleeve/media grade, and pressing notes'}
          </small>
        </div>

        <div className="field-group">
          <label htmlFor={originId}>Genre / Origin</label>
          <select
            id={originId}
            className={errors.origin ? 'input-error' : ''}
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          >
            <option value="">Select genre crate...</option>
            {VALID_GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <small className={errors.origin ? 'error-text' : 'assistive-text'}>
            {errors.origin || 'Assigns record to a crate filter in the Shop sidebar'}
          </small>
        </div>

        <div className="field-group">
          <label htmlFor={priceId}>Price ($)</label>
          <input
            id={priceId}
            type="number"
            step="0.01"
            placeholder="29.99"
            className={errors.price ? 'input-error' : ''}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <small className={errors.price ? 'error-text' : 'assistive-text'}>
            {errors.price || 'Retail sticker price in USD'}
          </small>
        </div>

        <button type="submit" className="btn-submit">Submit</button>
      </form>
    </section>
  );
}