import Link from 'next/link';
import { Route, Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Términos de Servicio | Ruta Compartida',
  description: 'Términos y condiciones de uso de la plataforma Ruta Compartida.',
};

export default function TerminosServicioPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-brand-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand-700 to-brand-900 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-brand-300" />
              <Route className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-outfit mb-2">Términos de Servicio</h1>
            <p className="text-brand-200 text-sm">Última actualización: Marzo 2026 · Vigente en la República Argentina</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar la plataforma <strong>Ruta Compartida</strong> (en adelante &quot;la Plataforma&quot;), ya sea a través del sitio web o la aplicación móvil, usted acepta quedar legalmente obligado por los presentes Términos de Servicio. Si no está de acuerdo con alguno de estos términos, le pedimos que no utilice la Plataforma.</p>
            <p className="mt-3">El uso continuado de la Plataforma después de la publicación de cambios en estos Términos constituye su aceptación de dichos cambios. Le recomendamos revisarlos periódicamente.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">2. Descripción del Servicio</h2>
            <p>Ruta Compartida es una plataforma digital que facilita la conexión entre personas que desean <strong>compartir viajes en automóvil particular</strong> o <strong>enviar y recibir paquetes</strong> dentro de la República Argentina. La Plataforma actúa exclusivamente como intermediaria y <strong>no es parte de ningún acuerdo</strong> que se celebre entre los usuarios.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li>Publicación de viajes disponibles u oferta de asientos.</li>
              <li>Búsqueda de viajes según origen, destino y fecha.</li>
              <li>Contacto entre conductores y pasajeros / remitentes y transportistas.</li>
              <li>Sistema de valoraciones y comentarios entre usuarios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">3. Registro y Cuenta de Usuario</h2>
            <p>Para acceder a las funcionalidades completas de la Plataforma, es necesario crear una cuenta. Al registrarse, el usuario declara que:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>Tiene al menos <strong>18 años de edad</strong> o la mayoría de edad en su jurisdicción.</li>
              <li>La información proporcionada es <strong>veraz, completa y actualizada</strong>.</li>
              <li>Es el único responsable de mantener la <strong>confidencialidad de su contraseña</strong>.</li>
              <li>Notificará de inmediato ante cualquier uso no autorizado de su cuenta.</li>
              <li>No creará más de una cuenta por persona.</li>
            </ul>
            <p className="mt-3">Ruta Compartida se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos, sin previo aviso y sin derecho a indemnización.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">4. Obligaciones de los Conductores</h2>
            <p>Los usuarios que actúen como conductores o transportistas se comprometen a:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>Contar con <strong>licencia de conducir válida y vigente</strong>.</li>
              <li>Tener el vehículo con toda la <strong>documentación en regla</strong> (VTV, seguro, verificación técnica).</li>
              <li>No conducir bajo los efectos del alcohol, drogas o cualquier sustancia que altere las capacidades.</li>
              <li>Respetar el Código de Tránsito Nacional y provincial.</li>
              <li>Publicar información veraz sobre el viaje (origen, destino, horario, capacidad).</li>
              <li>No cobrar más del <strong>costo real de combustible y peajes</strong> dividido entre los ocupantes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">5. Obligaciones de los Pasajeros y Remitentes</h2>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>Respetar los <strong>horarios acordados</strong>. La demora injustificada puede resultar en la pérdida del lugar.</li>
              <li>No transportar <strong>objetos ilegales, peligrosos o prohibidos</strong> por la legislación argentina.</li>
              <li>Tratar con respeto al conductor y demás acompañantes.</li>
              <li>Comunicar con anticipación cualquier cancelación.</li>
              <li>Respetar las normas del vehículo (no fumar, uso de cinturón, etc.).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">6. Prohibiciones</h2>
            <p>Queda <strong>estrictamente prohibido</strong> utilizar la Plataforma para:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>Actividades comerciales de transporte remunerado (remises, taxis, flete profesional).</li>
              <li>Publicar información falsa, engañosa o fraudulenta.</li>
              <li>Acoso, intimidación o discriminación hacia otros usuarios.</li>
              <li>Transportar sustancias ilegales, armas o material pornográfico.</li>
              <li>Usar bots, scrapers o cualquier sistema automatizado no autorizado.</li>
              <li>Suplantar la identidad de otra persona.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">7. Limitación de Responsabilidad</h2>
            <p>Ruta Compartida <strong>no verifica</strong> la identidad de los usuarios más allá de los datos declarados al registrarse, ni supervisa los viajes publicados. La Plataforma no es responsable de:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>Daños, lesiones o pérdidas que ocurran durante los viajes.</li>
              <li>Incumplimientos de acuerdos entre usuarios.</li>
              <li>Pérdida o daño de paquetes enviados a través de la Plataforma.</li>
              <li>Conflictos derivados de cancelaciones de último momento.</li>
            </ul>
            <p className="mt-3">Se recomienda a los usuarios adoptar las <strong>precauciones necesarias</strong>: verificar identidad del contacto, compartir el itinerario con familiares y confiar en el sistema de valoraciones.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">8. Propiedad Intelectual</h2>
            <p>Todos los contenidos de la Plataforma (textos, diseños, código fuente, logotipos, íconos) son propiedad exclusiva de Ruta Compartida y están protegidos por las leyes de propiedad intelectual vigentes en Argentina. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">9. Modificaciones</h2>
            <p>Ruta Compartida se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en la Plataforma. El uso continuado equivale a la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">10. Jurisdicción y Ley Aplicable</h2>
            <p>Estos Términos se rigen por las leyes de la <strong>República Argentina</strong>. Cualquier controversia será sometida a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando las partes a cualquier otro fuero que pudiera corresponderles.</p>
          </section>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-800">Para consultas sobre estos Términos, contactanos en: <a href="mailto:legal@rutacompartida.com.ar" className="text-brand-700 font-medium hover:underline">legal@rutacompartida.com.ar</a></p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
