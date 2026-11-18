import { NavLink } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

export default function NavBar() {
  const { records } = useInventory();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand-link" aria-label="VinylCrate home">
        <span className="brand-disc" aria-hidden="true"><span /></span>
        <span className="brand-copy">
          <strong>VINYLCRATE</strong>
          <small>NAIROBI · RECORD STORE</small>
        </span>
      </NavLink>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Shop <span className="badge">{records.length}</span>
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Admin Portal
        </NavLink>
      </nav>
    </header>
  );
}