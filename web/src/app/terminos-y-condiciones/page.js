import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, UserCheck, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones | Ruta Compartida',
  description: 'Condiciones de uso y políticas de privacidad de Ruta Compartida.',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/register" className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium mb-6 transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Volver al Registro
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-500/10 rounded-2xl">
               <ShieldCheck className="h-8 w-8 text-brand-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-gray-900 tracking-tight">Términos y Condiciones</h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">Última actualización: {new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="theme-card p-8 md:p-12 rounded-3xl shadow-xl space-y-12">
          
          <section>
            <div className="flex items-center gap-2 mb-4">
               <FileText className="h-5 w-5 text-accent-500" />
               <h2 className="text-2xl font-bold font-outfit text-gray-900">1. Aceptación de los Términos</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Al acceder y utilizar la plataforma <strong>Ruta Compartida</strong>, usted acepta estar sujeto a estos Términos y Condiciones de uso, a todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de cualquier ley local aplicable. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
            </p>
            <div className="bg-brand-50/50 p-4 rounded-xl border border-brand-100">
               <p className="text-sm text-brand-800 font-medium">✨ Estos términos garantizan que toda la comunidad disfrute de viajes seguros y organizados.</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
               <UserCheck className="h-5 w-5 text-accent-500" />
               <h2 className="text-2xl font-bold font-outfit text-gray-900">2. Uso de la Plataforma</h2>
            </div>
            <ul className="space-y-3 text-gray-700 list-disc list-inside ml-2">
              <li>La plataforma conecta a usuarios que desean compartir rutas de viaje con fines de transportar pasajeros o encomiendas.</li>
              <li>Ruta Compartida no es una empresa de transporte ni de logística. Solo actuamos como un intermediario digital (software) para conectar a nuestra comunidad.</li>
              <li>Usted se compromete a proporcionar información real, verificable y exacta en su perfil y publicaciones.</li>
              <li>Nos reservamos el derecho de suspender de manera permanente a los usuarios que realicen publicaciones falsas, cobros abusivos o que quebranten las normas de cortesía.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
               <AlertCircle className="h-5 w-5 text-red-500" />
               <h2 className="text-2xl font-bold font-outfit text-gray-900">3. Limitación de Responsabilidad</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              En ningún caso Ruta Compartida o sus proveedores serán responsables de ningún daño (incluidos, sin limitación, daños por pérdida de datos o ganancias interrupciones del viaje, o pérdida de equipaje) que surjan del uso o la imposibilidad de usar los servicios en Ruta Compartida, incluso si la empresa ha sido notificada verbalmente o por escrito de la posibilidad de tal daño.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Los arreglos de dinero, horarios y puntos de encuentro corren por cuenta y orden estricta de los usuarios contactados. Se recomienda tomar precauciones de seguridad estándar al encontrarse con otros usuarios.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
               <ShieldCheck className="h-5 w-5 text-accent-500" />
               <h2 className="text-2xl font-bold font-outfit text-gray-900">4. Política de Privacidad</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Su privacidad es de suma importancia para nosotros. Los datos (incluyendo números de teléfono, correos electrónicos y nombres) se utilizan pura y exclusivamente para el funcionamiento interno de la Plataforma y nunca serán vendidos a terceros. Al utilizar nuestros servicios, usted consiente la recolección y el uso de su información conforme a estos términos.
            </p>
          </section>

        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
           <p>© {new Date().getFullYear()} Ruta Compartida. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
