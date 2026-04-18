"use client";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, MapPin, Package, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        activeTrips: 0,
        packagesPending: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get('/users/admin/stats');
            setStats({
                totalUsers: res.data.totalUsers || 0,
                totalPosts: res.data.totalPosts || 0,
                activeTrips: res.data.activePosts || 0,
                packagesPending: res.data.completedPosts || 0 // Reusing this slot for completed for now or just as labels
            });
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar estadísticas reales');
            setIsLoading(false);
        }
    };

    // Effect for redirection/auth check
    useEffect(() => {
        if (!loading) {
            const isAdmin = user?.role === 'admin' || user?.email === 'juanignacio295@gmail.com';
            if (!isAuthenticated || !isAdmin) {
                toast.error('Acceso denegado: Se requieren permisos de administrador.');
                router.push('/');
            }
        }
    }, [isAuthenticated, user, loading, router]);

    // Effect for fetching stats
    useEffect(() => {
        const isAdmin = user?.role === 'admin' || user?.email === 'juanignacio295@gmail.com';
        if (isAuthenticated && isAdmin) {
            Promise.resolve().then(() => fetchStats());
        }
    }, [isAuthenticated, user]);

    if (loading || isLoading) return <div className="p-20 text-center font-bold animate-pulse theme-text">Cargando Centro de Control...</div>;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <div className="bg-brand-900 pt-10 pb-32 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-brand-500 p-3 rounded-2xl shadow-lg shadow-brand-500/20">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white font-outfit">Panel de Control Administrativo</h1>
                            <p className="text-brand-200">Bienvenido, Admin {user?.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard icon={Users} label="Usuarios Totales" value={stats.totalUsers} color="blue" />
                        <StatCard icon={MapPin} label="Publicaciones Totales" value={stats.totalPosts} color="teal" />
                        <StatCard icon={Activity} label="Viajes Activos" value={stats.activeTrips} color="orange" />
                        <StatCard icon={Package} label="Viajes Finalizados" value={stats.packagesPending} color="purple" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 theme-card rounded-3xl p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-outfit">Actividad Reciente del Sistema</h3>
                            <BarChart3 className="text-brand-500" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-current/5 hover:border-brand-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-600 font-bold">{i}</div>
                                        <div>
                                            <p className="font-bold text-sm">Registro de actividad del servidor</p>
                                            <p className="text-xs opacity-60">Evento sincronizado correctamente</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-600 rounded-lg">ONLINE</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <div className="theme-card rounded-3xl p-8 shadow-xl border-l-4 border-brand-500">
                            <div className="flex items-center gap-3 mb-4 text-brand-600">
                                <AlertCircle className="h-6 w-6" />
                                <h3 className="font-bold font-outfit text-lg">Estado del Servidor</h3>
                            </div>
                            <p className="text-sm opacity-70 mb-4">Todos los servicios están operativos. No se detectan anomalías en la base de datos.</p>
                            <button className="w-full py-3 bg-brand-500/10 text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-500/20 transition-all">Ver Logs Detallados</button>
                        </div>

                        <div className="theme-card rounded-3xl p-8 shadow-xl bg-linear-to-br from-brand-700 to-brand-900 text-white border-0">
                            <h3 className="text-xl font-bold font-outfit mb-4">Mantenimiento</h3>
                            <p className="text-sm opacity-90 mb-6">Próxima optimización de recursos programada para el cierre del día.</p>
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-400 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="theme-card rounded-3xl p-6 shadow-xl border-b-4 border-transparent hover:border-brand-500 transition-all group">
            <div className={`p-3 rounded-2xl bg-brand-500/10 text-brand-600 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold opacity-60 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-extrabold font-outfit mt-1">{value.toLocaleString()}</p>
        </div>
    );
}
