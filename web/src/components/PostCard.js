import { Calendar, Users, Package } from 'lucide-react';

export default function PostCard({ post, isThird = false }) {
  const isOffer = post.type === 'offer';
  const outerClass = `theme-card border text-left rounded-3xl p-6 shadow-lg shadow-current/5 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden ${isThird ? 'hidden md:block' : ''}`;
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div className={outerClass}>
       <div className="absolute top-0 right-0 w-32 h-32 bg-current/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
       
       <div className="flex justify-between items-start mb-6 relative">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider md:whitespace-nowrap ${isOffer ? 'bg-brand-500/10 text-brand-600' : 'bg-accent-500/10 text-accent-600'}`}>
             {isOffer ? 'Ofrece Lugar' : 'Busca Enviar'}
          </div>
          <div className="text-right">
             <div className="text-xl font-bold font-outfit">A convenir</div>
             <div className="text-xs opacity-60 capitalize">{post.category === 'passenger' ? 'Por pasajero' : 'Por paquete'}</div>
          </div>
       </div>
       
       <div className="space-y-4 relative">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isOffer ? 'bg-brand-500' : 'bg-accent-500'}`}></div>
             <p className="font-semibold line-clamp-1" title={post.origin}>{post.origin}</p>
          </div>
          <div className="ml-1 w-0.5 h-6 bg-current opacity-10"></div>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isOffer ? 'bg-brand-500' : 'bg-accent-500'}`}></div>
             <p className="font-semibold line-clamp-1" title={post.destination}>{post.destination}</p>
          </div>
       </div>
       
       <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-sm opacity-80 font-medium">
          <div className="flex items-center gap-2 capitalize"><Calendar className="h-4 w-4" /> {formatDate(post.departureDate)}</div>
          <div className="flex items-center gap-2 truncate max-w-[50%]">
            {post.category === 'passenger' ? <Users className="h-4 w-4 shrink-0" /> : <Package className="h-4 w-4 shrink-0" />}
            <span className="truncate" title={post.capacity}>{post.capacity}</span>
          </div>
       </div>
    </div>
  );
}
