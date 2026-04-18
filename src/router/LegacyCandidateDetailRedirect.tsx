import { Navigate, useLocation, useParams } from 'react-router';

function LegacyCandidateDetailRedirect() {
  const { candidateId } = useParams();
  const { search } = useLocation();

  return <Navigate to={`/candidate/${candidateId ?? ''}${search}`} replace />;
}

export default LegacyCandidateDetailRedirect;
