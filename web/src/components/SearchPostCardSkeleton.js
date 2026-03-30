export default function SearchPostCardSkeleton() {
  return (
    <div className="theme-card rounded-3xl p-0 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1.5 h-full bg-current opacity-10 rounded-l-3xl"></div>
      
      <div className="relative pl-6 pr-6 py-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="grow">
            <div className="flex items-center gap-2 mb-5">
               <div className="h-6 bg-current opacity-10 rounded-full w-28"></div>
               <div className="h-6 bg-current opacity-5 rounded-full w-24"></div>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center mt-1.5 shrink-0">
                 <div className="w-3 h-3 rounded-full border-2 border-current bg-transparent opacity-10"></div>
                 <div className="w-0.5 h-8 bg-current opacity-5"></div>
                 <div className="w-3 h-3 rounded-full bg-current opacity-10"></div>
              </div>
              <div className="space-y-4 w-full">
                 <div className="space-y-2">
                    <div className="h-3 bg-current opacity-5 rounded w-12"></div>
                    <div className="h-5 bg-current opacity-10 rounded w-48"></div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-3 bg-current opacity-5 rounded w-12"></div>
                    <div className="h-5 bg-current opacity-10 rounded w-40"></div>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between md:items-end md:w-2/5 rounded-2xl border border-current/5 p-4">
            <div className="w-full text-left md:text-right mb-4 md:mb-0 space-y-3">
               <div className="flex flex-col md:items-end gap-1">
                 <div className="h-3 bg-current opacity-5 rounded w-16"></div>
                 <div className="h-4 bg-current opacity-10 rounded w-24"></div>
               </div>
               <div className="flex flex-col md:items-end gap-1 pt-2">
                 <div className="h-3 bg-current opacity-5 rounded w-20"></div>
                 <div className="h-4 bg-current opacity-10 rounded w-32"></div>
               </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 w-full items-center md:items-end">
               <div className="h-3 bg-current opacity-10 rounded w-32 mb-1"></div>
               <div className="h-10 bg-current opacity-5 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
