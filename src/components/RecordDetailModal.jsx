import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

export default function RecordDetailModal({ record, onClose }) {
  const { updateRecord, deleteRecord } = useInventory();
  const [price, setPrice] = useState(record.price);
  const [description, setDescription] = useState(record.description);
  const [origin, setOrigin] = useState(record.origin);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateRecord(record.id, {
      price: Number(price),
      description,
      origin,
    });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    await deleteRecord(record.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        <h2>Edit Record: {record.name}</h2>

        <form onSubmit={handleSave} className="modal-form">
          <label>
            Genre / Origin
            <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
              <option value="Jazz">Jazz</option>
              <option value="Rock">Rock</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Soul">Soul</option>
            </select>
          </label>

          <label>
            Artist & Condition Description
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label>
            Price ($)
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Delete Record
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}