"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { List, MapPin, Calendar, Users, Package, Eye, Trash2 } from 'lucide-react';
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
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
               <List className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-outfit">Mis Publicaciones</h1>
        </div>

        {isLoading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div></div>
        ) : posts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xl shadow-gray-200/50">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <List className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aún no tienes publicaciones activas</h3>
                <p className="text-gray-500 mb-6">Ofrece o busca lugar para empezar a conectar.</p>
                <button onClick={() => router.push('/publish')} className="primary-button">Crear Publicación</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {posts.map(post => (
                   <div key={post._id} className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow relative">
                      <div className={`absolute top-0 left-0 h-full w-2 ${post.type === 'offer' ? 'bg-brand-500' : 'bg-accent-500'}`}></div>
                      
                      <div className="p-8 flex-1 pl-10">
                          <div className="flex justify-between items-start mb-6 w-full">
                             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                 post.type === 'offer' ? 'bg-brand-50 text-brand-700' : 'bg-accent-50 text-accent-700'
                             }`}>
                               {post.type === 'offer' ? 'Ofrezco' : 'Busco'} {post.category === 'passenger' ? 'Pasajeros' : 'Paquetes'}
                             </span>
                             <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${post.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                 {post.status.toUpperCase()}
                             </span>
                          </div>

                          <div className="flex items-center gap-4 mb-6">
                             <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Origen</p>
                                <p className="font-bold text-gray-900 truncate text-lg">{post.origin}</p>
                             </div>
                             <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative overflow-hidden">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Destino</p>
                                <p className="font-bold text-gray-900 truncate text-lg">{post.destination}</p>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 mb-6">
                             <div className="flex items-center gap-2 bg-brand-50 px-3 py-1.5 rounded-xl text-brand-700 font-medium border border-brand-100">
                                <Calendar className="h-4 w-4"/> {formatDate(post.departureDate)}
                             </div>
                             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl text-gray-700 font-medium border border-gray-100">
                                {post.category === 'passenger' ? <Users className="h-4 w-4 text-brand-500"/> : <Package className="h-4 w-4 text-accent-500"/>} 
                                {post.capacity} {post.category === 'passenger' ? 'Lugares' : 'Espacio'}
                             </div>
                          </div>
                          
                          {/* Interacciones (Mocked for now since clicking details on feed is what triggers it ideally) */}
                          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2 text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-xl text-sm">
                                  <Eye className="h-4 w-4 text-brand-400" />
                                  {(post.interestRequests || []).length} solicitudes ·{' '}
                                  {(post.interestRequests || []).filter((r) => r.status === 'pending').length} pendientes
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => router.push(`/travel/${post._id}`)} className="text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-xl text-sm font-semibold border border-brand-100">
                                  Itinerario / solicitudes
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100 group" title="Eliminar Publicación">
                                    <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
