import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; // Added icons

// Placeholder Data
const users = [
  { id: '1', name: 'John Doe', email: 'john.doe@jdc.com', role: 'Admin', roleType: 'admin', lastLogin: '12/06/2023 09:45', initials: 'JD' },
  { id: '2', name: 'Sarah Miller', email: 'sarah.miller@jdc.com', role: 'Technicien', roleType: 'tech', lastLogin: '11/06/2023 14:30', initials: 'SM' },
  { id: '3', name: 'Alex Brown', email: 'alex.brown@jdc.com', role: 'Commercial', roleType: 'sales', lastLogin: '10/06/2023 11:15', initials: 'AB' },
  // Add more users...
];

const getRoleBadgeClass = (roleType: string): string => {
  switch (roleType) {
    case 'admin': return 'bg-yellow-500 bg-opacity-20 text-yellow-500';
    case 'tech': return 'bg-blue-500 bg-opacity-20 text-blue-500';
    case 'sales': return 'bg-green-500 bg-opacity-20 text-green-500';
    default: return 'bg-gray-500 bg-opacity-20 text-gray-500';
  }
};

const UsersPage: React.FC = () => {
  const openCreateUserModal = () => {
    console.log("Open create user modal");
    // Implement modal logic here
  };

  const editUser = (userId: string) => {
    console.log("Edit user:", userId);
    // Implement edit logic
  };

  const deleteUser = (userId: string) => {
    console.log("Delete user:", userId);
    // Implement delete logic (with confirmation)
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
        <button onClick={openCreateUserModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Users Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="font-medium text-white">{user.initials}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        {/* Optional: Display role below name if needed */}
                        {/* <div className="text-sm text-gray-400">{user.role}</div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeClass(user.roleType)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => editUser(user.id)} className="text-jdc-yellow hover:text-yellow-400 inline-flex items-center">
                      <Edit size={16} className="mr-1" /> Modifier
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="text-red-500 hover:text-red-400 inline-flex items-center">
                      <Trash2 size={16} className="mr-1" /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add Pagination if needed */}
      </div>
      {/* Add Create/Edit User Modal Component here */}
    </div>
  );
};

export default UsersPage;
