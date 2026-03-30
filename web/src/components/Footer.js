import Link from 'next/link';
import { Route, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-900 border-t border-brand-800 text-brand-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2">
             <div className="flex items-center gap-3 mb-6 group cursor-pointer w-fit">
                <div className="relative flex items-center justify-center p-2.5 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all shadow-lg border border-white/5">
                   {/* Logo glow effect */}
                   <div className="absolute inset-0 bg-brand-400 blur-lg opacity-0 group-hover:opacity-60 transition-opacity rounded-2xl"></div>
                   <Route className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-3xl font-extrabold font-outfit text-white tracking-tight">Ruta Compartida</span>
             </div>
             <p className="text-white font-medium text-sm leading-relaxed max-w-md">
                Conectamos personas para viajes compartidos y envío de paquetes de forma económica, segura y rápida.
             </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Ayuda</h3>
            <ul className="space-y-3 text-sm">
               <li><Link href="/#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</Link></li>
               <li><Link href="/#faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
               <li><Link href="/#contacto" className="hover:text-white transition-colors">Reportar un problema</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
               <li><Link href="/terminos-de-servicio" className="hover:text-white transition-colors">Términos de Servicio</Link></li>
               <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
               <li><Link href="/reglas-de-convivencia" className="hover:text-white transition-colors">Reglas de Convivencia</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-center md:text-left text-sm text-brand-100">
            &copy; {new Date().getFullYear()} Ruta Compartida. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Síguenos en Instagram" className="w-12 h-12 rounded-full bg-brand-800 flex items-center justify-center text-white hover:bg-linear-to-tr hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group border border-brand-700 hover:border-transparent">
               <Instagram className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
