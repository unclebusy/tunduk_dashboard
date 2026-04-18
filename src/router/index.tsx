import { createBrowserRouter, Navigate } from 'react-router';
import App from '../App';
import CandidateDetailPage from '../pages/CandidateDetailPage';
import CandidatesListPage from '../pages/CandidatesListPage';
import NotFoundPage from '../pages/NotFoundPage';

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
        path: 'candidates/:candidateId',
        element: <CandidateDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
