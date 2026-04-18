"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Star, CheckCircle, Flag, Map as MapIcon, Cigarette, Dog, Timer, Navigation, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function SearchPostCard({ post, apiKey }) {
  const [isMounted, setIsMounted] = useState(false);
  const [tripInfo, setTripInfo] = useState({ distance: null, duration: null, arrival: post.arrivalApprox || null });

  // Montaje client-side para hydration segura
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOffer = post.type === 'offer';
  const isPast = new Date(post.departureDate) < new Date();
  const isFull = (post.category === 'passenger' && post.seats <= 0) || (post.category === 'package' && (post.weight || 0) <= 0);
  
  const isUnavailable = post.status !== 'active' || isFull || isPast;
  const isFinished = post.status === 'completed' || post.status === 'cancelled' || isPast;

  // Calcular distancia, duración y llegada estimada via Google Maps Directions API
  // Solo para posts de tipo 'offer' (el que ofrece el viaje sabe la ruta exacta)
  useEffect(() => {
    if (!isMounted || !apiKey || !post.origin || !post.destination) return;
    if (!isOffer) return; // Si busca viaje, no calcular
    if (typeof window === 'undefined' || !window.google?.maps) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: post.origin,
        destination: post.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const leg = result.routes[0].legs[0];
          const durationSecs = leg.duration?.value || 0;
          const departureMs = new Date(post.departureDate).getTime();
          const arrivalDate = new Date(departureMs + durationSecs * 1000);
          const arrivalStr = arrivalDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' (est.)';

          setTripInfo({
            distance: leg.distance?.text || null,
            duration: leg.duration?.text || null,
            arrival: post.arrivalApprox || arrivalStr,
          });
        }
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, apiKey, isOffer]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
    } catch { return '...' }
  };

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    } catch { return '...' }
  };

  const staticMapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?size=600x400&scale=2&maptype=roadmap&path=color:0x0ea5e9|weight:5|${encodeURIComponent(post.origin)}|${encodeURIComponent(post.destination)}&markers=color:0x10b981|label:O|${encodeURIComponent(post.origin)}&markers=color:0xef4444|label:D|${encodeURIComponent(post.destination)}&key=${apiKey}`
    : null;

  const handleReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("¿Estás seguro de que deseas reportar esta publicación? Hacer reportes falsos puede llevar a la expulsión de la plataforma.")) {
      toast.success("Tu reporte ha sido enviado. Lo revisaremos pronto.");
    }
  };

  return (
    <div className="group relative theme-card rounded-[2.5rem] overflow-hidden border border-current/10 shadow-2xl transition-all duration-500 hover:shadow-brand-500/10 active:scale-[0.99]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
        
        {/* LADO IZQUIERDO: RUTA Y MAPA */}
        <div className="flex flex-col border-r border-current/10">
           {/* Mapa Estático */}
           <div className="relative h-56 md:h-64 overflow-hidden">
              {staticMapUrl ? (
                <Image 
                  src={staticMapUrl} 
                  alt="Mapa del recorrido" 
                  fill 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  unoptimized={true} 
                />
              ) : (
                <div className="w-full h-full bg-current/5 flex items-center justify-center">
                   <MapIcon className="h-16 w-12 opacity-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6">
                 <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20 ${isOffer ? 'bg-brand-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
                    {isOffer ? 'Ofrece' : 'Busca'} {post.category === 'passenger' ? 'Viaje' : 'Envío'}
                 </div>
              </div>
           </div>

           {/* Ruta / Origen-Destino */}
           <div className="p-8 flex-1 space-y-6">
              <div className="flex items-center gap-5">
                 <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-500/20 shrink-0">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-black theme-text opacity-40 leading-none mb-1.5 tracking-wider">Punto de Salida</p>
                    <p className="theme-text font-black text-lg md:text-xl truncate">{post.origin}</p>
                 </div>
              </div>

              <div className="flex items-center gap-5">
                 <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 shadow-sm border border-red-500/20 shrink-0">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-black theme-text opacity-40 leading-none mb-1.5 tracking-wider">Destino Final</p>
                    <p className="theme-text font-black text-lg md:text-xl truncate">{post.destination}</p>
                 </div>
              </div>

              {/* Badges de Preferencias */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                 {post.preferences?.smoke ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-black uppercase tracking-tight">
                       <Cigarette className="h-4 w-4" /> Permite Fumar
                    </div>
                 ) : (
                    /* Fondo blanco en modo claro, oscuro translúcido en dark */
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-tight">
                       <Cigarette className="h-4 w-4 opacity-50" /> No Fumar
                    </div>
                 )}
                 {post.preferences?.pets && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-600 border border-brand-500/20 text-xs font-black uppercase tracking-tight">
                       <Dog className="h-4 w-4" /> Mascotas OK
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* LADO DERECHO: INFO VIAJE Y AUTOR */}
        <div className="flex flex-col bg-current/3 p-8 md:p-10">
           
           {/* Info del Autor / Disponibilidad */}
           <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-5">
                 <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-[1.8rem] bg-brand-500 shadow-xl shadow-brand-500/20 flex items-center justify-center text-white font-black text-2xl border-2 border-white/20">
                       {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 rounded-full border-4 theme-card flex items-center justify-center">
                       <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                 </div>
                 <div>
                    <p className="text-[11px] font-black uppercase opacity-40 tracking-widest leading-none mb-1.5">Publicado por</p>
                    <h4 className="theme-text font-black text-xl leading-tight uppercase truncate max-w-[150px]">{post.author?.name?.split(' ')[0]}</h4>
                    <div className="flex items-center gap-2.5 mt-1.5">
                       {(post.author?.averageRating || 0) > 0 ? (
                          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                             <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                             <span className="text-xs font-black text-amber-600">{(post.author?.averageRating || 0).toFixed(1)}</span>
                          </div>
                       ) : (
                          <div className="bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nueva/o</span>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="text-right">
                 <p className="text-[11px] font-black uppercase opacity-40 tracking-widest leading-none mb-2">
                    {post.category === 'passenger' 
                      ? (isOffer ? 'Asientos Libres' : 'Asientos Requeridos')
                      : (isOffer ? 'Carga Disponible' : 'Carga Necesaria')}
                 </p>
                 <div className="flex items-baseline justify-end gap-1.5">
                    <span className="theme-text font-black text-4xl leading-none">
                       {post.category === 'passenger' ? (post.seats ?? '—') : (post.weight ?? '—')}
                    </span>
                    <span className="theme-text font-bold text-sm opacity-50 uppercase">
                       {post.category === 'passenger' ? 'Lugares' : 'kg'}
                    </span>
                 </div>
              </div>
           </div>

           {/* Horarios y Duración */}
           <div className="bg-current/5 border border-current/10 rounded-[2.5rem] p-8 space-y-8 flex-1 shadow-inner">
              {/* Siempre: Salida */}
              <div className="flex items-center justify-between gap-4">
                 <div className="space-y-1.5">
                    <p className="text-[10px] font-black theme-text opacity-40 uppercase tracking-widest flex items-center gap-2"><Calendar className="h-4 w-4" /> {isOffer ? 'Salida' : 'Busca para'} {isMounted ? formatDate(post.departureDate) : ''}</p>
                    <p className="theme-text font-black text-3xl tracking-tighter">{isMounted ? formatTime(post.departureDate) : '...'} <span className="text-xs opacity-40 tracking-normal font-black uppercase ml-1">HS</span></p>
                 </div>
                 {/* Llegada estimada: solo para ofertas */}
                 {isOffer && (
                   <>
                     <div className="h-px flex-1 bg-current/20 mx-4 relative min-w-[40px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-brand-500 rounded-full border-4 border-current/10"></div>
                     </div>
                     <div className="text-right space-y-1.5">
                        <p className="text-[10px] font-black theme-text opacity-40 uppercase tracking-widest flex items-center justify-end gap-2">Llegada <Clock className="h-4 w-4" /></p>
                        <p className="theme-text font-black text-xl tracking-tighter">
                          {tripInfo.arrival || 'Calculando...'} 
                          <span className="text-xs opacity-40 tracking-normal font-black uppercase ml-1">EST.</span>
                        </p>
                     </div>
                   </>
                 )}
              </div>

              {/* Distancia y duración: solo para ofertas */}
              {isOffer && (
                <div className="pt-6 border-t border-current/10 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 border border-brand-500/10">
                         <Navigation className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black theme-text opacity-40 uppercase tracking-wide">Distancia</p>
                         <p className="theme-text font-black text-base tracking-tight">{tripInfo.distance || 'Calculando...'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-right">
                      <div>
                         <p className="text-[10px] font-black theme-text opacity-40 uppercase tracking-wide">Duración</p>
                         <p className="theme-text font-black text-base tracking-tight">{tripInfo.duration || 'Calculando...'}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 border border-orange-500/10">
                         <Timer className="h-6 w-6" />
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Botón de Acción y Reportar */}
           <div className="mt-10 flex items-center gap-5">
              {isUnavailable ? (
                 <div
                   className="flex-1 h-18 rounded-[1.8rem] font-black uppercase text-sm tracking-[0.25em] flex items-center justify-center gap-3 bg-slate-400 text-white opacity-60 cursor-not-allowed"
                 >
                   {isFinished ? 'Viaje Finalizado' : 'Viaje Lleno'}
                 </div>
              ) : (
                 <Link
                   href={`/travel/${post._id}`}
                   className="flex-1 group/btn h-18 rounded-[1.8rem] font-black uppercase text-sm tracking-[0.25em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/30"
                 >
                   Ver detalles <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1.5" />
                 </Link>
              )}
              
              <button 
                onClick={handleReport}
                className="h-18 w-22 rounded-[1.8rem] bg-red-600/90 hover:bg-red-600 flex flex-col items-center justify-center transition-all shadow-xl shadow-red-600/20 group/report active:scale-90 shrink-0"
                title="Reportar Publicación"
              >
                <Flag className="h-6 w-6 text-white mb-0.5 group-hover/report:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Reportar</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
}
