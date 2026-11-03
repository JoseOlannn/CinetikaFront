import AuthForm from '../components/auth/AuthForm.jsx';

export default function Register({ onLogin }) {
  return <AuthForm mode="register" onLogin={onLogin} />;
}
