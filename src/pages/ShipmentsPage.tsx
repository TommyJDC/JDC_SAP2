import React from 'react';
import { Plus, Edit, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

// Placeholder Data
const shipments = [
  { id: '#SHP-2023-045', client: 'Client X', material: 'Serveur HP DL380', tracking: 'TRK123456789', status: 'Livré', date: '12/06/2023', statusClass: 'status-delivered' },
  { id: '#SHP-2023-044', client: 'Client Y', material: 'Switch Cisco 2960X', tracking: 'TRK987654321', status: 'Expédié', date: '11/06/2023', statusClass: 'status-shipped' },
  { id: '#SHP-2023-043', client: 'Client Z', material: 'Firewall FortiGate 100F', tracking: 'TRK456789123', status: 'Préparé', date: '10/06/2023', statusClass: 'status-prepared' },
  // Add more shipments...
];

const ShipmentsPage: React.FC = () => {
  const openCreateShipmentModal = () => {
    console.log("Open create shipment modal");
    // Implement modal logic here
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Suivi des Envois CTN</h2>
        <button onClick={openCreateShipmentModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Nouvel envoi
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-white mb-4 md:mb-0">Filtres</h3>
          <div className="flex flex-wrap gap-2">
            <select className="input-field flex-grow md:flex-grow-0">
              <option>Tous les statuts</option>
              <option>Préparé</option>
              <option>Expédié</option>
              <option>Livré</option>
            </select>
            <select className="input-field flex-grow md:flex-grow-0">
              <option>Tous les clients</option>
              <option>Client X</option>
              <option>Client Y</option>
              <option>Client Z</option>
            </select>
            <input type="date" className="input-field flex-grow md:flex-grow-0" />
            <button className="btn-primary px-4 py-2 rounded">Appliquer</button>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Matériel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">N° de suivi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{shipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{shipment.material}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{shipment.tracking}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${shipment.statusClass}`}>{shipment.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{shipment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-jdc-yellow hover:text-yellow-400 mr-3 inline-flex items-center">
                      <Edit size={16} className="mr-1" /> Modifier
                    </button>
                    <button className="text-gray-400 hover:text-gray-200 inline-flex items-center">
                      <MoreHorizontal size={16} className="mr-1" /> Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-800">
          {/* Mobile Pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-400 bg-gray-800 hover:bg-gray-700">
              Précédent
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-400 bg-gray-800 hover:bg-gray-700">
              Suivant
            </button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Affichage de <span className="font-medium text-white">1</span> à <span className="font-medium text-white">{shipments.length}</span> sur <span className="font-medium text-white">8</span> envois
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Précédent</span>
                  <ChevronLeft size={20} />
                </button>
                <button aria-current="page" className="z-10 bg-jdc-gray-dark border-jdc-yellow text-jdc-yellow relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                {/* Add more page numbers if needed */}
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Suivant</span>
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Add Create/Edit Shipment Modal Component here */}
    </div>
  );
};

export default ShipmentsPage;
