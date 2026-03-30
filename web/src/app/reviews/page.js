"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, User, Send } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState({ received: [], given: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState("received");

  const load = useCallback(async () => {
    try {
      const res = await api.get("/reviews/me");
      setData(res.data || { received: [], given: [] });
    } catch {
      toast.error("Error al cargar las opiniones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && user) load();
  }, [isAuthenticated, user, load]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("es-AR");

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  const roleLabel = (r, kind) => {
    if (kind === "received") {
      if (r.reviewerRole === "driver") return "Te calificó el conductor (vos eras pasajero)";
      return "Te calificó un pasajero (vos eras conductor)";
    }
    if (r.reviewerRole === "driver") return "Emitida por vos como conductor";
    return "Emitida por vos como pasajero";
  };

  if (loading || !isAuthenticated) return null;

  const received = data.received || [];
  const given = data.given || [];
  const list = section === "received" ? received : given;

  return (
    <div className="min-h-screen bg-transparent py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
              <Star className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold theme-text font-outfit">Mis calificaciones</h1>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl px-4 py-2 border border-amber-100 flex items-center gap-2">
            <span className="text-amber-700 dark:text-amber-300 font-bold text-xl">
              {user.averageRating || "0.0"}
            </span>
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="text-sm text-amber-800 dark:text-amber-200">({user.totalReviews || 0})</span>
          </div>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => setSection("received")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 ${
              section === "received"
                ? "bg-brand-600 text-white"
                : "bg-white/80 theme-text border border-brand-200"
            }`}
          >
            <User className="h-4 w-4" /> Que recibí ({received.length})
          </button>
          <button
            type="button"
            onClick={() => setSection("given")}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 ${
              section === "given"
                ? "bg-brand-600 text-white"
                : "bg-white/80 theme-text border border-brand-200"
            }`}
          >
            <Send className="h-4 w-4" /> Que hice ({given.length})
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
          </div>
        ) : list.length === 0 ? (
          <div className="theme-card rounded-3xl shadow-xl border p-12 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold mb-2">No hay opiniones en esta sección</h3>
            <p className="opacity-80">Cuando completes viajes y haya calificaciones, verás el detalle acá.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {section === "received"
              ? received.map((review) => (
                  <div
                    key={review._id}
                    className="theme-card rounded-3xl shadow-lg border p-6 flex flex-col sm:flex-row gap-6"
                  >
                    <div className="shrink-0 flex flex-col items-center w-32">
                      <div className="h-14 w-14 rounded-full relative overflow-hidden mb-2 border-2 border-brand-100">
                        <Image
                          src={
                            review.author?.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author?.name || "U")}&background=14b8a6&color=fff`
                          }
                          alt={review.author?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-center">{review.author?.name}</span>
                      <span className="text-xs opacity-70">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                        {roleLabel(review, "received")}
                      </p>
                      <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                      <p className="italic opacity-90">&quot;{review.comment}&quot;</p>
                      <p className="mt-3 text-xs opacity-60">
                        Viaje: {review.post?.origin} → {review.post?.destination}
                      </p>
                    </div>
                  </div>
                ))
              : given.map((review) => (
                  <div
                    key={review._id}
                    className="theme-card rounded-3xl shadow-lg border p-6 flex flex-col sm:flex-row gap-6"
                  >
                    <div className="shrink-0 flex flex-col items-center w-32">
                      <div className="h-14 w-14 rounded-full relative overflow-hidden mb-2 border-2 border-brand-100">
                        <Image
                          src={
                            review.recipient?.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(review.recipient?.name || "U")}&background=14b8a6&color=fff`
                          }
                          alt={review.recipient?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-center">{review.recipient?.name}</span>
                      <span className="text-xs opacity-70">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
                        {roleLabel(review, "given")}
                      </p>
                      <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
                      <p className="italic opacity-90">&quot;{review.comment}&quot;</p>
                      <p className="mt-3 text-xs opacity-60">
                        Viaje: {review.post?.origin} → {review.post?.destination}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
