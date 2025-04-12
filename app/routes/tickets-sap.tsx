import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation, Form, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllSapTickets, ALL_SECTORS_KEY } from "~/services/ticketService"; // Keep import
import type { TicketSap } from "~/types/ticket";
import { formatFrenchDateTime } from "~/utils/dateUtils";
import { useAuth } from "~/root"; // Import useAuth

export const meta: MetaFunction = () => {
  return [{ title: "Tickets SAP - JDC Dashboard" }];
};

// Define possible sector values including 'Tous'
const VALID_SECTORS = ['Tous', 'Kezia', 'HACCP', 'CHR', 'Tabac'];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const selectedSectorParam = url.searchParams.get("secteur");

  // Validate the sector parameter, default to 'Tous' if invalid or missing
  const selectedSector = (selectedSectorParam && VALID_SECTORS.includes(selectedSectorParam))
    ? selectedSectorParam
    : ALL_SECTORS_KEY;

  console.log(`Loader: Selected sector - ${selectedSector}`); // Log selected sector

  try {
    // --- TEMPORARILY COMMENT OUT THE FIRESTORE CALL ---
    // const tickets = await getAllSapTickets(50, selectedSector); // Fetch 50 tickets for the selected sector
    // console.log(`Loader: Fetched ${tickets.length} tickets`);
    const tickets: TicketSap[] = []; // Return empty array for testing
    // --- END TEMPORARY CHANGE ---

    return json({ tickets, selectedSector, error: null });

  } catch (error) {
    console.error("Error in tickets-sap loader:", error);
    // Return error state to the component
    let errorMessage = "Erreur inconnue lors du chargement des tickets.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
     // Return empty array and the error message
    return json({ tickets: [], selectedSector, error: errorMessage }, { status: 500 });
  }
};


export default function TicketsSapRoute() {
  const { tickets, selectedSector, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const { userData } = useAuth(); // Get user data for role check

  const isLoading = navigation.state === "loading";
  const showSectorColumn = selectedSector === ALL_SECTORS_KEY;

  // State to manage the dropdown value separately to avoid conflicts
  const [filterValue, setFilterValue] = useState(selectedSector);

  // Update local filter value when loader data changes (e.g., back/forward navigation)
  useEffect(() => {
    setFilterValue(selectedSector);
  }, [selectedSector]);

  // Handle form submission on dropdown change
  function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = event.target.value;
    setFilterValue(newValue); // Update local state immediately
    // Submit the form programmatically
    submit(event.currentTarget.form);
  }

   // Display error toast if loader returned an error
  useEffect(() => {
    if (error) {
      toast.error(`Erreur: ${error}`);
    }
  }, [error]);

  // Check if user has the required role
  // Add more roles as needed (e.g., 'Commercial', 'Admin')
  const canViewPage = userData?.role === 'Technicien' || userData?.role === 'Admin';

  if (!canViewPage) {
     return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-jdc-yellow">Accès non autorisé</h1>
        <p className="text-jdc-gray-300">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
         {/* Optionally add a link back to dashboard or home */}
         {/* <Link to="/dashboard" className="text-jdc-blue hover:underline mt-4 inline-block">Retour au tableau de bord</Link> */}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-jdc-yellow">Tickets SAP Récents</h1>

      {/* Filter Form */}
      <Form method="get" className="mb-6 max-w-xs">
         <label htmlFor="secteur-filter" className="block text-sm font-medium text-jdc-gray-300 mb-1">
          Filtrer par secteur :
        </label>
        <select
          id="secteur-filter"
          name="secteur"
          value={filterValue} // Controlled component using local state
          onChange={handleFilterChange} // Use the handler
          className="block w-full p-2 border border-jdc-blue bg-jdc-card text-jdc-gray-100 rounded-md shadow-sm focus:ring-jdc-yellow focus:border-jdc-yellow"
        >
          <option value="Tous">Tous les secteurs</option>
          <option value="Kezia">Kezia</option>
          <option value="HACCP">HACCP</option>
          <option value="CHR">CHR</option>
          <option value="Tabac">Tabac</option>
        </select>
        {/* No submit button needed as it submits onChange */}
      </Form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-jdc-gray-400">Chargement des tickets...</p>
          {/* Optional: Add a spinner */}
        </div>
      )}

      {/* Error Display */}
      {error && !isLoading && (
         <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}


      {/* Tickets Table - Only show if not loading and no critical error */}
      {!isLoading && !error && (
        <div className="overflow-x-auto bg-jdc-card rounded-lg shadow">
          <table className="min-w-full divide-y divide-jdc-gray-700">
            <thead className="bg-jdc-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">N° SAP</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">Raison Sociale</th>
                {showSectorColumn && (
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">Secteur</th>
                )}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">Date Création</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-jdc-gray-300 uppercase tracking-wider">Demande</th>
              </tr>
            </thead>
            <tbody className="bg-jdc-card divide-y divide-jdc-gray-700">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-jdc-gray-800 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-jdc-gray-100">{ticket.numeroSAP}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-jdc-gray-100">{ticket.raisonSociale}</td>
                    {showSectorColumn && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-jdc-gray-300">{ticket.secteur}</td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-jdc-gray-300">
                      {/* Format the Timestamp or fallback to raw string */}
                      {ticket.dateCreation ? formatFrenchDateTime(ticket.dateCreation.toDate()) : ticket.date || 'Date inconnue'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.mappedStatut === 'Fermé' ? 'bg-red-700 text-red-100' :
                          ticket.mappedStatut === 'Résolu' ? 'bg-green-700 text-green-100' :
                          ticket.mappedStatut === 'En cours' ? 'bg-yellow-600 text-yellow-100' :
                          ticket.mappedStatut === 'Ouvert' ? 'bg-blue-600 text-blue-100' :
                          ticket.mappedStatut === 'En attente' ? 'bg-purple-600 text-purple-100' :
                          'bg-gray-600 text-gray-100' // Default for 'Inconnu' or others
                        }`}>
                        {ticket.mappedStatut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-jdc-gray-300 truncate max-w-xs">{ticket.demandeSAP}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  {/* Adjust colspan based on whether sector column is shown */}
                  <td colSpan={showSectorColumn ? 6 : 5} className="px-4 py-4 text-center text-sm text-jdc-gray-500">
                    Aucun ticket trouvé pour le secteur sélectionné.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
