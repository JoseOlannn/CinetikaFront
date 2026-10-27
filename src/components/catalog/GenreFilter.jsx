
import '../../styles/GenreFilter.css';

export default function GenreFilter({
  genres = [],
  selectedGenre = null,
  onGenreChange,
}) {
  const activeGenre = genres.find(
    (genre) => genre.id === selectedGenre
  );

  return (
    <section className="genre-filter">
      {/* SELECTOR */}
      <div className="genre-filter__select-wrapper">
        <select
          id="catalog-genre"
          className="genre-filter__select"
          aria-label="Seleccionar género"
          value={selectedGenre ?? ''}
          onChange={(event) => {
            const value = event.target.value;

            onGenreChange(
              value === '' ? null : Number(value)
            );
          }}
        >
          <option value="">
            Todos los géneros
          </option>

          {genres.map((genre) => (
            <option
              key={genre.id}
              value={genre.id}
            >
              {genre.nombre}
            </option>
          ))}
        </select>

        <span
          className="genre-filter__chevron"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <path d="m5 9 7 7 7-7" />
          </svg>
        </span>
      </div>

      {/* DESCRIPCIÓN DEL GÉNERO */}
      <div
        className="genre-filter__description"
        aria-live="polite"
      >
        <p>
          {activeGenre
            ? activeGenre.descripcion
            : 'Selecciona un género para explorar los audiovisuales disponibles.'}
        </p>
      </div>
    </section>
  );
}
