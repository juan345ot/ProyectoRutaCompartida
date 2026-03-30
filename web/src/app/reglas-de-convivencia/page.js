import Link from 'next/link';
import { Route, Heart, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Reglas de Convivencia | Ruta Compartida',
  description: 'Normas de convivencia para garantizar viajes seguros, respetuosos y agradables en Ruta Compartida.',
};

export default function ReglasConvivenciaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-brand-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand-700 to-brand-900 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-pink-400" />
              <Route className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-outfit mb-2">Reglas de Convivencia</h1>
            <p className="text-brand-200 text-sm">Para que cada viaje sea una buena experiencia para todos</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 leading-relaxed">

          <section>
            <p className="text-lg text-gray-600">En Ruta Compartida creemos que compartir un viaje puede ser mucho más que trasladarse de un punto A a un punto B. Es una oportunidad de conectar personas, ahorrar costos y cuidar el medio ambiente. Para que eso funcione, todos debemos contribuir a un ambiente <strong>seguro, respetuoso y agradable</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">✅ Lo que esperamos de todos los usuarios</h2>
            <div className="space-y-4">
              {[
                { title: 'Puntualidad', desc: 'Llegar a la hora acordada. Si hay un imprevisto, avisar con la mayor antelación posible. El tiempo de los demás también es valioso.' },
                { title: 'Comunicación clara', desc: 'Antes del viaje, acordar puntos de encuentro, horarios y cualquier detalle relevante. Ante la duda, preguntar.' },
                { title: 'Respeto mutuo', desc: 'Tratar a todos los participantes con cortesía y respeto, independientemente del género, edad, origen, religión u orientación sexual.' },
                { title: 'Honestidad en las publicaciones', desc: 'Publicar información veraz: precio real, punto de salida exacto, capacidad disponible y horario real.' },
                { title: 'Cuidado del vehículo', desc: 'Los pasajeros deben tratar el vehículo del conductor con cuidado. Cualquier daño accidental debe comunicarse y, si corresponde, resarcirse.' },
                { title: 'Seguridad vial', desc: 'Los conductores deben cumplir con el Código de Tránsito. Los pasajeros deben usar siempre el cinturón de seguridad.' },
                { title: 'Privacidad de contacto', desc: 'La información de contacto (teléfono) compartida en la plataforma es exclusivamente para coordinar el viaje. No debe usarse con otros fines.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">{title}: </span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-200">❌ Conductas que no toleramos</h2>
            <div className="space-y-4">
              {[
                { title: 'Discriminación', desc: 'Cualquier trato discriminatorio por motivos de género, raza, religión, discapacidad, orientación sexual o cualquier otra condición personal.' },
                { title: 'Acoso o intimidación', desc: 'Comentarios inapropiados, mensajes no deseados, comportamientos intimidantes o cualquier forma de acoso físico o verbal.' },
                { title: 'Transporte de objetos ilegales', desc: 'Drogas, armas, material pirotécnico u objetos prohibidos por la ley argentina. Las consecuencias legales recaen exclusivamente sobre quien transporta.' },
                { title: 'Cancelaciones reiteradas sin aviso', desc: 'Cancelar publicaciones habitualmente a último momento afecta la confianza de toda la comunidad.' },
                { title: 'Cobros abusivos', desc: 'El precio publicado no puede exceder la división equitativa de los gastos de combustible y peajes. La plataforma no permite transporte comercial remunerado.' },
                { title: 'Perfiles falsos', desc: 'Usar identidades falsas, fotos de otras personas o datos inventados. Esto pone en riesgo la seguridad de toda la comunidad.' },
                { title: 'Uso del teléfono al volante', desc: 'Los conductores no pueden usar el teléfono mientras manejan. Es ilegal y pone en peligro la vida de todos.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">{title}: </span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">🛡️ Consejos de Seguridad</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3">
              <p className="font-semibold text-amber-800">Antes de viajar, te recomendamos:</p>
              <ul className="list-disc list-inside space-y-2 text-amber-700">
                <li>Verificar el perfil del otro usuario: foto, nombre, valoraciones recibidas.</li>
                <li>Comunicarte por la plataforma antes de dar tu número personal.</li>
                <li>Compartir tu itinerario (origen, destino, hora estimada de llegada) con una persona de confianza.</li>
                <li>Llevar tu documento de identidad siempre.</li>
                <li>Confiar en tu instinto: si algo no te genera confianza, no viajes.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">⚖️ Consecuencias del Incumplimiento</h2>
            <p>Las violaciones a estas reglas pueden resultar en:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li><strong>Advertencia formal</strong> por parte del equipo de Ruta Compartida.</li>
              <li><strong>Suspensión temporal</strong> de la cuenta (7 a 30 días).</li>
              <li><strong>Eliminación permanente</strong> de la cuenta sin posibilidad de recuperación.</li>
              <li>En casos que constituyan delitos, la <strong>denuncia ante las autoridades competentes</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">📣 Reportar Conductas Inapropiadas</h2>
            <p>Si presenciás o sufrís alguna conducta que viole estas reglas, podés reportarla a través de:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li>El botón de reporte disponible en el perfil de cada usuario.</li>
              <li>Escribiendo a <a href="mailto:seguridad@rutacompartida.com.ar" className="text-brand-600 hover:underline">seguridad@rutacompartida.com.ar</a></li>
            </ul>
            <p className="mt-3 text-gray-500 text-sm">Todos los reportes son analizados por nuestro equipo en un plazo máximo de 48 horas. La identidad del denunciante se mantiene estrictamente confidencial.</p>
          </section>

          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 text-center">
            <p className="text-brand-800 font-semibold text-lg">¡Gracias por ser parte de Ruta Compartida!</p>
            <p className="text-brand-600 mt-1">Cada usuario que respeta estas reglas contribuye a que nuestra comunidad sea más segura y confiable para todos.</p>
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
