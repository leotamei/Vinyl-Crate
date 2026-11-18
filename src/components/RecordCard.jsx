export default function RecordCard({ record, onSelect }) {
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(record.price));

  return (
    <article className="record-card" onClick={onSelect} role="button" tabIndex={0}>
      <div className="vinyl-disc-preview" aria-hidden="true">
        <div className="vinyl-label">{record.origin}</div>
      </div>
      <h2 className="record-title">{record.name}</h2>
      <p className="record-desc">{record.description}</p>
      <span className="record-origin">{record.origin}</span>
      <strong className="record-price">KSh {formattedPrice}</strong>
    </article>
  );
}