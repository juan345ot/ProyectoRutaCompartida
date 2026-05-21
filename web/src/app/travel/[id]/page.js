/**
 * @file Detalle de viaje (ruta dinámica /travel/[id]).
 * @description Server wrapper que delega la UI al componente cliente; fuerza render dinámico en deploy.
 */
import TravelDetailClient from "./TravelDetailClient";

export const dynamic = "force-dynamic";

export default function TravelDetailPage() {
  // --- Render principal ---
  return <TravelDetailClient />;
}
