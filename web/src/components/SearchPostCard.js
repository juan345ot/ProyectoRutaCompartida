import { Calendar, Package, User, Eye, Flag } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SearchPostCard({ post, isAuthenticated, user, idx = 0 }) {
  const isOffer = post.type === 'offer';
  const colorAccent = isOffer ? 'bg-brand-500' : 'bg-accent-500';
  const pillStyle = isOffer ? 'bg-brand-500 text-white' : 'bg-accent-500 text-white';

  const cardAccents = [
    'from-brand-500/10 to-brand-300/5',
    'from-accent-500/10 to-accent-300/5',
    'from-brand-700/10 to-accent-300/5',
  ];
  const gradientClass = cardAccents[idx % cardAccents.length];

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  const handleReport = async () => {
    if (!isAuthenticated || !user?._id) {
      toast.error('Iniciá sesión para reportar.');
      return;
    }
    try {
      await api.post('/reports', {
        reportedUserId: post.author?._id,
        postId: post._id,
        reason: 'Reporte desde listado de publicaciones',
      });
      toast.success('Reporte enviado. Nuestro equipo lo revisará.');
    } catch {
      toast.error('No se pudo enviar el reporte');
    }
  };

  return (
    <div className="theme-card rounded-3xl p-0 hover:-translate-y-1 transition-all group relative overflow-hidden">
      <div className={`absolute left-0 top-0 w-1.5 h-full ${colorAccent} rounded-l-3xl`} />
      <div className={`absolute inset-0 bg-linear-to-br ${gradientClass} pointer-events-none rounded-3xl`} />

      <div className="relative pl-6 pr-6 py-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="grow">
            <div className="flex items-center flex-wrap gap-2 mb-5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${pillStyle} shadow-sm`}
              >
                {isOffer ? '✈ Ofrece lugar' : '🔍 Busca lugar'}
              </span>
              <span className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/15 theme-text gap-1">
                {post.category === 'passenger' ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Package className="h-3.5 w-3.5" />
                )}
                {post.category === 'passenger' ? 'Pasajeros' : 'Paquetes'}
              </span>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center mt-1.5 shrink-0">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${isOffer ? 'border-brand-500' : 'border-accent-500'} bg-white z-10`}
                />
                <div className="w-0.5 h-8 bg-current opacity-20" />
                <div
                  className={`w-3 h-3 rounded-full ${isOffer ? 'bg-brand-500' : 'bg-accent-500'} z-10`}
                />
              </div>
              <div>
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase theme-text opacity-70 mb-0.5">
                    Origen
                  </p>
                  <p className="text-lg font-bold theme-text">{post.origin}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase theme-text opacity-70 mb-0.5">
                    Destino
                  </p>
                  <p className="text-lg font-bold theme-text">{post.destination}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between md:items-end md:w-2/5 rounded-2xl border border-current/15 p-4 bg-white/30 dark:bg-black/20">
            <div className="w-full text-left md:text-right mb-4 md:mb-0">
              <p className="text-xs theme-text opacity-70 flex items-center md:justify-end gap-1 mb-1 font-semibold uppercase">
                <Calendar className="h-3.5 w-3.5" /> Salida
              </p>
              <p className="font-semibold capitalize text-sm theme-text">{formatDate(post.departureDate)}</p>

              <p className="text-xs theme-text opacity-70 mt-3 font-semibold uppercase">Capacidad</p>
              <p className="font-semibold text-sm theme-text">{post.capacity}</p>
            </div>

            <div className="mt-4 flex flex-col gap-2 w-full">
              <p className="text-xs theme-text opacity-80 text-center md:text-right">
                Por <span className="font-bold">{post.author?.name || 'Usuario'}</span>
              </p>
              <Link
                href={`/travel/${post._id}`}
                className="flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-brand-700 transition-colors w-full text-sm shadow-md"
              >
                <Eye className="h-4 w-4" /> Ver detalle / itinerario
              </Link>
              <p className="text-[11px] theme-text opacity-70 text-center md:text-right">
                El contacto (WhatsApp/tel.) aparece en el detalle una vez aprobado el viaje.
              </p>
              <button
                type="button"
                onClick={handleReport}
                className="flex items-center justify-center gap-2 text-red-600 bg-red-500/10 hover:bg-red-500/20 py-2.5 px-4 rounded-xl font-semibold transition-colors w-full text-sm border border-red-500/30"
              >
                <Flag className="h-4 w-4" /> Reportar
              </button>
            </div>
          </div>
        </div>

        {post.description && (
          <div className="mt-4 pt-4 border-t border-current/10">
            <p className="text-sm theme-text opacity-75 italic">&quot;{post.description}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
