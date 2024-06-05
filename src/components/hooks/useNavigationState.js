import { useLocation } from 'react-router-dom';

export const useNavigationState = () => {
  const location = useLocation();
  return location.state || {};
};
