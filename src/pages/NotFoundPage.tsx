import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-6">
      <AlertTriangle size={64} className="text-jdc-yellow mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Non Trouvée</h1>
      <p className="text-lg text-gray-400 mb-6">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link to="/" className="btn-primary">
        Retour au Tableau de bord
      </Link>
    </div>
  );
};

export default NotFoundPage;
