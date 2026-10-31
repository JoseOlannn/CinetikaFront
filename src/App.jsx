import { useState } from 'react';
import { Routes, Route } from 'react-router';

import MainLayout from './components/layout/MainLayout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Catalogo from './pages/Catalogo.jsx';
import SearchResults from './pages/SearchResults.jsx';
import EditProfile from './pages/EditProfile.jsx';
import ContentDetail from './pages/ContentDetail.jsx';

import { getCurrentUser, logout } from './services/authService.js';

export default function App() {
  // Rehidratar el usuario desde localStorage si ya había iniciado sesión
  const [usuario, setUsuario] = useState(() => getCurrentUser());

  function handleLogin(usuarioAutenticado) {
    setUsuario(usuarioAutenticado);
  }

  function handleLogout() {
    logout();
    setUsuario(null);
  }

  return (
    <Routes>
      {/* ====================================
          LOGIN
      ==================================== */}
      <Route
        path="/"
        element={
          <Login onLogin={handleLogin} />
        }
      />

      {/* ====================================
          REGISTRO
      ==================================== */}
      <Route
        path="/registro"
        element={<Register onLogin={handleLogin} />}
      />

      {/* ====================================
          PÁGINAS CON NAVBAR
      ==================================== */}
      <Route
        element={
          <MainLayout
            usuario={usuario}
            onLogout={handleLogout}
          />
        }
      >
        {/* CATÁLOGO GENERAL Y POR CATEGORÍA */}
        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        {/* RESULTADOS DE BÚSQUEDA */}
        <Route
          path="/buscar"
          element={<SearchResults />}
        />

        {/* EDITAR PERFIL */}
        <Route
          path="/perfil/editar"
          element={
            <EditProfile
              usuario={usuario}
              onLogout={handleLogout}
            />
          }
        />

        {/* DETALLES DEL AUDIOVISUAL POR ID */}
        <Route
          path="/audiovisual/:id"
          element={<ContentDetail />}
        />
      </Route>
    </Routes>
  );
}
