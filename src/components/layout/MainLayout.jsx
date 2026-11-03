import { Outlet } from 'react-router';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

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

      <Footer />

    </>
  );
}