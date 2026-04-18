"use client";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Share2,
  Flag,
  UserCheck,
  Users,
  Package,
  CheckCircle,
  Car,
  Navigation,
  Eye,
  Info,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function TravelDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [travelDistance, setTravelDistance] = useState(null);
  const [travelDuration, setTravelDuration] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingFormData, setBookingFormData] = useState({
    seatsRequested: 1,
    weightRequested: "",
    dimensionsRequested: { length: "", width: "", height: "" },
    message: "",
    luggageSize: "none",
    pets: false,
    smoker: false,
    fragile: false,
    packageCategory: "other"
  });
  const mapRef = useRef(null);

  const uid = user?._id || user?.id;

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error loading post:", err);
      setPost(null);
      toast.error("Error al cargar la publicación");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadBookings = useCallback(async () => {
    if (!uid || !post) return;
    try {
      const authorId = post.author?._id || post.author;
      if (String(authorId) === String(uid)) {
        const bRes = await api.get(`/bookings/my-offers`);
        setBookings(bRes.data.filter(b => String(b.post?._id || b.post) === String(id)));
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
    }
  }, [id, uid, post]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => {
    if (post && uid) {
      loadBookings();
    }
  }, [post, uid, loadBookings]);

  useEffect(() => {
    if (post && mapRef.current && typeof window !== 'undefined' && window.google) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
      
      const map = new google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: -34.6037, lng: -58.3816 },
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] }
        ]
      });
      directionsRenderer.setMap(map);

      const request = {
        origin: post.origin,
        destination: post.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          const leg = result.routes[0].legs[0];
          
          if (leg.duration && leg.duration.value) {
            const departureTime = new Date(post.departureDate).getTime();
            const arrivalDate = new Date(departureTime + leg.duration.value * 1000);
            setEstimatedArrival(arrivalDate.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' }) + " (estimado)");
            setTravelDistance(leg.distance.text);
            setTravelDuration(leg.duration.text);
          }

          // Origin Marker (Green)
          new google.maps.Marker({
            position: leg.start_location,
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            title: "Origen"
          });

          // Destination Marker (Red)
          new google.maps.Marker({
            position: leg.end_location,
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            title: "Destino"
          });
        }
      });
    }
  }, [post]);

  const handleMeInteresaClick = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para mostrar interés");
      router.push("/login");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleInterestRequest = async () => {
    try {
      await api.post(`/bookings`, {
        post: id,
        ...bookingFormData
      });
      toast.success("Tu solicitud de interés ha sido enviada");
      setIsBookingModalOpen(false);
      loadPost();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al enviar solicitud");
    }
  };

  const handleInterestResponse = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}`, { status });
      toast.success(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`);
      loadPost();
    } catch {
      toast.error("Error al procesar la solicitud");
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator.share({
        title: 'Ruta Compartida - Viaje',
        text: `Mira este viaje de ${post?.origin} a ${post?.destination}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const handleReport = () => {
    const confirmation = window.confirm(
      "¿Estás seguro de que deseas reportar esta publicación?\n\n" +
      "⚠️ ADVERTENCIA: Realizar reportes falsos o malintencionados puede resultar en la EXPULSIÓN PERMANENTE de la plataforma."
    );
    
    if (confirmation) {
      toast.success('Reporte enviado al equipo de moderación');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="theme-text font-bold animate-pulse">Cargando itinerario...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center theme-card p-12 rounded-3xl">
        <Info className="h-16 w-16 text-brand-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black theme-text">No se encontró la publicación</h2>
        <p className="theme-text opacity-70 mt-2 mb-8">El viaje podría haber sido eliminado o el enlace es incorrecto.</p>
        <button onClick={() => router.push('/search')} className="primary-button w-full">Volver a Buscar</button>
      </div>
    );
  }

  const isOwner = uid && post.author?._id === uid;
  const myRequest = post.bookings?.find(b => (b.user?._id || b.user) === uid);
  const canViewContact = isOwner || myRequest?.status === "approved";
  const phone = post.author?.phone;
  const waDigits = phone?.replace(/\D/g, "");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header / Info Section */}
      <div className="theme-card rounded-3xl p-6 md:p-10 mb-8 border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full -mr-10 -mt-10"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
               {post.category === 'passenger' ? <Users className="h-8 w-8" /> : <Package className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-black theme-text tracking-tight">
                {post.category === 'passenger' ? 'Viaje de Pasajeros' : 'Transporte de Paquetes'}
              </h1>
              <p className="theme-text font-bold text-brand-600 dark:text-brand-300 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Publicación {post.type === 'offer' ? 'de Conductor' : 'de Usuario'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <div className="px-4 py-2 rounded-full bg-accent-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-accent-500/20">
                {post.status === 'active' ? 'En Curso' : (post.status === 'completed' ? 'Finalizado' : 'Cancelado')}
             </div>
             {isOwner && (
               <div className="px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20">
                  Tu Publicación
               </div>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
           {/* Individual Bubble Cards */}
           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <MapPin className="h-4 w-4" /> Origen
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight">{post.origin}</p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <MapPin className="h-4 w-4" /> Destino
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight">{post.destination}</p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <Calendar className="h-4 w-4" /> Salida
              </p>
              <p className="font-black text-xl lg:text-2xl uppercase tracking-tighter leading-tight">
                 {new Date(post.departureDate).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
              <p className="font-black text-lg opacity-90 mt-1">
                 {new Date(post.departureDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} HS
              </p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <Clock className="h-4 w-4" /> Duración Estimada
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight uppercase">
                 {travelDuration || "Calculando..."}
              </p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <Clock className="h-4 w-4" /> Llegada (Aprox)
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight uppercase">
                 {post.arrivalApprox || estimatedArrival || "A coordinar"}
              </p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 <Navigation className="h-4 w-4" /> Distancia Total
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight uppercase">
                 {travelDistance || "Calculando..."}
              </p>
           </div>

           <div className="bg-brand-500 rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/20 text-white flex flex-col justify-center min-h-[140px] group transition-all md:col-span-2 lg:col-span-1 hover:scale-[1.02]">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3 flex items-center gap-2">
                 {post.category === 'passenger' ? <Users className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                 Capacidad {post.type === 'offer' ? 'Disponible' : 'Necesaria'}
              </p>
              <p className="font-black text-2xl lg:text-3xl tracking-tighter leading-tight uppercase">
                 {post.category === 'passenger' ? `${post.seats || 0} Asientos` : `${post.weight || 0} kg`}
              </p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Author info */}
          <div className="theme-card p-6 rounded-3xl flex items-center gap-5 border-none shadow-xl">
            <div className="h-16 w-16 rounded-full bg-brand-500 flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black theme-text opacity-60 tracking-widest mb-1">Publicado por</p>
              <h3 className="font-black theme-text text-2xl">{post.author?.name || 'Usuario'}</h3>
              <p className="text-xs theme-text opacity-70">Miembro desde {new Date(post.author?.createdAt || Date.now()).getFullYear()}</p>
            </div>
          </div>

          {/* Map area */}
          <div className="theme-card p-6 rounded-3xl border-none shadow-xl overflow-hidden">
            <h3 className="font-black theme-text flex items-center gap-2 mb-6 uppercase text-xs tracking-widest">
              <Navigation className="h-4 w-4 text-brand-500" /> Itinerario Visual
            </h3>
            <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden border border-current/5 shadow-inner bg-current/5" />
          </div>

          {/* Details / Description */}
          <div className="theme-card p-8 rounded-3xl border-none shadow-xl">
             <h3 className="font-black theme-text flex items-center gap-2 mb-6 uppercase text-xs tracking-widest text-brand-600 dark:text-brand-400">
              <Info className="h-4 w-4" /> Descripción Adicional
            </h3>
            {post.description ? (
              <p className="theme-text text-lg leading-relaxed font-medium italic opacity-90 border-l-4 border-brand-500 pl-6 py-2">
                &quot;{post.description}&quot;
              </p>
            ) : (
              <p className="theme-text opacity-50 italic">El autor no proporcionó una descripción adicional.</p>
            )}

            {post.type === 'offer' && post.vehicle && (
              <div className="mt-8">
                <h4 className="font-black theme-text text-sm uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Car className="h-4 w-4 text-brand-500" /> Información del Vehículo
                </h4>
                <div className="bg-current/5 rounded-3xl p-6 border border-current/10">
                  {/* Foto si existe - arriba del todo */}
                  {post.vehicle.photoDataUrl && (
                    <div className="relative h-52 rounded-2xl overflow-hidden border border-current/10 shadow-lg mb-5">
                      <Image src={post.vehicle.photoDataUrl} alt="Foto del vehículo" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  {/* Datos del auto */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(post.vehicle.brand || post.vehicle.model) && (
                      <div className="bg-current/5 rounded-2xl p-4 border border-current/5">
                        <p className="text-[9px] theme-text opacity-40 uppercase font-black tracking-widest mb-1">Vehículo / Año</p>
                        <p className="theme-text font-black text-sm">
                          {[post.vehicle.brand, post.vehicle.model, post.vehicle.year ? `(${post.vehicle.year})` : ''].filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    {post.vehicle.color && (
                      <div className="bg-current/5 rounded-2xl p-4 border border-current/5">
                        <p className="text-[9px] theme-text opacity-40 uppercase font-black tracking-widest mb-1">Color</p>
                        <p className="theme-text font-black text-sm capitalize">{post.vehicle.color}</p>
                      </div>
                    )}
                    {post.vehicle.licensePlate && (
                      <div className="bg-current/5 rounded-2xl p-4 border border-current/5">
                        <p className="text-[9px] theme-text opacity-40 uppercase font-black tracking-widest mb-1">Patente</p>
                        <p className="theme-text font-black text-sm uppercase tracking-widest">{post.vehicle.licensePlate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
           {/* Action Card */}
           <div className="theme-card p-8 rounded-3xl border-none shadow-2xl relative overflow-hidden ring-2 ring-brand-500/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
              <h3 className="font-black theme-text text-xl mb-6 flex items-center gap-2">
                 <UserCheck className="h-6 w-6 text-brand-500" /> Gestión de Interés
              </h3>

              {!isOwner && post.status === "active" && (
                <>
                  {!myRequest ? (
                    <button onClick={handleMeInteresaClick} className="primary-button w-full text-lg py-4 mb-4">
                       Quiero sumarme
                    </button>
                  ) : (
                    <div className={`p-5 rounded-2xl mb-4 border font-black text-center ${
                      myRequest.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                      myRequest.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-600' :
                      'bg-brand-500/10 border-brand-500/20 text-brand-600'
                    }`}>
                       {myRequest.status === 'approved' ? '¡SOLICITUD APROBADA! 🎉' :
                        myRequest.status === 'rejected' ? 'Solicitud Rechazada' :
                        'Solicitud Pendiente...'}
                    </div>
                  )}

                  {!canViewContact && (
                    <div className="p-5 rounded-2xl bg-brand-600 shadow-lg mb-6">
                      <p className="text-sm font-black text-white leading-relaxed flex items-start gap-2">
                        <Info className="h-5 w-5 shrink-0" />
                        El contacto de WhatsApp se liberará una vez que el autor apruebe tu interés.
                      </p>
                    </div>
                  )}

                  {canViewContact && phone && (
                    <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noreferrer" className="accent-button w-full text-lg py-4 flex items-center justify-center gap-3 mb-6 shadow-orange-500/20">
                       <Phone className="h-5 w-5" /> Contactar al WhatsApp
                    </a>
                  )}

                  <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-3 text-brand-500 font-black text-sm transition-all border-t border-current/10 pt-6 hover:scale-105">
                     <Share2 className="h-4 w-4" /> Compartir este itinerario
                  </button>
                </>
              )}

              {isOwner && (
                <div className="space-y-6">
                  <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center">
                     <p className="font-black text-brand-600">Sos el autor de este viaje</p>
                  </div>

                  {post.status === "active" && (
                    <button 
                      onClick={async () => {
                        if(confirm('¿Seguro que deseas marcar este viaje como completado? Ya no recibirá más solicitudes.')) {
                          try {
                            await api.patch(`/posts/${post._id}/complete`);
                            toast.success('Viaje finalizado con éxito.');
                            window.location.reload();
                          } catch (e) {
                            toast.error('Error al finalizar el viaje');
                          }
                        }
                      }}
                      className="w-full bg-slate-800 text-white rounded-2xl font-black uppercase text-sm py-4 shadow-xl active:scale-95 transition-all text-center hover:bg-slate-700"
                    >
                      Marcar Viaje como Finalizado
                    </button>
                  )}
                  
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest theme-text mb-4 opacity-100">Personas Interesadas ({bookings.length})</h4>
                    <div className="space-y-3">
                       {bookings.length === 0 ? (
                         <p className="text-sm theme-text opacity-50 italic">Nadie ha mostrado interés todavía.</p>
                       ) : (
                         bookings.map(b => (
                           <div key={b._id} className="p-4 rounded-xl border border-current/10 bg-current/5">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-black theme-text uppercase text-xs">{b.user?.name || 'Usuario'}</span>
                                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${
                                  b.status === 'approved' ? 'bg-green-500 text-white' : 
                                  b.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-brand-500 text-white'
                                }`}>
                                  {b.status}
                                </span>
                              </div>
                              <p className="text-xs theme-text opacity-80 mb-3 line-clamp-2 italic">&quot;{b.message || 'Sin mensaje'}&quot;</p>
                              
                              {b.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleInterestResponse(b._id, 'approved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-[10px] font-black uppercase hover:bg-green-600 transition-all">Aprobar</button>
                                  <button onClick={() => handleInterestResponse(b._id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 transition-all">Rechazar</button>
                                </div>
                              )}
                              
                              {b.status === 'approved' && b.user?.phone && (
                                <a href={`https://wa.me/${b.user.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block text-center bg-green-500 text-white py-2 rounded-lg text-[10px] font-black uppercase hover:bg-green-600 transition-all">
                                   Escribir al WhatsApp
                                </a>
                              )}
                           </div>
                         ))
                       )}
                    </div>
                  </div>
                </div>
              )}
           </div>

           {/* Report mechanism */}
           {!isOwner && (
              <div className="text-center">
                 <button 
                  onClick={handleReport} 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                >
                  <Flag className="h-3 w-3" /> Reportar Problema
                </button>
              </div>
           )}
        </div>
      </div>

      {/* MODAL ME INTERESA */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="theme-card rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh] border-none ring-4 ring-brand-500/30">
            <h2 className="text-3xl font-black theme-text mb-2">¿Te interesa sumarte?</h2>
            <p className="theme-text opacity-90 mb-8 font-bold leading-relaxed">Completa los detalles para que {post.author?.name} pueda revisar tu solicitud.</p>
            
            <div className="space-y-6">
              {post.category === 'passenger' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest theme-text mb-2">Cantidad de pasajeros</label>
                    <div className="flex items-center gap-4">
                       <input 
                        type="number" 
                        min="1" 
                        max={post.seats || 10} 
                        value={bookingFormData.seatsRequested}
                        onChange={(e) => setBookingFormData({...bookingFormData, seatsRequested: e.target.value})}
                        className="w-24 rounded-2xl border-none p-4 bg-brand-500/10 theme-text font-black text-xl text-center focus:ring-2 focus:ring-brand-500"
                      />
                      <p className="text-xs theme-text font-bold opacity-60">Asientos disponibles: {post.seats || 'Ver publicación'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest theme-text mb-2">Tamaño del equipaje</label>
                    <select 
                      value={bookingFormData.luggageSize}
                      onChange={(e) => setBookingFormData({...bookingFormData, luggageSize: e.target.value})}
                      className="w-full rounded-2xl border-none p-4 bg-brand-500/10 theme-text font-black appearance-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="none">Sin equipaje</option>
                      <option value="small">Chico (Mochila / Bolso)</option>
                      <option value="medium">Mediano (Valija chica)</option>
                      <option value="large">Grande (Valija grande)</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-3 cursor-pointer bg-brand-500/10 px-5 py-4 rounded-2xl border-2 border-transparent hover:border-brand-500/30 transition-all">
                       <input type="checkbox" checked={bookingFormData.pets} onChange={(e) => setBookingFormData({...bookingFormData, pets: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                       <span className="text-sm font-black theme-text">Viajo con mascota</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer bg-brand-500/10 px-5 py-4 rounded-2xl border-2 border-transparent hover:border-brand-500/30 transition-all">
                       <input type="checkbox" checked={bookingFormData.smoker} onChange={(e) => setBookingFormData({...bookingFormData, smoker: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                       <span className="text-sm font-black theme-text">Soy fumador</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest theme-text mb-2">Peso (kg)</label>
                        <input 
                          type="number" 
                          min="1" 
                          max={post.weight || 999}
                          value={bookingFormData.weightRequested}
                          onChange={(e) => setBookingFormData({...bookingFormData, weightRequested: e.target.value})}
                          className="w-full rounded-2xl border-none p-4 bg-brand-500/10 theme-text font-black focus:ring-2 focus:ring-brand-500"
                          placeholder="Ej: 5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest theme-text mb-2">Categoría</label>
                        <select 
                          value={bookingFormData.packageCategory}
                          onChange={(e) => setBookingFormData({...bookingFormData, packageCategory: e.target.value})}
                          className="w-full rounded-2xl border-none p-4 bg-brand-500/10 theme-text font-black appearance-none focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="other">Otro</option>
                          <option value="documents">Documentos</option>
                          <option value="electronic">Electrónicos</option>
                          <option value="clothing">Ropa / Textil</option>
                          <option value="fragile">Frágil / Delicado</option>
                        </select>
                      </div>
                   </div>

                   <label className="flex items-center gap-3 cursor-pointer bg-brand-500/10 px-5 py-4 rounded-2xl border-2 border-transparent hover:border-brand-500/30 transition-all">
                      <input type="checkbox" checked={bookingFormData.fragile} onChange={(e) => setBookingFormData({...bookingFormData, fragile: e.target.checked})} className="accent-brand-500 w-5 h-5" />
                      <span className="text-sm font-black theme-text">Contenido Frágil</span>
                   </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest theme-text mb-2">Mensaje adicional / duda</label>
                <textarea 
                  rows="3"
                  value={bookingFormData.message}
                  onChange={(e) => setBookingFormData({...bookingFormData, message: e.target.value})}
                  placeholder="Ej: Lo entrego en la puerta, o coordino punto medio..."
                  className="w-full rounded-2xl border-none p-4 bg-brand-500/10 theme-text font-medium resize-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleInterestRequest} 
                  className="primary-button w-full py-4 text-lg"
                >
                  Enviar Mi Interés
                </button>
                <button 
                  onClick={() => setIsBookingModalOpen(false)} 
                  className="w-full py-3 theme-text opacity-60 font-black uppercase text-xs tracking-widest hover:opacity-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
