"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { List, MapPin, Calendar, Users, Package, Eye, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MyPostsPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchMyPosts = async () => {
        try {
            const res = await api.get('/users/me/posts');
            setPosts(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar tus publicaciones');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isAuthenticated) fetchMyPosts();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
      if(!confirm('¿Estás seguro de eliminar esta publicación?')) return;
      try {
          await api.delete(`/posts/${id}`);
          setPosts(posts.filter(p => p._id !== id));
          toast.success('Publicación eliminada');
      } catch (error) {
          toast.error('Error al eliminar');
      }
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen theme-bg py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-600">
               <List className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold theme-text font-outfit uppercase tracking-tight">Mis Publicaciones</h1>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div></div>
        ) : posts.length === 0 ? (
            <div className="theme-card rounded-4xl p-12 text-center shadow-2xl shadow-brand-500/5">
                <div className="h-20 w-20 bg-current/5 rounded-full flex items-center justify-center mx-auto mb-4">
                   <List className="h-10 w-10 opacity-20" />
                </div>
                <h3 className="text-lg font-bold theme-text mb-2">Aún no tienes publicaciones activas</h3>
                <p className="theme-text opacity-60 mb-6 font-medium text-sm">Ofrece o busca lugar para empezar a conectar con la comunidad.</p>
                <button onClick={() => router.push('/publish')} className="primary-button pr-8 pl-8">Crear Publicación</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {posts.map(post => (
                   <div key={post._id} className="theme-card rounded-4xl shadow-xl overflow-hidden flex flex-col hover:scale-[1.01] transition-all relative border border-current/5 group">
                      <div className={`absolute top-0 left-0 h-full w-2.5 ${post.type === 'offer' ? 'bg-brand-500' : 'bg-orange-500'} group-hover:w-3 transition-all`}></div>
                      
                      <div className="p-8 flex-1 pl-10">
                          <div className="flex justify-between items-start mb-6 w-full">
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 post.type === 'offer' ? 'bg-brand-500 text-white' : 'bg-orange-500 text-white'
                             }`}>
                                {post.type === 'offer' ? 'Ofrece' : 'Busca'} {post.category === 'passenger' ? 'Pasajeros' : 'Paquetes'}
                             </div>
                             <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${post.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                                 {post.status === 'active' ? 'Publicado' : post.status}
                             </span>
                          </div>

                          <div className="flex items-center gap-4 mb-6">
                             <div className="flex-1 bg-current/5 p-4 rounded-3xl border border-current/5 relative overflow-hidden">
                                <p className="text-[9px] theme-text font-black uppercase opacity-40 mb-1">Origen</p>
                                <p className="font-black theme-text truncate text-sm">{post.origin}</p>
                             </div>
                             <div className="flex-1 bg-current/5 p-4 rounded-3xl border border-current/5 relative overflow-hidden">
                                <p className="text-[9px] theme-text font-black uppercase opacity-40 mb-1">Destino</p>
                                <p className="font-black theme-text truncate text-sm">{post.destination}</p>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-3 text-xs mb-6">
                             <div className="flex items-center gap-2 bg-brand-500/15 px-3 py-1.5 rounded-xl text-brand-700 dark:text-brand-300 font-black uppercase tracking-tighter border border-brand-500/20">
                                <Calendar className="h-3.5 w-3.5"/> {formatDate(post.departureDate)}
                             </div>
                             <div className="flex items-center gap-2 bg-current/5 px-3 py-1.5 rounded-xl text-gray-700 dark:text-gray-200 font-black uppercase tracking-tighter border border-current/10">
                                {post.category === 'passenger' ? <Users className="h-3.5 w-3.5 text-brand-500"/> : <Package className="h-3.5 w-3.5 text-orange-500"/>} 
                                {post.category === 'passenger' ? (post.seats ?? post.capacity) : (post.weight ?? post.capacity)} {post.category === 'passenger' ? 'Lugares' : 'kg'}
                             </div>
                          </div>
                          
                          <div className="mt-6 pt-5 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-200 font-black uppercase text-[10px] bg-current/5 px-3 py-1.5 rounded-xl border border-current/10">
                                  <Eye className="h-3.5 w-3.5" />
                                  {(post.interestRequests || []).length} solicitudes · {(post.interestRequests || []).filter((r) => r.status === 'pending').length} pendientes
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => router.push(`/publish?edit=${post._id}`)} className="bg-brand-500 text-white p-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/10 hover:scale-105 active:scale-95 transition-all w-8 md:w-auto h-10 flex items-center justify-center gap-2" title="Editar Publicación">
                                   <Edit className="h-4 w-4" />
                                   <span className="hidden md:inline">Editar</span>
                                </button>
                                <button type="button" onClick={() => router.push(`/travel/${post._id}`)} className="bg-current/10 theme-text p-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-current/20 transition-all flex items-center gap-2 h-10 w-8 md:w-auto overflow-hidden">
                                   <Eye className="h-4 w-4" />
                                   <span className="hidden md:inline">Ver</span>
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white p-2.5 rounded-2xl shadow-lg shadow-red-500/10 hover:scale-110 active:scale-95 transition-all h-10 w-10 flex items-center justify-center" title="Eliminar Publicación">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                          </div>
                      </div>
                   </div>
               ))}
            </div>
        )}
      </div>
    </div>
  );
}
