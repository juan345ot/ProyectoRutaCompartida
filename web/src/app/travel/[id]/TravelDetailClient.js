"use client";
import { useContext, useEffect, useState, useCallback } from "react";
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
  CheckCircle,
  Car,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function TravelDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const uid = user?._id || user?.id;

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch {
      setPost(null);
      toast.error("No se pudo cargar el itinerario");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const authorId = post?.author?._id || post?.author;
  const isOwner = uid && authorId && String(authorId) === String(uid);
  const canViewContact = !!post?._canViewContact;
  const requests = post?.interestRequests || [];
  const myRequest = requests.find(
    (r) => String(r.user?._id || r.user) === String(uid)
  );

  const handleMeInteresa = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Iniciá sesión para mostrar interés.");
      router.push(`/login?redirect=travel/${id}`);
      return;
    }
    if (isOwner) {
      toast.error("Esta publicación ya es tuya.");
      return;
    }
    try {
      await api.post(`/posts/${id}/interest`);
      toast.success("Solicitud enviada. El autor puede aprobarla desde su publicación o acá.");
      loadPost();
    } catch (e) {
      toast.error(e.response?.data?.message || "No pudimos registrar tu interés");
    }
  };

  const handleApprove = async (passengerId) => {
    try {
      await api.patch(`/posts/${id}/interest/${passengerId}`, { action: "approve" });
      toast.success("Solicitud aprobada. Ya pueden coordinar por WhatsApp.");
      loadPost();
    } catch (e) {
      toast.error(e.response?.data?.message || "Error al aprobar");
    }
  };

  const handleReject = async (passengerId) => {
    try {
      await api.patch(`/posts/${id}/interest/${passengerId}`, { action: "reject" });
      toast.success("Solicitud rechazada");
      loadPost();
    } catch (e) {
      toast.error(e.response?.data?.message || "Error");
    }
  };

  const handleComplete = async () => {
    try {
      await api.patch(`/posts/${id}/complete`);
      toast.success("Viaje marcado como completado. Ya podés calificar en Rutas compartidas.");
      loadPost();
    } catch (e) {
      toast.error(e.response?.data?.message || "Error");
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = post ? `Viaje ${post.origin} → ${post.destination}` : "Ruta Compartida";
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Itinerario: ${post?.origin} → ${post?.destination}. Compartido desde Ruta Compartida.`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Enlace del itinerario copiado");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Enlace copiado");
      } catch {
        toast.error("No se pudo compartir");
      }
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated || !uid) {
      toast.error("Iniciá sesión para reportar.");
      return;
    }
    try {
      await api.post("/reports", {
        reportedUserId: post?.author?._id || post?.author,
        postId: post?._id,
        reason: "Reporte desde itinerario de viaje",
        details: `Publicación ${post?._id} ${post?.origin} → ${post?.destination}`,
      });
      toast.success("Reporte registrado. Lo revisamos según nuestras reglas.");
    } catch {
      toast.error("No se pudo enviar el reporte");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center theme-text">Cargando itinerario...</div>
    );
  }
  if (!post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center theme-text">
        No encontramos ese viaje.
      </div>
    );
  }

  const phone = post.author?.phone;
  const waDigits = phone ? String(phone).replace(/\D/g, "") : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="theme-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold theme-text">Itinerario del viaje</h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-200 text-sm font-semibold border border-brand-500/30"
            >
              <Share2 className="h-4 w-4" /> Compartir itinerario
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-sm font-semibold border border-red-500/30"
            >
              <Flag className="h-4 w-4" /> Reportar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl p-4 border border-current/15 bg-white/40 dark:bg-black/20">
            <p className="font-semibold mb-2 flex items-center gap-2 theme-text opacity-90">
              <MapPin className="h-4 w-4" /> Origen
            </p>
            <p className="theme-text font-medium">{post.origin}</p>
          </div>
          <div className="rounded-2xl p-4 border border-current/15 bg-white/40 dark:bg-black/20">
            <p className="font-semibold mb-2 flex items-center gap-2 theme-text opacity-90">
              <MapPin className="h-4 w-4" /> Destino
            </p>
            <p className="theme-text font-medium">{post.destination}</p>
          </div>
          <div className="rounded-2xl p-4 border border-current/15 bg-white/40 dark:bg-black/20">
            <p className="font-semibold mb-2 flex items-center gap-2 theme-text opacity-90">
              <Calendar className="h-4 w-4" /> Salida
            </p>
            <p className="theme-text font-medium">
              {new Date(post.departureDate).toLocaleString("es-AR")}
            </p>
          </div>
          <div className="rounded-2xl p-4 border border-current/15 bg-white/40 dark:bg-black/20">
            <p className="font-semibold mb-2 flex items-center gap-2 theme-text opacity-90">
              <Clock className="h-4 w-4" /> Llegada aproximada
            </p>
            <p className="theme-text font-medium">
              {post.arrivalApprox || "A coordinar con el otro usuario"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm theme-text opacity-80">
          <strong>Capacidad:</strong> {post.capacity}
        </p>

        {post.type === "offer" && post.vehicle?.photoDataUrl && (
          <div className="mt-6 rounded-2xl border border-current/15 overflow-hidden bg-white/30">
            <p className="px-4 py-2 text-sm font-semibold theme-text flex items-center gap-2">
              <Car className="h-4 w-4" /> Vehículo
            </p>
            <div className="relative w-full h-48 md:h-64">
              <Image
                src={post.vehicle.photoDataUrl}
                alt="Vehículo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 text-sm theme-text space-y-1">
              <p>Patente: {post.vehicle.licensePlate}</p>
              <p>
                VTV / revisación:{" "}
                {post.vehicle.vtvExpiry
                  ? new Date(post.vehicle.vtvExpiry).toLocaleDateString("es-AR")
                  : "—"}
              </p>
              <p>Seguro al día declarado: {post.vehicle.insuranceVerified ? "Sí" : "No"}</p>
            </div>
          </div>
        )}

        {post.description && (
          <p className="mt-6 theme-text opacity-85 italic border-l-4 border-brand-500 pl-4">
            &quot;{post.description}&quot;
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {!isOwner && post.status === "active" && (
            <button
              type="button"
              onClick={handleMeInteresa}
              disabled={myRequest?.status === "pending" || myRequest?.status === "approved"}
              className="primary-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {myRequest?.status === "approved"
                ? "Ya estás aprobado"
                : myRequest?.status === "pending"
                ? "Solicitud pendiente"
                : "Me interesa"}
            </button>
          )}

          {canViewContact && phone && post.status === "active" && (
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
              className="accent-button inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> WhatsApp
            </a>
          )}
          {canViewContact && phone && (
            <a href={`tel:${phone}`} className="outline-button inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> Llamar
            </a>
          )}

          {!canViewContact && !isOwner && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 text-sm theme-text opacity-80">
              <UserCheck className="h-4 w-4" /> El teléfono se muestra cuando el autor aprueba tu
              solicitud
            </span>
          )}

          {(isOwner || (myRequest?.status === "approved" && post.status === "active")) && (
            <button type="button" onClick={handleComplete} className="outline-button">
              <CheckCircle className="h-4 w-4 inline mr-1" /> Marcar viaje como completado
            </button>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="theme-card rounded-3xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 theme-text">
            <Users className="h-5 w-5" /> Solicitudes para este viaje
          </h2>
          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="opacity-70 theme-text">No hay solicitudes pendientes.</p>
          ) : (
            <div className="space-y-3">
              {requests
                .filter((r) => r.status === "pending")
                .map((interest) => {
                  const u = interest.user;
                  const pid = u?._id || u;
                  return (
                    <div
                      key={String(pid)}
                      className="border border-current/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold theme-text">{u?.name || "Usuario"}</p>
                        <p className="text-sm opacity-70 theme-text">Quiere sumarse al viaje</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(pid)}
                          className="primary-button text-sm py-2"
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(pid)}
                          className="px-4 py-2 rounded-xl border border-red-300 text-red-700 text-sm font-semibold hover:bg-red-50"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
