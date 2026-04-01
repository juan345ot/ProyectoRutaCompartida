import { Calendar, Users, Package, ArrowRight, Ban, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PostCard({ post, isThird = false }) {
  const isOffer = post.type === 'offer';
  
  // Status logic
  const isPast = new Date(post.departureDate) < new Date();
  const isCanceled = post.status === 'canceled';
  const isFinished = isPast || isCanceled || post.status === 'completed';
  const isFull = String(post.capacity).trim() === '0' || String(post.capacity).toLowerCase().includes('sin lugar') || String(post.capacity).toLowerCase().includes('agotado');
  const isUnavailable = isFinished || isFull;

  const outerClass = `theme-card border text-left rounded-3xl p-6 shadow-lg shadow-current/5 transition-all group relative flex flex-col h-full ${isThird ? 'hidden md:flex' : 'flex'} ${isUnavailable ? 'opacity-80' : 'hover:shadow-xl cursor-pointer hover:-translate-y-1'}`;
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  const cardContent = (
    <>
       <div className="absolute top-0 right-0 w-32 h-32 bg-current/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
       
       <div className="flex justify-between items-start mb-6 relative">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider md:whitespace-nowrap ${isOffer ? 'bg-brand-500/10 text-brand-600' : 'bg-accent-500/10 text-accent-600'}`}>
             {isOffer ? 'Ofrece Lugar' : 'Busca Enviar'}
          </div>
          <div className="text-right">
             <div className="text-xl font-bold font-outfit text-brand-700 dark:text-brand-300">A convenir</div>
             <div className="text-xs opacity-60 capitalize">{post.category === 'passenger' ? 'Por pasajero' : 'Por paquete'}</div>
          </div>
       </div>
       
       <div className="space-y-4 relative grow">
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

       {/* Action Area */}
       <div className="mt-4 pt-4 border-t border-current/10">
         {isUnavailable ? (
           <div className="flex justify-center items-center py-2 w-full rounded-xl bg-gray-500/10 text-gray-500 font-semibold text-sm gap-2">
             {isFinished ? (
               <><CheckCircle className="h-4 w-4" /> Viaje Finalizado</>
             ) : (
               <><Ban className="h-4 w-4" /> Sin lugar disponible</>
             )}
           </div>
         ) : (
           <div className="flex justify-center items-center py-2 w-full rounded-xl bg-brand-500/10 text-brand-600 font-semibold text-sm gap-2 group-hover:bg-brand-500 group-hover:text-white transition-colors">
             Ver detalles <ArrowRight className="h-4 w-4" />
           </div>
         )}
       </div>
    </>
  );

  if (isUnavailable) {
    return <div className={outerClass}>{cardContent}</div>;
  }

  return (
    <Link href={`/travel/${post._id}`} className={outerClass}>
      {cardContent}
    </Link>
  );

}
