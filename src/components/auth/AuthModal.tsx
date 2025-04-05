import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// import { Building } from 'lucide-react'; // Removed placeholder icon
import LoadingSpinner from '../common/LoadingSpinner';

const AuthModal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email, password);
      // Login success is handled by the AuthProvider redirecting or updating state
    } catch (err: any) {
      console.error(err);
      setError('Échec de la connexion. Vérifiez vos identifiants.'); // Provide user-friendly error
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-jdc-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          {/* Use the provided JDC logo */}
          <img
            src="https://www.jdc.fr/images/logo_jdc_blanc.svg"
            alt="JDC Logo"
            className="h-10" // Adjust height as needed
          />
          {/* <Building size={48} className="text-jdc-yellow" /> */}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              placeholder="votreadresse@jdc.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full py-2 rounded font-medium flex items-center justify-center"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <LoadingSpinner size={20} className="text-black" /> : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
