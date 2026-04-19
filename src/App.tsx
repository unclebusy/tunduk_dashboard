import './styles.css';
import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import logo from './assets/logo.svg';
import { useCandidatesStore } from './store/useCandidatesStore';

function App() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const isCandidateDetailPage = pathname.startsWith('/candidate/');
  const dataset = useCandidatesStore((state) => state.dataset);
  const setCandidatesDataset = useCandidatesStore(
    (state) => state.setCandidatesDataset,
  );
  const isDatasetLoading = useCandidatesStore((state) => state.isCandidatesLoading);
  const candidatesLink = {
    pathname: '/candidates',
    search,
  };

  useEffect(() => {
    void setCandidatesDataset(dataset);
  }, [dataset, setCandidatesDataset]);

  const isLargeDataset = dataset === 'large';

  return (
    <div className="min-h-screen bg-[--color-page] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Логотип Тундук"
                className="h-9 w-9 shrink-0 object-contain"
              />
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Тундук
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium tracking-[0.24em] text-slate-500 sm:text-base">
              Панель управления кандидатами
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 self-start sm:items-end sm:self-auto">
            {isCandidateDetailPage ? (
              <nav className="flex items-center gap-2">
                <Link
                  to={candidatesLink}
                  className="cursor-pointer rounded-lg bg-[#1560BD] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f4a92]"
                >
                  ← Кандидаты
                </Link>
              </nav>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                Раздел: Кандидаты
              </div>
            )}

            <button
              type="button"
              role="switch"
              aria-checked={isLargeDataset}
              disabled={isDatasetLoading}
              onClick={() => {
                const nextDataset = isLargeDataset ? 'default' : 'large';
                void setCandidatesDataset(nextDataset).then(() => {
                  if (pathname !== '/candidates') {
                    navigate(candidatesLink);
                  }
                });
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                Большой список
              </span>
              <span
                className={[
                  'relative h-5 w-10 rounded-full transition-colors',
                  isLargeDataset ? 'bg-[#1560BD]' : 'bg-slate-300',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                    isLargeDataset ? 'translate-x-5' : 'translate-x-0.5',
                  ].join(' ')}
                />
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster
        position="top-right"
        richColors
        expand={false}
        closeButton
        toastOptions={{
          classNames: {
            toast: 'border border-slate-200 shadow-lg',
            title: 'text-sm font-medium',
          },
        }}
      />
    </div>
  );
}

export default App;
