import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { auth } from '~/firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthErrorCodes,
  UserCredential // Import UserCredential
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { createUserDocument } from '~/services/userService'; // Import user service function

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setMode('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Connexion réussie !');
        // User data fetching is handled by AuthProvider's onAuthStateChanged
        handleClose();
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        // 1. Create user in Firebase Auth
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // 2. Create user document in Firestore with 'Pending' role
        if (newUser) {
          try {
            await createUserDocument(newUser, 'Pending'); // Assign 'Pending' role by default
            toast.success('Inscription réussie ! Votre compte est en attente de validation.');
            // User data fetching (including the new doc) is handled by AuthProvider
          } catch (firestoreError) {
            console.error("Error creating Firestore document:", firestoreError);
            // Optional: Delete the Firebase Auth user if Firestore creation fails? Complex rollback.
            // For now, just notify the user. The admin might need to manually create the doc or assign role.
            toast.error("Erreur lors de la finalisation de l'inscription. Contactez l'administrateur.");
            // Log out the partially created user?
            await auth.signOut();
          }
        } else {
           throw new Error("La création de l'utilisateur a échoué.");
        }
        handleClose();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        toast.success('Email de réinitialisation envoyé. Vérifiez votre boîte de réception.');
        setMode('login');
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      let errorMessage = "Une erreur est survenue.";
      // Simplified error handling (keep existing logic)
      if (err.code) {
        switch (err.code) {
          case AuthErrorCodes.INVALID_EMAIL: errorMessage = "L'adresse e-mail n'est pas valide."; break;
          case AuthErrorCodes.USER_DELETED: errorMessage = "Aucun utilisateur trouvé avec cette adresse e-mail."; break;
          case AuthErrorCodes.INVALID_PASSWORD: errorMessage = "Mot de passe incorrect."; break;
          case AuthErrorCodes.EMAIL_EXISTS: errorMessage = "Cette adresse e-mail est déjà utilisée."; break;
          case AuthErrorCodes.WEAK_PASSWORD: errorMessage = "Le mot de passe doit comporter au moins 6 caractères."; break;
          default: errorMessage = err.message || "Erreur d'authentification.";
        }
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Connexion';
      case 'signup': return 'Inscription';
      case 'reset': return 'Réinitialiser le mot de passe';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-jdc-card rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-jdc-gray-400 hover:text-white text-2xl"
          aria-label="Fermer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">{getTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Adresse e-mail"
          />

          {mode !== 'reset' && (
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode !== 'reset'}
              aria-label="Mot de passe"
            />
          )}

          {mode === 'signup' && (
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-label="Confirmer le mot de passe"
            />
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Chargement...' : getTitle()}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' && (
            <>
              <p className="text-jdc-gray-400">
                Pas encore de compte ?{' '}
                <button onClick={() => setMode('signup')} className="text-jdc-yellow hover:underline focus:outline-none">
                  Inscrivez-vous
                </button>
              </p>
              <p className="mt-2 text-jdc-gray-400">
                Mot de passe oublié ?{' '}
                <button onClick={() => setMode('reset')} className="text-jdc-yellow hover:underline focus:outline-none">
                  Réinitialiser
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-jdc-gray-400">
              Déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="text-jdc-yellow hover:underline focus:outline-none">
                Connectez-vous
              </button>
            </p>
          )}
          {mode === 'reset' && (
            <p className="text-jdc-gray-400">
              Retour à la{' '}
              <button onClick={() => setMode('login')} className="text-jdc-yellow hover:underline focus:outline-none">
                Connexion
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
