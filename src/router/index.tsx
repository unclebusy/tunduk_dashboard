import { createBrowserRouter, Navigate, useLocation, useParams } from 'react-router';
import App from '../App';
import CandidateDetailPage from '../pages/CandidateDetailPage';
import CandidatesListPage from '../pages/CandidatesListPage';
import NotFoundPage from '../pages/NotFoundPage';

function LegacyCandidateDetailRedirect() {
  const { candidateId } = useParams();
  const { search } = useLocation();

  return <Navigate to={`/candidate/${candidateId ?? ''}${search}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/candidates" replace />,
      },
      {
        path: 'candidates',
        element: <CandidatesListPage />,
      },
      {
        path: 'candidate/:candidateId',
        element: <CandidateDetailPage />,
      },
      {
        path: 'candidates/:candidateId',
        element: <LegacyCandidateDetailRedirect />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
