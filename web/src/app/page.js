"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, MapPin, Calendar, Package, Users, Star, Quote, ChevronDown, MessageSquare, ArrowRight } from 'lucide-react';
import PostCard from '@/components/PostCard';
import PostCardSkeleton from '@/components/PostCardSkeleton';

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setRecentPosts(res.data.slice(0, 3)); // show top 3 mostly recent
      } catch (err) {
        console.error('Error fetching recent posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient abstract - Lighter celeste themes */}
        <div className="absolute inset-0 bg-linear-to-br from-brand-400 via-brand-500 to-brand-300"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-accent-500 blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-brand-200 blur-3xl opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold font-outfit tracking-tight mb-6 text-white drop-shadow-sm">
            Conectamos tu viaje
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-semibold max-w-2xl mx-auto mb-10">
            Encuentra lugar para viajar o envía tus paquetes de forma segura, rápida y económica viajando con personas certificadas.
          </p>
          
          <div className="flex flex-col gap-3 mt-1 justify-center items-center">
             <Link href="/search" className="primary-button text-lg w-full sm:w-auto px-8 py-4 shadow-xl">
                <Search className="mr-2 h-5 w-5" /> Buscar Lugar
             </Link>
             <Link href="/publish" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-8 py-4 text-lg font-bold transition-all backdrop-blur-sm w-full sm:w-auto flex items-center justify-center shadow-lg">
                Ofrecer un Viaje
             </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Widget Area (Glassmorphism overlap) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 w-full">
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end shadow-2xl shadow-brand-900/10">
          <div className="w-full relative">
            <label className="block text-sm font-bold text-brand-600 mb-1">Origen</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-brand-600" />
              <input type="text" placeholder="Ej. Bahía Blanca" className="pl-10 w-full rounded-xl border border-gray-200 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-gray-500 font-medium" />
            </div>
          </div>
          <div className="w-full relative">
            <label className="block text-sm font-bold text-brand-600 mb-1">Destino</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-brand-600" />
              <input type="text" placeholder="Ej. Olavarría" className="pl-10 w-full rounded-xl border border-gray-200 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-gray-500 font-medium" />
            </div>
          </div>
          <button className="accent-button w-full md:w-auto md:px-8 py-3 h-[50px]">
            Buscar
          </button>
        </div>
      </section>

      {/* What is Ruta Compartida Section */}
      <section id="que-es" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="theme-card rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
                <h2 className="text-3xl md:text-4xl font-black font-outfit mb-6 theme-text">¿Qué es Ruta Compartida?</h2>
                <p className="text-lg theme-text opacity-90 mb-6 leading-relaxed">
                   Ruta Compartida es la plataforma que conecta a personas que necesitan viajar o enviar paquetes con conductores que tienen espacio disponible en sus vehículos.
                </p>
                <p className="text-lg theme-text opacity-90 mb-8 leading-relaxed">
                   Nuestra misión es optimizar los viajes, reducir costos, disminuir el impacto ambiental y crear una comunidad confiable donde todos ganan.
                </p>
                <div className="flex flex-col gap-3 mt-1">
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 font-black text-xl">1</div>
                      <span className="font-bold theme-text">Busca tu ruta</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 font-black text-xl">2</div>
                      <span className="font-bold theme-text">Reserva tu lugar</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 font-black text-xl">3</div>
                      <span className="font-bold theme-text">Viaja seguro</span>
                   </div>
                </div>
             </div>
             <div className="relative">
                <div className="absolute inset-0 bg-linear-to-tr from-brand-100 to-accent-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                <div className="theme-card p-8 rounded-3xl">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/10 p-6 rounded-2xl text-center">
                         <Users className="h-8 w-8 text-white mx-auto mb-3" />
                         <div className="font-bold text-2xl">+5,000</div>
                         <div className="text-sm opacity-80">Usuarios Felices</div>
                      </div>
                      <div className="bg-white/10 p-6 rounded-2xl text-center">
                         <MapPin className="h-8 w-8 text-white mx-auto mb-3" />
                         <div className="font-bold text-2xl">+10,000</div>
                         <div className="text-sm opacity-80">Rutas Conectadas</div>
                      </div>
                      <div className="col-span-2 bg-white/10 p-6 rounded-2xl text-center flex items-center justify-center gap-4">
                         <Star className="h-8 w-8 text-yellow-300 fill-current" />
                         <div className="text-left">
                            <div className="font-bold text-xl">4.8 / 5.0</div>
                            <div className="text-sm opacity-80">Calificación promedio</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-outfit theme-text mb-4">¿Cómo funciona Ruta Compartida?</h2>
            <p className="theme-text font-bold max-w-2xl mx-auto opacity-80">Nuestra plataforma está diseñada para ser simple, rápida y beneficiosa para todos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="theme-card p-8 rounded-3xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Comparte tu Viaje</h3>
              <p className="leading-relaxed opacity-90">Publica tus asientos libres o espacio en la cajuela y ahorra dinero en tus rutas habituales.</p>
            </div>
            
            <div className="theme-card p-8 rounded-3xl hover:shadow-2xl transition-shadow text-center md:text-left md:transform md:-translate-y-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 relative mx-auto md:mx-0">
                <Package className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Envía Paquetes</h3>
              <p className="leading-relaxed opacity-90">Encuentra a alguien que vaya hacia el destino de tu paquete. Más rápido y directo que el correo tradicional.</p>
            </div>

            <div className="theme-card p-8 rounded-3xl hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-outfit">Acorda Facil</h3>
              <p className="leading-relaxed opacity-90">Contacta directamente por WhatsApp, coordina los detalles y viaja con total tranquilidad.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Recent Posts Section (Preview) */}
      <section className="py-20 relative overflow-hidden">
        {/* Abstract background for color */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500/5 blur-3xl rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-linear-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-white/30 dark:border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
               <div>
                 <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
                    Rutas de Hoy
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black font-outfit theme-text mb-4 tracking-tight">Viajes Recientes</h2>
                 <p className="theme-text opacity-90 font-medium max-w-xl text-lg leading-relaxed">Conexiones al instante: úmate a la próxima aventura o envía tus paquetes hoy mismo.</p>
               </div>
               <Link href="/search" className="hidden md:flex items-center gap-3 bg-brand-500 text-white font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all mt-4 md:mt-0 px-8 py-4 rounded-3xl group shadow-lg shadow-brand-500/20">
                 Ver Todas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
               Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={`skeleton-${i}`} isThird={i === 2} />)
            ) : recentPosts.length === 0 ? (
               <div className="col-span-full text-center py-20 bg-current/5 rounded-3xl border-2 border-dashed border-current/10">
                 <p className="theme-text opacity-50 font-bold uppercase tracking-widest text-sm">No hay viajes publicados recientemente.</p>
               </div>
            ) : (
               recentPosts.map((post, idx) => (
                 <PostCard key={post._id} post={post} isThird={idx === 2} />
               ))
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/search" className="primary-button w-full justify-center py-4 rounded-2xl shadow-xl shadow-brand-500/20">
               Explorar todas las rutas
             </Link>
          </div>
        </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-200 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/40">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900 mb-4">Lo que dice nuestra comunidad</h2>
              <p className="text-brand-900 font-medium max-w-2xl mx-auto">Miles de personas ya confían en Ruta Compartida para sus viajes.</p>
            </div>

          <div className="grid md:grid-cols-3 gap-8">
             {/* Review 1 */}
             <div className="theme-card p-8 rounded-3xl shadow-xl relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 opacity-20" />
                <div className="flex gap-1 mb-4 text-yellow-400">
                   <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">&quot;Excelente plataforma. Pude viajar a Capital pagando la mitad de lo que me salía el colectivo y conocí gente muy copada.&quot;</p>
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold">M</div>
                   <div>
                      <div className="font-bold text-gray-900">Martín S.</div>
                      <div className="text-xs text-brand-700 font-semibold">Viajero Frecuente</div>
                   </div>
                </div>
             </div>
             {/* Review 2 */}
             <div className="theme-card p-8 rounded-3xl shadow-xl relative md:-translate-y-4">
                <Quote className="absolute top-6 right-6 h-8 w-8 opacity-20" />
                <div className="flex gap-1 mb-4 text-yellow-400">
                   <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">&quot;Siempre viajo de Bahía Blanca a Olavarría y ahora publico los lugares libres. Me ayuda muchísimo a cubrir los gastos de nafta.&quot;</p>
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold">L</div>
                   <div>
                      <div className="font-bold text-gray-900">Laura G.</div>
                      <div className="text-xs text-brand-700 font-semibold">Conductora</div>
                   </div>
                </div>
             </div>
             {/* Review 3 */}
             <div className="theme-card p-8 rounded-3xl shadow-xl relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 opacity-20" />
                <div className="flex gap-1 mb-4 text-yellow-400">
                   <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5" />
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">&quot;Necesitaba enviar una caja urgente y por correo tardaba días. Conseguí a alguien que viajaba ese mismo día. ¡Un salvavidas!&quot;</p>
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold">D</div>
                   <div>
                      <div className="font-bold text-gray-900">Diego R.</div>
                      <div className="text-xs text-brand-700 font-semibold">Usuario Empaquetador</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="theme-card rounded-4xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-outfit text-gray-900 mb-4">Preguntas Frecuentes</h2>
              <p className="text-brand-900 font-medium">Resolvemos las dudas más comunes de nuestra comunidad.</p>
            </div>

          <div className="space-y-4">
             {/* FAQ Item 1 */}
             <details className="group theme-card rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6">
                  <h2 className="font-medium font-outfit text-lg">¿Es seguro viajar con Ruta Compartida?</h2>
                  <span className="relative size-5 shrink-0">
                    <ChevronDown className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-all text-gray-500" />
                    <ChevronDown className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 group-open:rotate-180 transition-all text-white" />
                  </span>
                </summary>
                <div className="px-6 pb-6 leading-relaxed border-t border-white/10 pt-4 mt-2 opacity-90">
                  Sí. Contamos con un sistema de calificaciones donde puedes ver las reseñas que otros usuarios han dejado al conductor o pasajero antes de aceptar un viaje. Siempre recomendamos verificar el perfil y hablar previamente por WhatsApp para coordinar detalles y generar confianza.
                </div>
             </details>

             {/* FAQ Item 2 */}
             <details className="group theme-card rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6">
                  <h2 className="font-medium font-outfit text-lg">¿Cómo se realiza el pago?</h2>
                  <span className="relative size-5 shrink-0">
                    <ChevronDown className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-all text-gray-500" />
                    <ChevronDown className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 group-open:rotate-180 transition-all text-white" />
                  </span>
                </summary>
                <div className="px-6 pb-6 leading-relaxed border-t border-white/10 pt-4 mt-2 opacity-90">
                  El pago se acuerda directamente entre las partes. La plataforma no cobra comisiones. Recomendamos usar métodos seguros como Mercado Pago o transferencia bancaria en el momento de encontrarse.
                </div>
             </details>

             {/* FAQ Item 3 */}
             <details className="group theme-card rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6">
                  <h2 className="font-medium font-outfit text-lg">¿Cualquiera puede publicar un viaje?</h2>
                  <span className="relative size-5 shrink-0">
                    <ChevronDown className="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-all text-gray-500" />
                    <ChevronDown className="absolute inset-0 size-5 opacity-0 group-open:opacity-100 group-open:rotate-180 transition-all text-white" />
                  </span>
                </summary>
                <div className="px-6 pb-6 leading-relaxed border-t border-white/10 pt-4 mt-2 opacity-90">
                  Sí, cualquier usuario registrado puede publicar que ofrece un lugar o que busca un lugar (ya sea para viajar o para enviar un paquete). El registro es gratuito y rápido.
                </div>
             </details>
          </div>
        </div>
        </div>
      </section>

      {/* Support / Contact Section */}
      <section id="contacto" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-brand-900 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                 <div>
                    <h2 className="text-3xl font-bold font-outfit text-white mb-4">¿Tienes un problema o sugerencia?</h2>
                    <p className="text-brand-100 mb-8">
                       Estamos en constante beta y mejorando para ofrecerte el mejor servicio. Nos encantaría escuchar tu feedback.
                    </p>
                    <div className="flex items-center gap-4 text-white">
                       <MessageSquare className="h-10 w-10 text-brand-300" />
                       <span className="font-medium font-outfit text-xl">¡Escríbenos!</span>
                    </div>
                 </div>

                 <form className="bg-white rounded-2xl p-6 shadow-xl" onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado (Mock)"); }}>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input type="text" required className="w-full rounded-xl border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-brand-500" placeholder="Tu nombre" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje o Reporte</label>
                          <textarea rows="4" required className="w-full rounded-xl border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Describe tu problema o sugerencia..."></textarea>
                       </div>
                       <button type="submit" className="primary-button w-full justify-center">
                          Enviar Mensaje
                       </button>
                    </div>
                 </form>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
