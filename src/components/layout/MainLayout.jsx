
import { Outlet } from 'react-router';
import Navbar from './Navbar.jsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
