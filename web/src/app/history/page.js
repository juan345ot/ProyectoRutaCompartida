"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Map, MapPin, Calendar, Star } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

function counterpartsForPost(post, myId) {
  const me = String(myId);
  const authorId = post.author?._id ? String(post.author._id) : String(post.author);
  const approved = (post.interestRequests || [])
    .filter((r) => r.status === "approved" && r.user)
    .map((r) => ({
      _id: r.user._id || r.user,
      name: r.user.name || "Usuario",
    }));

  if (post.type === "offer") {
    if (authorId === me) {
      return approved.filter((u) => String(u._id) !== me);
    }
    if (approved.some((u) => String(u._id) === me)) {
      return [{ _id: post.author._id || post.author, name: post.author?.name || "Conductor" }];
    }
  } else {
    if (authorId === me) {
      return approved.filter((u) => String(u._id) !== me);
    }
    if (approved.some((u) => String(u._id) === me)) {
      return [{ _id: post.author._id || post.author, name: post.author?.name || "Pasajero" }];
    }
  }
  return [];
}

export default function HistoryPage() {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const router = useRouter();
  const myId = user?._id || user?.id;

  const [offered, setOffered] = useState([]);
  const [joined, setJoined] = useState([]);
  const [tab, setTab] = useState("offered");
  const [isLoading, setIsLoading] = useState(true);
  const [myReviews, setMyReviews] = useState({ received: [], given: [] });
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = useCallback(async () => {
    try {
      const [histRes, revRes] = await Promise.all([
        api.get("/users/me/history"),
        api.get("/reviews/me"),
      ]);
      setOffered(histRes.data.offered || []);
      setJoined(histRes.data.joined || []);
      setMyReviews(revRes.data || { received: [], given: [] });
    } catch {
      toast.error("No se pudo cargar el historial");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const alreadyReviewed = (postId, recipientId) => {
    return (myReviews.given || []).some(
      (r) =>
        String(r.post?._id || r.post) === String(postId) &&
        String(r.recipient?._id || r.recipient) === String(recipientId)
    );
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        postId: reviewModal.postId,
        recipientId: reviewModal.recipientId,
        rating,
        comment: comment.trim() || "Sin comentario adicional",
      });
      toast.success("¡Gracias por tu calificación!");
      setReviewModal(null);
      setComment("");
      setRating(5);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "No se pudo enviar la calificación");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  const list = tab === "offered" ? offered : joined;
  const tabLabelOffered = "Lo que ofrecí / conducí";
  const tabLabelJoined = "Lo que busqué / en lo que viajé";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-transparent py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
            <Map className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold theme-text font-outfit">Mis Rutas Compartidas</h1>
        </div>
        <p className="theme-text opacity-90 mb-6 max-w-3xl">
          Viajes completados: separados entre cuando ofreciste lugar o conducías, y cuando buscabas lugar o
          viajabas como pasajero. Acá podés calificar a quien te acompañó en cada viaje.
        </p>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => setTab("offered")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              tab === "offered"
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white/80 text-brand-800 border border-brand-200"
            }`}
          >
            {tabLabelOffered} ({offered.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("joined")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              tab === "joined"
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white/80 text-brand-800 border border-brand-200"
            }`}
          >
            {tabLabelJoined} ({joined.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
          </div>
        ) : list.length === 0 ? (
          <div className="theme-card rounded-3xl border p-12 text-center shadow-xl max-w-2xl mx-auto">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold mb-2">Todavía no hay viajes en esta sección</h3>
            <p className="opacity-80 mb-6">
              Cuando marques un viaje como completado en el itinerario, aparecerá acá.
            </p>
            <Link href="/search" className="primary-button inline-block">
              Buscar publicaciones
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {list.map((post) => (
              <div
                key={post._id}
                className="theme-card rounded-3xl shadow-lg overflow-hidden flex flex-col sm:flex-row items-stretch justify-between p-6 gap-4 border border-current/10"
              >
                <div className="flex-1 min-w-0 border-l-4 border-brand-500 pl-4">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-brand-600 bg-brand-50 dark:bg-brand-900/30 w-fit px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" /> {formatDate(post.departureDate)}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg font-bold mb-2">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {post.origin}
                    </span>
                    <span className="text-brand-400 hidden sm:inline">→</span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {post.destination}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">
                    {post.type === "offer" ? "Publicación: ofrecía lugar" : "Publicación: buscaba lugar"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:w-56">
                  <Link href={`/travel/${post._id}`} className="outline-button text-center text-sm py-2.5">
                    Ver itinerario
                  </Link>
                  {counterpartsForPost(post, myId).map((cp) =>
                    alreadyReviewed(post._id, cp._id) ? (
                      <span
                        key={String(cp._id)}
                        className="text-xs text-center opacity-70 flex items-center justify-center gap-1"
                      >
                        <Star className="h-3 w-3" /> Ya calificaste a {cp.name}
                      </span>
                    ) : (
                      <button
                        key={String(cp._id)}
                        type="button"
                        onClick={() =>
                          setReviewModal({
                            postId: post._id,
                            recipientId: cp._id,
                            recipientName: cp.name,
                            tripLabel: `${post.origin} → ${post.destination}`,
                          })
                        }
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 w-full px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-amber-200 text-sm"
                      >
                        <Star className="h-4 w-4" /> Calificar a {cp.name.split(" ")[0]}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Calificar usuario</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {reviewModal.tripLabel} · {reviewModal.recipientName}
            </p>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Puntaje
            </label>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`p-2 rounded-lg ${n <= rating ? "text-amber-400" : "text-gray-300"}`}
                >
                  <Star className={`h-8 w-8 ${n <= rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Comentario
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 mb-4"
              rows={3}
              placeholder="Contá cómo fue el viaje..."
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={submitReview}
                className="primary-button px-6 py-2"
              >
                {submittingReview ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
