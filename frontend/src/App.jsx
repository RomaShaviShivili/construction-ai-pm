import { useEffect, useState } from 'react';
import { HardHat, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { fetchProjects, fetchHealth } from './api';
import PortfolioStats from './components/PortfolioStats';
import ProjectCard from './components/ProjectCard';
import ChatPanel from './components/ChatPanel';
import { ka } from './i18n/ka';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openai, setOpenai] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [projs, health] = await Promise.all([fetchProjects(), fetchHealth()]);
      setProjects(projs);
      setOpenai(health.openai);
    } catch {
      setError(ka.apiError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-600/10 via-slate-950 to-slate-950 pointer-events-none" />

      <header className="relative border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/25">
              <HardHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-white">{ka.appName}</h1>
              <p className="text-xs text-slate-500">{ka.appTagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                openai
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {openai ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {openai ? ka.openaiConnected : ka.demoMode}
            </span>
            <button
              type="button"
              onClick={load}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={ka.refresh}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!error && projects.length > 0 && <PortfolioStats projects={projects} />}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-200">{ka.portfolioTitle}</h2>
              <span className="text-sm text-slate-500">{ka.sites(projects.length)}</span>
            </div>

            {loading && !projects.length ? (
              <div className="grid gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="glass rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </section>

          <section className="xl:col-span-1">
            <ChatPanel />
          </section>
        </div>
      </main>
    </div>
  );
}
