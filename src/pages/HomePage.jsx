import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

export default function HomePage() {
  const { storeInfo, loading } = useInventory();

  if (loading) return <p className="status-msg">Spinning up the crates...</p>;

  return (
    <section className="home-container">
      <div className="home-card">
        <span className="eyebrow">Est. 1998 • Local Record Exchange</span>
        <h1>{storeInfo?.name || 'VinylCrate'}</h1>
        <p className="tagline">{storeInfo?.tagline}</p>
        <p className="description">{storeInfo?.description}</p>

        <div className="store-meta">
          <span>📍 {storeInfo?.address}</span>
          <span>📞 {storeInfo?.phone_number}</span>
          <span>🕒 {storeInfo?.hours}</span>
        </div>

        <div className="home-actions">
          <Link to="/shop" className="btn-primary">Browse the Crates</Link>
          <Link to="/admin" className="btn-secondary">Admin Inventory Portal</Link>
        </div>
      </div>
    </section>
  );
}