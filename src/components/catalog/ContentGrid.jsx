
import ContentCard from './ContentCard.jsx';

export default function ContentGrid({
  items = [],
  onView,
}) {
  if (items.length === 0) {
    return (
      <p className="catalog-empty">
        No hay audiovisuales disponibles
        para este género.
      </p>
    );
  }

  return (
    <div className="catalog-grid">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          onView={onView}
        />
      ))}
    </div>
  );
}
