import { Outlet } from 'react-router';
import Navbar from './Navbar.jsx';

export default function MainLayout({
  usuario = null,
  onLogout,
}) {
  return (
    <>
      <Navbar
        usuario={usuario}
        onLogout={onLogout}
      />

      <main>
        <Outlet />
      </main>
    </>
  );
}