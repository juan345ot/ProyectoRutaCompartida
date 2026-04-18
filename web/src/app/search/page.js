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
             <div className="theme-card rounded-2xl p-8 sticky top-24 shadow-xl">
                <div className="flex items-center justify-between mb-8 border-b border-current/10 pb-5">
                   <div className="flex items-center gap-3">
                     <Filter className="h-6 w-6 text-brand-500" />
                     <h2 className="font-black text-xl font-outfit uppercase tracking-tight">Filtros</h2>
                   </div>
                   {(filters.category || filters.type) && (
                     <button onClick={clearFilters} className="text-sm text-brand-600 font-black hover:underline flex items-center gap-1.5">
                       <X className="h-4 w-4" /> Limpiar
                     </button>
                   )}
                </div>
                
                <div className="space-y-8">
                   <div>
                     <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Categoría</h3>
                     <div className="space-y-2">
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="category" 
                           checked={filters.category === ''} 
                           onChange={() => handleFilterChange('category', '')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="text-base font-black uppercase tracking-tight">Todos</span>
                       </label>
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="category" 
                           checked={filters.category === 'passenger'} 
                           onChange={() => handleFilterChange('category', 'passenger')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="flex items-center gap-3 text-base font-black uppercase tracking-tight"><User className="h-5 w-5 text-brand-500"/> Pasajeros</span>
                       </label>
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="category" 
                           checked={filters.category === 'package'} 
                           onChange={() => handleFilterChange('category', 'package')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="flex items-center gap-3 text-base font-black uppercase tracking-tight"><Package className="h-5 w-5 text-brand-500"/> Encomiendas</span>
                       </label>
                     </div>
                   </div>

                   <div>
                     <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Tipo de Viaje</h3>
                     <div className="space-y-2">
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="type" 
                           checked={filters.type === ''} 
                           onChange={() => handleFilterChange('type', '')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="text-base font-black uppercase tracking-tight">Todos</span>
                       </label>
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="type" 
                           checked={filters.type === 'offer'} 
                           onChange={() => handleFilterChange('type', 'offer')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="text-base font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">Ofrecen Lugar</span>
                       </label>
                       <label className="flex items-center gap-4 p-3 hover:bg-brand-500/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-brand-500/10">
                         <input 
                           type="radio" 
                           name="type" 
                           checked={filters.type === 'request'} 
                           onChange={() => handleFilterChange('type', 'request')}
                           className="h-5 w-5 text-brand-600 focus:ring-brand-500" 
                         />
                         <span className="text-base font-black uppercase tracking-tight text-orange-600 dark:text-orange-400">Buscan Enviar</span>
                       </label>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center mb-4">
               <span className="font-black theme-text opacity-60 text-base uppercase tracking-widest">{posts.length} viajes encontrados</span>
               <select className="theme-card border border-current/10 theme-text font-black uppercase tracking-widest cursor-pointer rounded-2xl px-6 py-3 text-xs focus:ring-0 shadow-lg">
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
                 <SearchPostCard 
                   key={post._id} 
                   post={post} 
                   apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                 />
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
