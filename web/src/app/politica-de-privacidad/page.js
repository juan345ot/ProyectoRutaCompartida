import Link from 'next/link';
import { Route, Lock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | Ruta Compartida',
  description: 'Información sobre cómo recopilamos, usamos y protegemos tus datos personales.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-brand-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand-700 to-brand-900 opacity-60" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-8 w-8 text-brand-300" />
              <Route className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-outfit mb-2">Política de Privacidad</h1>
            <p className="text-brand-200 text-sm">Última actualización: Marzo 2026 · Cumplimiento con Ley 25.326 (PDPA Argentina)</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">1. Responsable del Tratamiento de Datos</h2>
            <p>Ruta Compartida (en adelante &quot;nosotros&quot; o &quot;la Plataforma&quot;) es el responsable del tratamiento de los datos personales que usted nos proporciona. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información personal, en cumplimiento con la <strong>Ley Nacional N° 25.326 de Protección de los Datos Personales</strong> de la República Argentina.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">2. Datos que Recopilamos</h2>
            <h3 className="font-semibold text-gray-800 mb-2">2.1 Datos que usted nos proporciona directamente:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
              <li><strong>Nombre completo</strong>: para identificarlo en la plataforma.</li>
              <li><strong>Correo electrónico</strong>: para autenticación y comunicaciones.</li>
              <li><strong>Número de teléfono</strong>: para que otros usuarios puedan contactarlo.</li>
              <li><strong>Foto de perfil</strong> (opcional): para facilitar el reconocimiento.</li>
              <li><strong>Publicaciones de viaje</strong>: origen, destino, fechas, descripción.</li>
            </ul>
            <h3 className="font-semibold text-gray-800 mb-2">2.2 Datos recopilados automáticamente:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Dirección IP y datos de navegación.</li>
              <li>Tipo de dispositivo y navegador.</li>
              <li>Fechas y horas de acceso.</li>
              <li>Páginas visitadas dentro de la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">3. Finalidad del Tratamiento</h2>
            <p>Utilizamos sus datos exclusivamente para las siguientes finalidades:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li><strong>Prestación del servicio</strong>: crear y gestionar su cuenta, mostrar sus publicaciones a otros usuarios.</li>
              <li><strong>Comunicación</strong>: enviar notificaciones sobre la plataforma, cambios en los términos o respuestas a consultas.</li>
              <li><strong>Seguridad</strong>: detectar, prevenir y responder a fraudes, abusos y actividades no autorizadas.</li>
              <li><strong>Mejora del servicio</strong>: analizar el comportamiento de uso de forma anonimizada para mejorar la experiencia.</li>
              <li><strong>Cumplimiento legal</strong>: responder a requerimientos judiciales o de organismos gubernamentales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">4. Compartición de Datos con Terceros</h2>
            <p>Su número de teléfono y nombre son <strong>visibles para otros usuarios registrados</strong> que consulten su publicación, a fin de facilitar el contacto. No vendemos, cedemos ni comercializamos sus datos personales a terceros con fines comerciales.</p>
            <p className="mt-3">Podemos compartir datos con:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              <li><strong>Proveedores de infraestructura</strong> (servidores, bases de datos): bajo estrictos acuerdos de confidencialidad.</li>
              <li><strong>Autoridades competentes</strong>: únicamente ante requerimiento legal debidamente fundado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">5. Almacenamiento y Seguridad</h2>
            <p>Sus datos se almacenan en servidores seguros ubicados en infraestructura cloud con cifrado SSL/TLS. Las contraseñas se almacenan usando <strong>hash bcrypt</strong> y nunca en texto plano. Implementamos medidas técnicas y organizativas para proteger su información contra acceso no autorizado, pérdida o destrucción.</p>
            <p className="mt-3">Sin embargo, ningún sistema es completamente infalible. En caso de una brecha de seguridad que afecte sus datos, nos comprometemos a notificarlo dentro de las <strong>72 horas</strong> de haberla detectado, de acuerdo con lo establecido por la Dirección Nacional de Protección de Datos Personales.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">6. Retención de Datos</h2>
            <p>Conservamos sus datos personales durante el tiempo que su cuenta permanezca activa. Tras la eliminación de la cuenta, los datos se eliminarán en un plazo máximo de <strong>90 días</strong>, salvo que la ley exija su conservación por un período mayor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">7. Sus Derechos (Ley 25.326)</h2>
            <p>Como titular de los datos, usted tiene derecho a:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-600">
              <li><strong>Acceso</strong>: solicitar una copia de los datos que tenemos sobre usted.</li>
              <li><strong>Rectificación</strong>: corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión</strong>: solicitar la eliminación de sus datos (&quot;derecho al olvido&quot;).</li>
              <li><strong>Oposición</strong>: oponerse al tratamiento de sus datos para determinadas finalidades.</li>
              <li><strong>Portabilidad</strong>: recibir sus datos en formato estructurado y legible.</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos, envíe un correo a <a href="mailto:privacidad@rutacompartida.com.ar" className="text-brand-600 hover:underline">privacidad@rutacompartida.com.ar</a>. Responderemos en un plazo máximo de <strong>30 días hábiles</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">8. Cookies y Tecnologías de Seguimiento</h2>
            <p>Utilizamos cookies de sesión esenciales para el funcionamiento del sitio (autenticación). No utilizamos cookies de seguimiento publicitario ni compartimos datos con redes publicitarias.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">9. Menores de Edad</h2>
            <p>La Plataforma <strong>no está dirigida a menores de 18 años</strong>. Si tomamos conocimiento de que hemos recopilado datos de un menor sin el consentimiento parental correspondiente, procederemos a eliminar dicha información de inmediato.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">10. Contacto y Autoridad de Control</h2>
            <p>Para consultas sobre privacidad: <a href="mailto:privacidad@rutacompartida.com.ar" className="text-brand-600 hover:underline">privacidad@rutacompartida.com.ar</a></p>
            <p className="mt-2">Tiene derecho a presentar una denuncia ante la <strong>Dirección Nacional de Protección de Datos Personales</strong> (DNPDP) si considera que sus derechos han sido vulnerados: <a href="https://www.argentina.gob.ar/aaip/datospersonales" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">www.argentina.gob.ar/aaip/datospersonales</a></p>
          </section>

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
