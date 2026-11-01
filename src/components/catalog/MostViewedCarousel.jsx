
import { useRef } from 'react';

import '../../styles/MostViewedCarousel.css';
import Button from '../ui/Button';

export default function MostViewedCarousel({
    items = [],
    onView,
}) {
    const carouselRef = useRef(null);

    function handleScroll(direction) {
        if (!carouselRef.current) return;

        carouselRef.current.scrollBy({
            left: direction * carouselRef.current.clientWidth * 0.8,
            behavior: 'smooth',
        });
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <section
            className="most-viewed"
            aria-labelledby="most-viewed-title"
        >
            <div className="most-viewed__header">
                <div>
                    <h2
                        className="most-viewed__title"
                        id="most-viewed-title"
                    >
                        Los más vistos
                    </h2>

                    <p className="most-viewed__subtitle">
                        Descubre los audiovisuales del Top 10
                    </p>
                </div>

                <div className="most-viewed__controls">
                    <button
                        type="button"
                        className="most-viewed__arrow"
                        onClick={() => handleScroll(-1)}
                        aria-label="Ver contenidos anteriores"
                    >
                        &#8249;
                    </button>

                    <button
                        type="button"
                        className="most-viewed__arrow"
                        onClick={() => handleScroll(1)}
                        aria-label="Ver contenidos siguientes"
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            <p className="most-viewed__notice">
                Ranking de demostración con visualizaciones simuladas.
            </p>

            <div
                className="most-viewed__track"
                ref={carouselRef}
                role="list"
                aria-label="Top 10 de audiovisuales"
            >
                {items.map((item, index) => (
                    <article
                        className="most-viewed__item"
                        key={item.id}
                        role="listitem"
                    >
                        <span
                            className="most-viewed__rank"
                            aria-label={`Posición ${index + 1}`}
                        >
                            {index + 1}
                        </span>

                        <div className="most-viewed__poster-wrapper">
                            <img
                                className="most-viewed__poster"
                                src={item.poster}
                                alt={`Póster de ${item.nombre}`}
                                loading="lazy"
                            />

                            <div className="most-viewed__overlay">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon="play"
                                    onClick={() => onView?.(item)}
                                >
                                    Ver
                                </Button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
