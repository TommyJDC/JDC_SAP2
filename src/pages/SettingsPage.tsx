import React from 'react';
import { Save, Upload, Database, RotateCcw } from 'lucide-react'; // Added icons

const SettingsPage: React.FC = () => {
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving general settings...");
    // Add save logic
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving ticket settings...");
    // Add save logic
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Paramètres</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Forms) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Paramètres généraux</h3>
            <form onSubmit={handleGeneralSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-300">Nom de l'entreprise</label>
                  <input type="text" id="companyName" className="input-field" defaultValue="JDC" />
                </div>
                <div>
                  <label htmlFor="timezone" className="block mb-2 text-sm font-medium text-gray-300">Fuseau horaire</label>
                  <select id="timezone" className="input-field">
                    <option>Europe/Paris</option>
                    <option>UTC</option>
                    {/* Add more timezones */}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="logo" className="block mb-2 text-sm font-medium text-gray-300">Logo</label>
                <div className="flex items-center">
                  <input type="file" id="logo" className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-jdc-yellow file:text-black hover:file:bg-yellow-500 cursor-pointer" />
                  {/* Optionally display current logo preview */}
                </div>
              </div>
              <button type="submit" className="btn-primary flex items-center">
                <Save size={18} className="mr-2" /> Enregistrer
              </button>
            </form>
          </div>

          {/* Ticket Settings */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Paramètres des tickets</h3>
            <form onSubmit={handleTicketSubmit}>
              <div className="space-y-4 mb-6">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-jdc-yellow focus:ring-jdc-yellow focus:ring-offset-jdc-gray-dark" />
                  <span className="ml-2 text-sm text-gray-300">Activer les notifications par email</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-800 border-gray-700 text-jdc-yellow focus:ring-jdc-yellow focus:ring-offset-jdc-gray-dark" />
                  <span className="ml-2 text-sm text-gray-300">Exiger une description détaillée</span>
                </label>
              </div>
              <div className="mb-6">
                <label htmlFor="sla" className="block mb-2 text-sm font-medium text-gray-300">SLA par défaut (heures)</label>
                <input type="number" id="sla" className="input-field w-full md:w-1/2" defaultValue="24" min="1" />
              </div>
              <button type="submit" className="btn-primary flex items-center">
                <Save size={18} className="mr-2" /> Enregistrer
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (Stats & Backup) */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Utilisateurs actifs</p>
                <p className="text-xl font-bold text-white">12</p> {/* Placeholder */}
              </div>
              <div>
                <p className="text-sm text-gray-400">Tickets ce mois-ci</p>
                <p className="text-xl font-bold text-white">56</p> {/* Placeholder */}
              </div>
              <div>
                <p className="text-sm text-gray-400">Envois ce mois-ci</p>
                <p className="text-xl font-bold text-white">23</p> {/* Placeholder */}
              </div>
            </div>
          </div>

          {/* Backup */}
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Sauvegarde & Restauration</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Dernière sauvegarde</p>
              <p className="text-sm text-white">11/06/2023 02:00</p> {/* Placeholder */}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary px-4 py-2 rounded flex-1 flex items-center justify-center">
                <Database size={18} className="mr-2" /> Sauvegarder
              </button>
              <button className="px-4 py-2 rounded border border-gray-700 hover:bg-gray-800 text-gray-300 flex-1 flex items-center justify-center">
                <RotateCcw size={18} className="mr-2" /> Restaurer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
