import { useId } from 'react';

const GENRES = ['Jazz', 'Rock', 'Hip-Hop', 'Soul'];

export default function SidebarFilter({ searchTerm, onSearchChange, selectedGenres, onToggleGenre, onReset }) {
  const searchId = useId();

  return (
    <aside className="shop-sidebar">
      <label htmlFor={searchId} className="sr-only">Search records</label>
      <input
        id={searchId}
        type="search"
        className="search-pill"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="filter-group">
        <h3>Genre / Origin</h3>
        {GENRES.map((genre) => (
          <label key={genre} className="checkbox-row">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => onToggleGenre(genre)}
            />
            <span>{genre}</span>
          </label>
        ))}
      </div>

      {(searchTerm || selectedGenres.length > 0) && (
        <button type="button" className="btn-clear" onClick={onReset}>
          Clear Filters
        </button>
      )}
    </aside>
  );
}