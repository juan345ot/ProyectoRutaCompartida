"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import { MapPin, Calendar, Clock, Package, Users, CheckCircle, XCircle, Clock as Timer, MessageSquare } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login?redirect=my-bookings";
    }
  }, [isAuthenticated, loading]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my-requests");
      setBookings(res.data);
    } catch (err) {
      toast.error("Error al cargar tus solicitudes");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  if (loading || isFetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center theme-text">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4" />
        <p className="opacity-70">Cargando tus solicitudes...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="h-3 w-3" /> Aprobado
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <XCircle className="h-3 w-3" /> Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Timer className="h-3 w-3" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black font-outfit theme-text uppercase tracking-tight">Mis Solicitudes Enviadas</h1>
          <p className="theme-text opacity-70 mt-1">Sigue el estado de los viajes y envíos en los que te has interesado.</p>
        </div>
        <Link href="/search" className="primary-button text-sm px-6 py-2">
          Buscar más viajes
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="theme-card rounded-3xl p-12 text-center border-2 border-dashed border-current/10">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20 theme-text" />
          <h3 className="text-xl font-bold theme-text mb-2">Aún no has solicitado nada</h3>
          <p className="theme-text opacity-60 mb-6">Cuando te intereses en un viaje, aparecerá aquí para que sigas su estado.</p>
          <Link href="/search" className="accent-button">
            Explorar Rutas
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const post = booking.post;
            if (!post) return null;

            return (
              <div 
                key={booking._id} 
                className="theme-card rounded-3xl p-6 border-2 border-current/5 hover:border-brand-500/30 transition-all shadow-xl hover:shadow-brand-500/10 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110 opacity-10 ${booking.type === 'passenger' ? 'bg-brand-500' : 'bg-accent-500'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 grow">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <span className="text-[10px] theme-text opacity-50 uppercase font-black tracking-widest">
                        {booking.type === 'passenger' ? 'Viaje' : 'Envío de Paquete'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                         <p className="font-bold theme-text leading-tight">{post.origin}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-accent-500"></div>
                         <p className="font-bold theme-text leading-tight">{post.destination}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                         {booking.type === 'passenger' ? (
                           <>
                             {booking.luggageSize && booking.luggageSize !== 'none' && (
                               <span className="text-[9px] bg-white dark:bg-black/40 px-2 py-0.5 rounded border border-current/5 theme-text">Equipaje: {booking.luggageSize}</span>
                             )}
                             {booking.pets && (
                               <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20">Mascota</span>
                             )}
                             {booking.smoker && (
                               <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded border border-amber-500/20">Fumador</span>
                             )}
                           </>
                         ) : (
                           <>
                             <span className="text-[9px] bg-white dark:bg-black/40 px-2 py-0.5 rounded border border-current/5 theme-text capitalize">{booking.packageCategory}</span>
                             {booking.fragile && (
                               <span className="text-[9px] bg-red-500/10 text-red-600 px-2 py-0.5 rounded border border-red-500/20 font-bold">FRÁGIL</span>
                             )}
                           </>
                         )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:text-right border-t md:border-t-0 md:border-l border-current/10 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold opacity-50 theme-text">Fecha de Viaje</p>
                      <p className="text-sm font-black theme-text flex items-center md:justify-end gap-2">
                        <Calendar className="h-3 w-3" /> {new Date(post.departureDate).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold opacity-50 theme-text">
                        {booking.type === 'passenger' ? 'Pasajeros' : 'Carga'}
                      </p>
                      <p className="text-sm font-black theme-text flex items-center md:justify-end gap-2">
                        {booking.type === 'passenger' ? (
                          <><Users className="h-3 w-3" /> {booking.seatsRequested} Lugares</>
                        ) : (
                          <><Package className="h-3 w-3" /> {booking.weightRequested} kg</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-current/10 pt-4 md:pt-0 md:pl-6">
                    <Link 
                      href={`/travel/${post._id}`}
                      className="w-full md:w-auto px-6 py-3 rounded-2xl bg-current/5 theme-text text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all text-center"
                    >
                      Ver Itinerario
                    </Link>
                  </div>
                </div>

                {booking.status === "approved" && post.author && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-black">?</div>
                      <div>
                        <p className="text-xs font-bold theme-text">¡Solicitud Aprobada!</p>
                        <p className="text-[10px] theme-text opacity-70 italic">Ya puedes ver el contacto en el itinerario.</p>
                      </div>
                    </div>
                    <Link 
                      href={`/travel/${post._id}`}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4"
                    >
                      Ver contacto ahora
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
