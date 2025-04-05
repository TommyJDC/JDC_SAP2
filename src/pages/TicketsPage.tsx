import React from 'react';
import { Plus, Edit, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'; // Added icons

// Placeholder Data
const tickets = [
  { id: '#TKT-2023-056', client: 'Client A', subject: 'Problème de connexion SAP', status: 'Urgent', assignedTo: 'John Doe', date: '12/06/2023', statusClass: 'status-urgent' },
  { id: '#TKT-2023-055', client: 'Client B', subject: 'Formation utilisateur demandée', status: 'En cours', assignedTo: 'Sarah Miller', date: '11/06/2023', statusClass: 'status-in-progress' },
  { id: '#TKT-2023-054', client: 'Client C', subject: 'Mise à jour de module', status: 'Résolu', assignedTo: 'Alex Brown', date: '10/06/2023', statusClass: 'status-resolved' },
  // Add more tickets...
];

const TicketsPage: React.FC = () => {
  // Add state for modals, filters, pagination etc. later
  const openCreateTicketModal = () => {
    console.log("Open create ticket modal");
    // Implement modal logic here
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Gestion des Tickets SAP</h2>
        <button onClick={openCreateTicketModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Créer un ticket
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-white mb-4 md:mb-0">Filtres</h3>
          <div className="flex flex-wrap gap-2">
            <select className="input-field flex-grow md:flex-grow-0">
              <option>Tous les statuts</option>
              <option>Ouvert</option>
              <option>En cours</option>
              <option>Résolu</option>
              <option>Urgent</option>
            </select>
            <select className="input-field flex-grow md:flex-grow-0">
              <option>Tous les clients</option>
              <option>Client A</option>
              <option>Client B</option>
              <option>Client C</option>
            </select>
            <button className="btn-primary px-4 py-2 rounded">Appliquer</button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card p-0"> {/* Remove padding for full-width table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sujet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigné à</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${ticket.statusClass}`}>{ticket.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{ticket.date}</td>
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
                Affichage de <span className="font-medium text-white">1</span> à <span className="font-medium text-white">{tickets.length}</span> sur <span className="font-medium text-white">24</span> tickets
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Précédent</span>
                  <ChevronLeft size={20} />
                </button>
                {/* Current Page */}
                <button aria-current="page" className="z-10 bg-jdc-gray-dark border-jdc-yellow text-jdc-yellow relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                {/* Other Pages */}
                <button className="bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                {/* ... */}
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                  <span className="sr-only">Suivant</span>
                  <ChevronRight size={20} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Create/Edit Ticket Modal Component here */}
      {/* <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default TicketsPage;
