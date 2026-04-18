"use client";
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowRight, User, Package, Users, CheckCircle, Ban, ShieldCheck } from 'lucide-react';

export default function PostCard({ post, isThird = false }) {
  const isOffer = post.type === 'offer';
  const isUnavailable = post.status !== 'active' || (post.category === 'passenger' && post.seats <= 0) || (post.category === 'package' && post.weight <= 0);
  const isFinished = post.status === 'completed' || post.status === 'cancelled';

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div className={`theme-card rounded-4xl overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 relative group flex flex-col h-full ${isThird ? 'hidden lg:flex' : ''}`}>
      <div className="p-7 flex flex-col grow">
        {/* Type Badge */}
        <div className="flex items-center justify-between mb-6">
           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${
              isOffer ? 'bg-brand-500 text-white' : 'bg-orange-500 text-white'
           }`}>
              {isOffer ? 'Ofrece' : 'Busca'}
           </div>
           <div className="flex items-center gap-2 text-brand-600 dark:text-brand-300">
              {post.category === 'passenger' ? <Users className="h-5 w-5" /> : <Package className="h-5 w-5" />}
              <span className="text-[10px] font-black uppercase tracking-tight">
                 {post.category === 'passenger' ? 'Pasajeros' : 'Paquetes'}
              </span>
           </div>
        </div>

        {/* Origin / Dest */}
        <div className="space-y-3 mb-4">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600">
                 <MapPin className="h-5 w-5" />
              </div>
               <div>
                  <p className="text-[10px] uppercase font-black theme-text opacity-40">Origen</p>
                  <p className="theme-text font-black text-xl truncate max-w-[180px] leading-tight">{post.origin}</p>
               </div>
            </div>
            <div className="ml-5 h-8 border-l-2 border-dashed border-brand-500/20"></div>
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-600">
                  <MapPin className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-black theme-text opacity-40">Destino</p>
                  <p className="theme-text font-black text-xl truncate max-w-[180px] leading-tight">{post.destination}</p>
               </div>
            </div>
        </div>

        {/* Info Area (Colored) */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
           <div className="bg-brand-500 text-white p-5 rounded-4xl shadow-lg shadow-brand-500/10 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1 opacity-80">
                 <Calendar className="h-4 w-4" />
                 <span className="text-[9px] uppercase font-black tracking-widest leading-none">Salida</span>
              </div>
              <p className="font-black text-lg uppercase leading-none">{formatDate(post.departureDate)}</p>
              <p className="font-black text-xs mt-1.5 uppercase opacity-80 leading-none">
                 {new Date(post.departureDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} HS
              </p>
           </div>
           
           <div className="bg-brand-500/10 dark:bg-white/5 p-4 rounded-3xl border border-current/5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1 theme-text opacity-50">
                 {post.category === 'passenger' ? <Users className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                 <span className="text-[8px] uppercase font-black tracking-widest leading-none">Lugar</span>
              </div>
              <p className="font-black text-xs theme-text uppercase leading-none">
                {post.category === 'passenger' ? `${post.seats || 0} Libres` : `${post.weight || 0} kg`}
              </p>
              <p className="font-black text-[9px] mt-1 theme-text opacity-40 truncate leading-none uppercase">{post.author?.name?.split(' ')[0]}</p>
           </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {isUnavailable ? (
            <div className="flex justify-center items-center py-3.5 w-full rounded-2xl bg-current/5 text-current/40 font-black text-[10px] uppercase tracking-widest border border-current/5">
                {isFinished ? 'Finalizado' : 'Agotado'}
            </div>
          ) : (
            <Link href={`/travel/${post._id}`} className="block">
              <div className="flex justify-center items-center py-3.5 w-full rounded-2xl bg-brand-500 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl shadow-brand-500/20 hover:scale-[1.02] transition-all duration-300">
                Ver Detalles <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
