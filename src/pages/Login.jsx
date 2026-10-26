import { useLocation } from 'react-router';
import AuthForm from '../components/auth/AuthForm.jsx';

export default function Login({ onLogin }) {
  const location = useLocation();

  return (
    <AuthForm
      mode="login"
      onLogin={onLogin}
      notice={location.state?.notice ?? ''}
    />
  );
}