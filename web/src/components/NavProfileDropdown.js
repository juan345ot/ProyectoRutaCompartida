"use client";
import Link from 'next/link';
import { Settings, List, Map, Star, LogOut } from 'lucide-react';

export default function NavProfileDropdown({ user, logout, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      <div className="p-2">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">
          <Settings className="h-4 w-4" /> Mis Datos
        </Link>
        <Link href="/my-posts" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">
          <List className="h-4 w-4" /> Mis Publicaciones
        </Link>
        <Link href="/history" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">
          <Map className="h-4 w-4" /> Rutas Compartidas
        </Link>
        <Link href="/reviews" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-xl transition-colors">
          <Star className="h-4 w-4" /> Mis Opiniones
        </Link>
        {user.email === 'juanignacio295@gmail.com' && (
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors font-bold mt-1">
            <Settings className="h-4 w-4" /> Panel de Control
          </Link>
        )}
      </div>
      <div className="p-2 border-t border-gray-50">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="h-4 w-4" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
