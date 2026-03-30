export default function PostCardSkeleton({ isThird = false }) {
  const outerClass = `theme-card border text-left rounded-3xl p-6 relative overflow-hidden ${isThird ? 'hidden md:block' : ''}`;
  return (
    <div className={outerClass}>
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="h-6 bg-current opacity-10 rounded-full w-24"></div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-6 bg-current opacity-10 rounded w-20"></div>
            <div className="h-3 bg-current opacity-10 rounded w-16"></div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
             <div className="h-4 bg-current opacity-10 rounded w-32"></div>
          </div>
          <div className="ml-1 w-0.5 h-6 bg-current opacity-5"></div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
             <div className="h-4 bg-current opacity-10 rounded w-40"></div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-current/10 flex items-center justify-between">
           <div className="h-4 bg-current opacity-10 rounded w-16"></div>
           <div className="h-4 bg-current opacity-10 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}
