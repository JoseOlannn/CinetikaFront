import { Routes, Route, Navigate } from 'react-router';

import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Catalogo from './pages/Catalogo.jsx';
import SearchResults from './pages/SearchResults.jsx';

export default function App() {
  return (
    <Routes>
      {/* Redirección temporal hasta tener Login */}
      <Route
        path="/"
        element={<Navigate to="/inicio" replace />}
      />

      <Route element={<MainLayout />}>
        <Route path="/inicio" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/buscar" element={<SearchResults />} />
      </Route>
    </Routes>
  );
}