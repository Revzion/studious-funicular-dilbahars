'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hiddenPaths = ['/login', '/signup' , '/dealer'];
  const hideLayout = hiddenPaths.includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
