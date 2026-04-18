"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifications();
    }, 0);
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read');
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-current/10 transition-colors relative group"
      >
        <Bell className={`h-6 w-6 transition-colors ${unreadCount > 0 ? 'text-brand-500 animate-pulse' : 'theme-text opacity-70 group-hover:opacity-100'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-[70px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:-right-2 sm:mt-2 w-auto sm:w-80 md:w-96 theme-card rounded-3xl shadow-2xl overflow-hidden z-[100] border border-current/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-current/5 flex items-center justify-between bg-current/5">
            <h3 className="font-black text-sm uppercase tracking-widest theme-text">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Marcar como leídas
              </button>
            )}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell className="h-10 w-10 mx-auto opacity-10 mb-2 theme-text" />
                <p className="text-xs theme-text opacity-50 font-bold">No tienes notificaciones aún</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => markOneRead(n._id)}
                  className={`p-4 border-b border-current/5 transition-colors relative cursor-pointer hover:bg-current/5 ${!n.read ? 'bg-brand-500/5' : ''}`}
                >
                  {!n.read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-full" />}
                  
                  <div className="flex gap-3">
                    <div className="grow">
                      <p className={`text-xs leading-relaxed theme-text ${!n.read ? 'font-bold' : 'opacity-70'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] theme-text opacity-40 mt-1">
                        {new Date(n.createdAt).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </p>
                      {n.link && (
                        <Link 
                          href={n.link}
                          onClick={() => setIsOpen(false)}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase text-brand-600 border border-brand-500/20 px-2 py-1 rounded-lg hover:bg-brand-500 hover:text-white transition-all"
                        >
                          Ver detalle <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Link 
            href="/my-bookings" 
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-[10px] font-black uppercase tracking-widest bg-current/5 hover:bg-current/10 theme-text transition-colors"
          >
            Ver todas mis solicitudes
          </Link>
        </div>
      )}
    </div>
  );
}
