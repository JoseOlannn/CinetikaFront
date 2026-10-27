const modulos = import.meta.glob("../../assets/Portadas/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const base = Object.values(modulos);
const lista = Array.from({ length: 30 }, (_, i) => base[i % base.length]);

function FondoPortadas() {
  return (
    <div className="fondo" aria-hidden="true">
      {lista.map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" />
      ))}
    </div>
  );
}

export default FondoPortadas;