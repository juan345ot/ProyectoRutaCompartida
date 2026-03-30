"use client";
import Link from 'next/link';
import { useState, useContext, useEffect, useRef } from 'react';
import { Menu, X, Route, User, ChevronDown } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';
import NavProfileDropdown from './NavProfileDropdown';
import NavMobileMenu from './NavMobileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus when navigating to a new route.
  useEffect(() => {
    /* eslint-disable-next-line react-compiler */
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);


  return (
    <nav className="fixed w-full bg-brand-600 text-white backdrop-blur-md border-b border-brand-700 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Route className="h-8 w-8 text-white" />
              <span className="font-outfit font-bold text-xl tracking-tight text-white">
                Ruta Compartida
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/" className="bg-white text-brand-600 hover:bg-brand-50 font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
              Inicio
            </Link>
            <Link href="/#que-es" className="bg-white text-brand-600 hover:bg-brand-50 font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
              ¿Qué es?
            </Link>
            <Link href="/#como-funciona" className="bg-white text-brand-600 hover:bg-brand-50 font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
              ¿Cómo funciona?
            </Link>
            <Link href="/search" className="bg-white text-brand-600 hover:bg-brand-50 font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm">
              Publicaciones
            </Link>
            
            {isAuthenticated ? (
                <div className="relative flex items-center gap-4" ref={dropdownRef}>
                  <Link href="/publish" className="bg-brand-400 hover:bg-brand-300 text-white font-semibold px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
                     + Publicar
                  </Link>
                  
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-brand-800 text-white hover:bg-brand-900 px-4 py-2 rounded-full font-semibold transition-all border border-brand-500"
                  >
                     <User className="h-4 w-4" />
                     <span className="max-w-[120px] truncate">{user.name?.split(' ')[0]}</span>
                     <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <NavProfileDropdown 
                    isOpen={isProfileOpen} 
                    user={user} 
                    logout={logout} 
                  />
               </div>
            ) : (
                <div className="flex items-center gap-4 ml-4">
                  <Link href="/login" className="bg-accent-500 text-white hover:bg-accent-600 px-5 py-2 rounded-full font-semibold transition-all shadow-md flex items-center">
                     <User className="h-4 w-4 mr-2" /> Iniciar Sesión
                  </Link>
                </div>
            )}
            
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            {isAuthenticated && !isMenuOpen && (
               <div className="h-8 w-8 rounded-full bg-brand-800 flex items-center justify-center text-white font-bold border border-brand-500">
                  {user.name?.charAt(0).toUpperCase()}
               </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-brand-100 focus:outline-none bg-brand-700 hover:bg-brand-800 p-2 rounded-lg transition-colors border border-brand-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <NavMobileMenu 
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </nav>
  );
}
