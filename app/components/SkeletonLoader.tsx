// app/components/SkeletonLoader.tsx

const SkeletonBar = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`bg-slate-200 rounded animate-pulse ${width} ${height}`}></div>
);

const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
        <SkeletonBar width="w-3/4" height="h-6" />
        <SkeletonBar />
        <SkeletonBar width="w-5/6" />
        <div className="grid grid-cols-2 gap-4 pt-4">
            <SkeletonBar height="h-16" />
            <SkeletonBar height="h-16" />
        </div>
    </div>
);

export function SkeletonLoader() {
  return (
    <div className="bg-slate-50 min-h-screen">
        <header className="bg-white shadow-md">
            <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-3">
                <SkeletonBar width="w-1/2" height="h-8" />
                <SkeletonBar width="w-3/4" />
            </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
            <section>
                <SkeletonBar width="w-1/4" height="h-7" />
                <div className="mt-4 space-y-3">
                    <SkeletonBar />
                    <SkeletonBar width="w-11/12" />
                </div>
            </section>
            
            <section>
                <SkeletonBar width="w-1/3" height="h-7" />
                <div className="mt-6 space-y-8">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </section>
        </main>
    </div>
  );
}
