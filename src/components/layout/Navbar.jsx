
import { useEffect, useRef, useState } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router';

import Input from '../ui/Input.jsx';
import '../../styles/Navbar.css';

// ====================================
// RUTAS DE NAVEGACIÓN
// ====================================

const navigation = [
  {
    label: 'Inicio',
    to: '/catalogo',
    tipo: null,
  },
  {
    label: 'Películas',
    to: '/catalogo?tipo=pelicula',
    tipo: 'pelicula',
  },
  {
    label: 'Series',
    to: '/catalogo?tipo=serie',
    tipo: 'serie',
  },
  {
    label: 'Cortometrajes',
    to: '/catalogo?tipo=cortometraje',
    tipo: 'cortometraje',
  },
];

const DEFAULT_AVATAR = '/images/default-avatar.png';

// ====================================
// NAVBAR PRINCIPAL
// ====================================

// La key reinicia los estados internos al cambiar la ruta.
// Así evitamos usar setState directamente dentro de un useEffect.

export default function Navbar({
  usuario = null,
  onLogout,
}) {
  const location = useLocation();

  return (
    <NavbarContent
      key={`${location.pathname}${location.search}`}
      usuario={usuario}
      onLogout={onLogout}
    />
  );
}

// ====================================
// CONTENIDO DEL NAVBAR
// ====================================

function NavbarContent({ usuario, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados de los menús
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Texto del buscador
  const [search, setSearch] = useState(() => {
    if (location.pathname !== '/buscar') {
      return '';
    }

    return (
      new URLSearchParams(location.search).get('q') || ''
    );
  });

  // Referencias para cerrar menús al hacer clic fuera
  const navbarRef = useRef(null);
  const profileRef = useRef(null);

  // Tipo de audiovisual seleccionado
  const tipoActual = new URLSearchParams(
    location.search
  ).get('tipo');

  // Avatar del usuario
  const avatarUrl =
    usuario?.foto_perfil || DEFAULT_AVATAR;

  // ====================================
  // DETECTAR ENLACE ACTIVO
  // ====================================

  function isSelected(item) {
    // En búsqueda no se selecciona ninguna categoría
    if (location.pathname !== '/catalogo') {
      return false;
    }

    // Inicio muestra todos los audiovisuales
    if (item.tipo === null) {
      return tipoActual === null;
    }

    // Las otras opciones dependen del tipo
    return tipoActual === item.tipo;
  }

  // ====================================
  // CERRAR MENÚS
  // ====================================

  useEffect(() => {
    function handlePointerDown(event) {
      // Cerrar perfil al hacer clic fuera
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      // Cerrar navegación y búsqueda al hacer clic fuera
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    );

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  // ====================================
  // BÚSQUEDA
  // ====================================

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    const params = new URLSearchParams({
      q: query,
    });

    navigate(`/buscar?${params.toString()}`);

    setMobileOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  }

  // ====================================
  // CERRAR SESIÓN SIMULADA
  // ====================================

  function handleLogout() {
    // Limpia el usuario guardado en App.jsx
    onLogout?.();

    setProfileOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);

    // Regresar al Login
    navigate('/');
  }

  // ====================================
  // RENDERIZADO
  // ====================================

  return (
    <header className="navbar" ref={navbarRef}>
      <div className="navbar__container">

        {/* MENÚ HAMBURGUESA */}
        <button
          type="button"
          className="navbar__hamburger"
          aria-label={
            mobileOpen ? 'Cerrar menú' : 'Abrir menú'
          }
          aria-expanded={mobileOpen}
          aria-controls="navbar-navigation"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setSearchOpen(false);
            setProfileOpen(false);
          }}
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>

        {/* LOGO */}
        <NavLink
          to="/catalogo"
          className="navbar__logo"
          aria-label="Cinetika - Inicio"
        >
          <img
            src="/images/logo.png"
            alt="Cinetika"
          />
        </NavLink>

        {/* BUSCADOR GLOBAL */}
        <form
          id="navbar-search"
          className={`navbar__search ${
            searchOpen ? 'navbar__search--open' : ''
          }`}
          role="search"
          onSubmit={handleSearch}
        >
          <Input
            type="search"
            name="search"
            placeholder="Buscar"
            aria-label="Buscar películas, series o cortometrajes"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            clearable
          />
        </form>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav
          id="navbar-navigation"
          className={`navbar__links ${
            mobileOpen ? 'navbar__links--open' : ''
          }`}
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={`navbar__link ${
                isSelected(item)
                  ? 'navbar__link--active'
                  : ''
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ACCIONES DERECHAS */}
        <div className="navbar__actions">

          {/* LUPA PARA CELULARES */}
          <button
            type="button"
            className="navbar__search-toggle"
            aria-label={
              searchOpen
                ? 'Cerrar búsqueda'
                : 'Abrir búsqueda'
            }
            aria-expanded={searchOpen}
            aria-controls="navbar-search"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMobileOpen(false);
              setProfileOpen(false);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="7.2"
              />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          {/* PERFIL */}
          <div
            className="navbar__profile"
            ref={profileRef}
          >
            <button
              type="button"
              className="navbar__profile-button"
              aria-label="Mi perfil"
              aria-expanded={profileOpen}
              aria-controls={
                profileOpen
                  ? 'navbar-profile-menu'
                  : undefined
              }
              onClick={() => {
                setProfileOpen(!profileOpen);
                setMobileOpen(false);
                setSearchOpen(false);
              }}
            >
              {/* AVATAR */}
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt=""
                className="navbar__avatar"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    DEFAULT_AVATAR;
                }}
              />

              <span className="navbar__profile-label">
                Mi perfil
              </span>

              <span
                className={`navbar__arrow ${
                  profileOpen
                    ? 'navbar__arrow--open'
                    : ''
                }`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {/* MENÚ DESPLEGABLE */}
            {profileOpen && (
              <div
                id="navbar-profile-menu"
                className="navbar__profile-menu"
              >
                {/*Editar perfil */}
                <button
                  type="button"
                  className="navbar__profile-option"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/perfil/editar');
                  }}
                >
                  Editar perfil
                </button>

                {/* CERRAR SESIÓN */}
                <button
                  type="button"
                  className="navbar__profile-option"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
