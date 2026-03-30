"use client";
import { useState, useContext, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Search, MapPin, Calendar, Filter, User, Package, X } from 'lucide-react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import SearchPostCard from '@/components/SearchPostCard';
import SearchPostCardSkeleton from '@/components/SearchPostCardSkeleton';
import toast from 'react-hot-toast';

// Mock Data para visualizar antes de conectar la API
const MOCK_POSTS = [
  {
    _id: "1",
    type: "offer",
    category: "passenger",
    origin: "Bahía Blanca, Centro",
    destination: "Olavarría",
    departureDate: "2026-02-28T14:00:00.000Z",
    capacity: "2 personas",
    description: "Viajo por negocios, auto muy cómodo (Peugeot 208). Puedo desviar por la ruta 51.",
    author: { name: "Juan Ignacio", phone: "542911234567" },
    status: "active"
  },
  {
    _id: "2",
    type: "request",
    category: "package",
    origin: "Capital Federal (Retiro)",
    destination: "Bahía Blanca",
    departureDate: "2026-03-01T09:00:00.000Z",
    capacity: "Caja mediana (5kg)",
    description: "Necesito que me traigan unos repuestos urgentes.",
    author: { name: "María González", phone: "541165432100" },
    status: "active"
  },
  {
    _id: "3",
    type: "offer",
    category: "package",
    origin: "Rosario",
    destination: "Córdoba",
    departureDate: "2026-03-02T08:30:00.000Z",
    capacity: "Hasta 20kg",
    description: "Voy en camioneta vacía, tengo mucho lugar para encomiendas o muebles chicos.",
    author: { name: "Carlos Transporte", phone: "543419876543" },
    status: "active"
  }
];

export default function SearchPage() {
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    category: '', // passenger, package, empty
    type: '' // offer, request
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);

  const fetchPosts = useCallback(async (searchFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.origin) params.append('origin', searchFilters.origin);
      if (searchFilters.destination) params.append('destination', searchFilters.destination);
      if (searchFilters.date) params.append('date', searchFilters.date);
      if (searchFilters.category) params.append('category', searchFilters.category);
      if (searchFilters.type) params.append('type', searchFilters.type);

      const res = await api.get(`/posts?${params.toString()}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      toast.error('No se pudieron cargar los viajes. Intenta de nuevo.');
      if (process.env.NODE_ENV === 'development') setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ origin: '', destination: '', date: '', category: '', type: '' });
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Search Header */}
      <div className="bg-brand-900 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white font-outfit mb-8">Tablón de Viajes</h1>
          
          <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-xl">
             <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Origen" 
                  value={filters.origin}
                  onChange={(e) => handleFilterChange('origin', e.target.value)}
                  className="pl-10 w-full rounded-xl border border-gray-200 py-3 focus:ring-brand-500 text-gray-800 bg-white" 
                />
             </div>
             <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Destino" 
                  value={filters.destination}
                  onChange={(e) => handleFilterChange('destination', e.target.value)}
                  className="pl-10 w-full rounded-xl border border-gray-200 py-3 focus:ring-brand-500 text-gray-800 bg-white" 
                />
             </div>
             <div className="flex-1 relative hidden md:block">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="date" 
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="pl-10 w-full rounded-xl border border-gray-200 py-3 focus:ring-brand-500 text-gray-600 bg-white" 
                />
             </div>
             <button 
               onClick={() => fetchPosts()}
               className="accent-button md:px-8"
             >
               <Search className="h-5 w-5 mr-2" /> Buscar
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
             <div className="theme-card rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6 border-b border-current/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <h2 className="font-bold text-lg font-outfit">Filtros</h2>
                  </div>
                  {(filters.category || filters.type) && (
                    <button onClick={clearFilters} className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1">
                      <X className="h-3 w-3" /> Limpiar
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">Categoría</h3>
                    <div className="space-y-1">
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={filters.category === ''} 
                          onChange={() => handleFilterChange('category', '')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm font-medium">Todos</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={filters.category === 'passenger'} 
                          onChange={() => handleFilterChange('category', 'passenger')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="flex items-center gap-2 text-sm font-medium"><User className="h-4 w-4"/> Pasajeros</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={filters.category === 'package'} 
                          onChange={() => handleFilterChange('category', 'package')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="flex items-center gap-2 text-sm font-medium"><Package className="h-4 w-4"/> Encomiendas</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">Tipo</h3>
                    <div className="space-y-1">
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="type" 
                          checked={filters.type === ''} 
                          onChange={() => handleFilterChange('type', '')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm font-medium">Todos</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="type" 
                          checked={filters.type === 'offer'} 
                          onChange={() => handleFilterChange('type', 'offer')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm font-medium">Ofrecen Lugar</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="radio" 
                          name="type" 
                          checked={filters.type === 'request'} 
                          onChange={() => handleFilterChange('type', 'request')}
                          className="text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm font-medium">Buscan Enviar</span>
                      </label>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex justify-between items-center mb-2">
               <span className="font-semibold text-gray-600 dark:text-gray-300 text-sm">{posts.length} viajes encontrados</span>
               <select className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium focus:ring-0 cursor-pointer rounded-lg px-3 py-1.5 text-sm">
                  <option>Más recientes</option>
                  <option>Próximos a salir</option>
               </select>
            </div>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SearchPostCardSkeleton key={`skeleton-${i}`} />)
            ) : posts.length === 0 ? (
              <div className="theme-card rounded-3xl p-10 text-center">
                <h3 className="text-xl font-bold mb-2">No se encontraron viajes</h3>
                <p className="opacity-70">Intenta buscar con otros filtros o anímate a publicar el primero.</p>
              </div>
            ) : (
              posts.map((post, idx) => (
                 <SearchPostCard key={post._id} post={post} isAuthenticated={isAuthenticated} user={user} idx={idx} />
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
