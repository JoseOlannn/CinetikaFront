import { Routes, Route, Navigate, useLocation } from 'react-router';
import Home from './pages/Home.jsx';
import Catalogo from './pages/Catalogo.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </>
  )
}
