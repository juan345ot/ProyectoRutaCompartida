"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Route, Mail, Lock, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/search');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('¡Sesión iniciada correctamente!');
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center text-brand-500 mb-6">
           <Route className="h-12 w-12" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold font-outfit">
          Bienvenido de vuelta
        </h2>
        <p className="mt-2 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-bold underline decoration-accent-500 transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="theme-card py-8 px-6 rounded-3xl relative overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-brand-500 to-accent-500" />
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Recordarme</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                icon={ArrowRight}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
            
            <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent opacity-60">O continuar con</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button type="button" className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 font-medium">
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
