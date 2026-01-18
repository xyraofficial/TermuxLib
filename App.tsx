
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_PACKAGES } from './constants';
import { 
  TerminalIcon, 
  SearchIcon, 
  PackageIcon,
  ArrowUpIcon,
} from './components/Icons';
import CommandSnippet from './components/CommandSnippet';
import Preloader from './components/Preloader';

type FilterType = 'all' | 'pkg' | 'pip';

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  const packageSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, filter]);

  const filteredPackages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return INITIAL_PACKAGES.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                            p.description.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query);
      
      const matchesFilter = filter === 'all' || p.source === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filter]);

  const displayedPackages = useMemo(() => {
    return filteredPackages.slice(0, visibleCount);
  }, [filteredPackages, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const scrollToPackages = () => {
    if (packageSectionRef.current) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = packageSectionRef.current.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      <div className={`min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30 pb-10 transition-all duration-1000 ${!isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Background Glow Effect */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-900 px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-black p-1.5 rounded-lg text-white border border-zinc-800 shadow-lg shadow-black/40 hover:scale-105 transition-transform duration-300">
                  <TerminalIcon />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white leading-none">TermuxLib</h1>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">v1.0 • Info & Script Library</p>
                </div>
              </div>
              <div className="hidden sm:block text-[10px] font-mono text-zinc-400 px-2 py-1 rounded bg-zinc-800 border border-zinc-700">
                {filteredPackages.length} TOOLS MATCHED
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Cari tool atau library..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
              </div>

              <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 shrink-0 self-start sm:self-auto shadow-lg">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${filter === 'all' ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setFilter('pkg')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${filter === 'pkg' ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  PKG
                </button>
                <button 
                  onClick={() => setFilter('pip')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${filter === 'pip' ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  PIP
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main ref={packageSectionRef} className="max-w-5xl mx-auto px-4 py-8 relative">
          
          {!searchQuery && (
            <section className="mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Library {filter === 'all' ? 'Semua' : filter.toUpperCase()}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                Daftar perintah instalasi untuk {filter === 'pip' ? 'library Python' : filter === 'pkg' ? 'paket sistem Termux' : 'berbagai kebutuhan development'}. 
                Cari dan salin perintah yang Anda butuhkan.
              </p>
            </section>
          )}

          {(searchQuery || filter !== 'all') && (
            <div className="mb-6 flex items-center animate-fade-up">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Menampilkan {Math.min(visibleCount, filteredPackages.length)} dari {filteredPackages.length} hasil
              </p>
            </div>
          )}

          {filteredPackages.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800 animate-scale-in">
              <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                <SearchIcon />
              </div>
              <h3 className="text-white font-bold text-lg">Tidak ditemukan</h3>
              <p className="text-zinc-500 text-sm mt-1">Tidak ada paket yang sesuai dengan kriteria Anda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {displayedPackages.map((pkg, index) => (
                  <div 
                    key={pkg.id} 
                    style={{ animationDelay: `${0.05 * (index % ITEMS_PER_PAGE)}s` }}
                    className={`animate-fade-up group relative bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col hover:bg-zinc-900 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-emerald-500/5 hover:border-emerald-500/30`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-600 group-hover:text-black`}>
                        <PackageIcon />
                      </div>
                      <div className="flex gap-1.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border transition-colors ${pkg.source === 'pip' ? 'bg-zinc-800 text-emerald-400 border-emerald-900/30 group-hover:border-emerald-500/50' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50 group-hover:border-emerald-500/50'}`}>
                          {pkg.source}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest border border-zinc-700/50">
                          {pkg.category}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-6 flex-1 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>
                    
                    <div className="space-y-1.5 mt-auto">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Perintah Instalasi:</span>
                      <CommandSnippet command={pkg.installCommand} />
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredPackages.length && (
                <div className="mt-12 flex justify-center animate-fade-up">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-2xl text-sm font-bold transition-all hover:scale-105 hover:border-emerald-500/50 shadow-xl shadow-black/50"
                  >
                    Tampilkan Lebih Banyak
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="max-w-5xl mx-auto px-4 mt-8 pb-4 text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full shadow-lg backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tighter">
              Data diperbarui secara berkala • Termux Package Library v1.0
            </span>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToPackages}
          className={`fixed bottom-8 right-8 p-4 rounded-full bg-emerald-600 text-black shadow-2xl shadow-emerald-500/40 border border-emerald-400/50 transition-all duration-500 z-[100] group ${showScrollTop ? 'translate-y-0 opacity-100 scale-100 rotate-0' : 'translate-y-20 opacity-0 scale-50 rotate-90'}`}
          aria-label="Scroll to Packages"
        >
          <div className="group-hover:-translate-y-1 transition-transform duration-300">
            <ArrowUpIcon />
          </div>
        </button>
      </div>
    </>
  );
};

export default App;
