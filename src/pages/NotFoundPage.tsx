import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Страница не найдена
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Такой страницы нет в текущем приложении.
          </p>
        </div>

        <Link
          to="/candidates"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
        >
          Перейти к кандидатам
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
