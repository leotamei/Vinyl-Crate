import { NavLink } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

export default function NavBar() {
  const { records } = useInventory();

  return (
    <header className="navbar">
      <div className="nav-slot nav-left">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
      </div>

      <div className="nav-slot nav-center">
        <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Shop <span className="badge">{records.length}</span>
        </NavLink>
      </div>

      <div className="nav-slot nav-right">
        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Admin Portal
        </NavLink>
      </div>
    </header>
  );
}