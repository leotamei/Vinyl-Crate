import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

export default function HomePage() {
  const { storeInfo, loading } = useInventory();

  if (loading) return <p className="status-msg">Spinning up the crates...</p>;

  return (
    <section className="home-container">
      <div className="home-card">
        <div className="home-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> NAIROBI'S HOME FOR GOOD RECORDS</span>
          <p className="hero-kicker">INDEPENDENT RECORD SHOP <span>·</span> NAIROBI</p>
          <h1>{storeInfo?.name || 'VinylCrate'}<span>Find your next favorite sound.</span></h1>
          <p className="tagline">{storeInfo?.tagline || 'The go-to crate for classic pressings & fresh wax.'}</p>
          <p className="description">{storeInfo?.description}</p>

          <div className="home-actions">
            <Link to="/shop" className="btn-primary">Browse the crates <span aria-hidden="true">↗</span></Link>
            <Link to="/admin" className="btn-secondary">Manage inventory</Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-ring" />
          <div className="hero-record">
            <div className="hero-record-label">
              <strong>VC</strong>
              <span>33⅓ RPM</span>
            </div>
          </div>
          <div className="hero-sticker">GOOD MUSIC<br /><strong>GOOD COMPANY</strong></div>
          <div className="hero-art-caption"><span>THE VINYL EDIT</span><span>01 / NAIROBI</span></div>
        </div>

        <div className="store-meta">
          <div className="store-meta-item">
            <span className="meta-label">FIND THE SHOP</span>
            <strong>{storeInfo?.address}</strong>
          </div>
          <div className="store-meta-item">
            <span className="meta-label">GIVE US A CALL</span>
            <strong>{storeInfo?.phone_number}</strong>
          </div>
          <div className="store-meta-item">
            <span className="meta-label">WHEN WE'RE OPEN</span>
            <strong>{storeInfo?.hours}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}