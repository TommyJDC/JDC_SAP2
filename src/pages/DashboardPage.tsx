import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, AlertTriangle, Truck, CheckCircle, User, MessageSquare } from 'lucide-react'; // Added icons

// Placeholder Data - Replace with actual data fetching
const stats = [
  { title: 'Tickets ouverts', value: '24', change: '+2 depuis hier', changeType: 'increase', icon: Ticket, iconColor: 'text-yellow-500' },
  { title: 'Tickets urgents', value: '5', change: '+1 depuis hier', changeType: 'increase', icon: AlertTriangle, iconColor: 'text-red-500' },
  { title: 'Envois en cours', value: '8', change: '3 à livrer aujourd\'hui', changeType: 'info', icon: Truck, iconColor: 'text-blue-500' },
  { title: 'Tickets résolus (7j)', value: '18', change: '+25% vs semaine dernière', changeType: 'increase', icon: CheckCircle, iconColor: 'text-green-500' },
];

const recentTickets = [
  { id: '#TKT-2023-056', client: 'Client A', status: 'Urgent', date: '12/06/2023', statusClass: 'status-urgent' },
  { id: '#TKT-2023-055', client: 'Client B', status: 'En cours', date: '11/06/2023', statusClass: 'status-in-progress' },
  { id: '#TKT-2023-054', client: 'Client C', status: 'Résolu', date: '10/06/2023', statusClass: 'status-resolved' },
];

const recentShipments = [
  { id: '#SHP-2023-045', client: 'Client X', status: 'Livré', date: '12/06/2023', statusClass: 'status-delivered' },
  { id: '#SHP-2023-044', client: 'Client Y', status: 'Expédié', date: '11/06/2023', statusClass: 'status-shipped' },
  { id: '#SHP-2023-043', client: 'Client Z', status: 'Préparé', date: '10/06/2023', statusClass: 'status-prepared' },
];

const recentActivity = [
    { user: 'John Doe', initials: 'JD', action: 'a créé un nouveau ticket #TKT-2023-056', time: 'Il y a 2 heures' },
    { user: 'Sarah Miller', initials: 'SM', action: 'a mis à jour le statut de #SHP-2023-045 à "Livré"', time: 'Il y a 5 heures' },
    { user: 'Alex Brown', initials: 'AB', action: 'a résolu le ticket #TKT-2023-050', time: 'Hier à 16:30' },
];

const DashboardPage: React.FC = () => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1 text-white">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-gray-800">
                <stat.icon size={24} className={stat.iconColor} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className={`text-sm flex items-center ${stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-400'}`}>
                {stat.changeType !== 'info' && (
                  <span className={`w-2 h-2 rounded-full mr-2 ${stat.changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                )}
                <span>{stat.change}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets & Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Tickets */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Tickets récents</h3>
            <Link to="/tickets" className="text-sm text-jdc-yellow hover:underline">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{ticket.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{ticket.client}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`status-badge ${ticket.statusClass}`}>{ticket.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Envois récents</h3>
            <Link to="/shipments" className="text-sm text-jdc-yellow hover:underline">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{shipment.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{shipment.client}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`status-badge ${shipment.statusClass}`}>{shipment.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{shipment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
       <div className="card">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Activité récente</h3>
              <button className="text-sm text-jdc-yellow hover:underline">Filtrer</button>
          </div>
          <div className="space-y-5">
              {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="font-medium text-sm text-white">{activity.initials}</span>
                          </div>
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="text-sm">
                              <span className="font-medium text-white">{activity.user}</span>
                              <span className="text-gray-300"> {activity.action}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default DashboardPage;
