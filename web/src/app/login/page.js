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
  
  const { login, loginWithGoogle, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const handleGoogleResponse = useCallback(async (response) => {
    setIsLoading(true);
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      await loginWithGoogle({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        profileImage: payload.picture
      });
      
      toast.success('¡Sesión iniciada con Google!');
    } catch (err) {
      console.error(err);
      toast.error('Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  }, [loginWithGoogle]);

  useEffect(() => {
    /* global google */
    if (typeof window !== 'undefined' && window.google) {
      const initializeGoogle = () => {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
        );
      };
      
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        initializeGoogle();
      }
    }
  }, [handleGoogleResponse]);

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
                  <div id="googleBtn" className="w-full h-[40px] flex justify-center"></div>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
