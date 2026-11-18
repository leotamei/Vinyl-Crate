import { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import SidebarFilter from '../components/SidebarFilter';
import RecordCard from '../components/RecordCard';
import RecordDetailModal from '../components/RecordDetailModal';

export default function ShopPage() {
  const { records, loading, error } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeRecord, setActiveRecord] = useState(null);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesQuery =
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        selectedGenres.length === 0 || selectedGenres.includes(rec.origin);
      return matchesQuery && matchesGenre;
    });
  }, [records, searchTerm, selectedGenres]);

  if (loading) return <p className="status-msg">Loading records...</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;

  return (
    <div className="shop-layout">
      <SidebarFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGenres={selectedGenres}
        onToggleGenre={toggleGenre}
        onReset={() => {
          setSearchTerm('');
          setSelectedGenres([]);
        }}
      />

      <section className="shop-grid-wrapper">
        <div className="shop-heading">
          <div>
            <span className="section-kicker">CURATED IN NAIROBI</span>
            <h1>Find your next spin</h1>
          </div>
          <p>{filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'} in the crate</p>
        </div>
        <div className="shop-grid">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onSelect={() => setActiveRecord(record)}
            />
          ))}
        </div>
        {filteredRecords.length === 0 && (
          <p className="empty-state">No vinyl records match your current crate filters.</p>
        )}
      </section>

      {activeRecord && (
        <RecordDetailModal
          record={activeRecord}
          onClose={() => setActiveRecord(null)}
        />
      )}
    </div>
  );
}