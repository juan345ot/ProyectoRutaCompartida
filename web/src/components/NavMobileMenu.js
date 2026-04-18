"use client";
import Link from 'next/link';
import { User, LogOut, Sun, Moon } from 'lucide-react';

export default function NavMobileMenu({ 
  isOpen, 
  isAuthenticated, 
  user, 
  logout, 
  theme, 
  toggleTheme 
}) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-2xl pb-4">
      <div className="px-4 py-3 bg-brand-700 border-b border-brand-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white">Menú</span>
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-brand-800 text-white border border-brand-500 shadow-sm"
            title={theme === 'light' ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        {isAuthenticated && (
          <button onClick={logout} className="text-sm font-medium text-red-300 hover:text-red-200 flex items-center gap-1">
            <LogOut className="h-4 w-4"/> Salir
          </button>
        )}
      </div>
      <div className="flex flex-col p-4 gap-2 text-gray-900">
        <Link href="/" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Inicio</Link>
        <Link href="/#que-es" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">¿Qué es?</Link>
        <Link href="/#como-funciona" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">¿Cómo funciona?</Link>
        <Link href="/search" className="px-4 py-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold">Publicaciones</Link>
        
        {isAuthenticated ? (
          <>
            <div className="h-px bg-gray-100 my-2"></div>
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mi Cuenta ({user.name?.split(' ')[0]})</p>
            <Link href="/publish" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-brand-600 font-medium flex items-center gap-2">✚ Publicar Viaje</Link>
            <Link href="/profile" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">Mis Datos</Link>
            <Link href="/my-posts" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">Mis Publicaciones</Link>
            <Link href="/my-bookings" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">Mis Solicitudes</Link>
            <Link href="/history" className="px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700">Rutas Compartidas</Link>

            {(user.role === 'admin' || user.email === 'juanignacio295@gmail.com') && (
              <Link href="/admin" className="px-4 py-3 rounded-xl bg-brand-50 text-brand-700 font-bold mt-2">Panel de Control</Link>
            )}
          </>
        ) : (
          <Link href="/login" className="accent-button justify-center mt-2 mx-2 flex items-center">
            <User className="h-5 w-5 mr-2"/> Iniciar Sesión / Registro
          </Link>
        )}
      </div>
    </div>
  );
}
