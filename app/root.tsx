import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase.config";
import { getUserData } from "./services/userService"; // Import user service
import type { UserData } from "./types/user"; // Import UserData type

// Import CSS files
import tailwindStyles from "./tailwind.css?url";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import globalStylesUrl from "./styles/global.css?url";

// Import Components
import { Header } from "./components/Header";
import { MobileMenu } from "./components/MobileMenu";
import { AuthModal } from "./components/AuthModal";

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  userData: UserData | null; // Add userData state
  loadingAuth: boolean;
  loadingRole: boolean; // Add loading state for role/userData
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore user data
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingRole, setLoadingRole] = useState(false); // Initially false, true when fetching role

  useEffect(() => {
    setLoadingAuth(true); // Start auth loading
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingRole(true); // Start loading role data
        try {
          const fetchedUserData = await getUserData(currentUser.uid);
          setUserData(fetchedUserData);
          if (!fetchedUserData) {
            // This case might happen if user doc creation failed or is delayed
            // Or if an existing auth user doesn't have a corresponding doc yet
            console.warn(`User document not found for ${currentUser.uid}. Role might be unavailable.`);
            // Optionally, you could attempt to create the doc here if it's missing
            // Or assign a default local state like { role: 'Pending' }
          }
        } catch (error) {
          console.error("Failed to fetch user data on auth change:", error);
          setUserData(null); // Ensure userData is null on error
          toast.error("Erreur lors de la récupération des informations utilisateur.");
        } finally {
          setLoadingRole(false); // Stop loading role data
        }
      } else {
        // No user logged in
        setUserData(null); // Clear user data on logout
        setLoadingRole(false); // Not loading role if not logged in
      }
      setLoadingAuth(false); // Stop auth loading once user state and potentially role are determined
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loadingAuth, loadingRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// --- End Auth Context ---


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: leafletStyles },
  { rel: "stylesheet", href: globalStylesUrl },
];

export const meta: MetaFunction = () => {
  return [
    { title: "JDC Dashboard" },
    { name: "description", content: "JDC Technical Management Dashboard" },
  ];
};


function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Get user, userData, and loading states from context
  const { user, userData, loadingAuth, loadingRole } = useAuth();
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Déconnexion réussie !');
      // User state and userData will update via onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error('Erreur lors de la déconnexion.');
    }
  };

  // Enhanced loading state: show loading if either auth check or role fetch is in progress
  if (loadingAuth || (user && loadingRole)) {
    return (
       <html lang="fr">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="min-h-screen bg-jdc-black flex items-center justify-center">
          {/* More specific loading message */}
          <p className="text-jdc-yellow text-xl">
            {loadingAuth ? 'Vérification de l\'authentification...' : 'Chargement des informations utilisateur...'}
          </p>
          <Scripts />
        </body>
      </html>
    );
  }


  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-jdc-black text-jdc-gray-300 font-sans">
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '',
            style: { background: '#333', color: '#fff' },
            success: { style: { background: '#10B981' }, iconTheme: { primary: '#fff', secondary: '#10B981' } },
            error: { style: { background: '#EF4444' }, iconTheme: { primary: '#fff', secondary: '#EF4444' } },
          }}
        />

        <div className="flex flex-col min-h-screen">
          <Header
            user={user}
            userData={userData} // Pass userData to Header
            onToggleMobileMenu={toggleMobileMenu}
            onLoginClick={openAuthModal}
            onLogoutClick={handleLogout}
          />

          <MobileMenu
            isOpen={isMobileMenuOpen}
            user={user}
            userData={userData} // Pass userData to MobileMenu
            onClose={toggleMobileMenu}
            onLoginClick={openAuthModal}
            onLogoutClick={handleLogout}
          />

          <main className="flex-grow p-4 md:p-6 lg:p-8">
            {/* Pass userData to Outlet context if needed, or use useAuth() in child routes */}
            <Outlet context={{ user, userData }} />
          </main>
        </div>

        {!user && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
          />
        )}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

// --- Error Boundary (Keep as is) ---
export function ErrorBoundary() {
  const error = useRouteError();

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  let errorMessage = "Une erreur inattendue est survenue.";
  let errorStatus = 500;
  let errorTitle = "Oops!";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText || "Erreur serveur";
    errorStatus = error.status;
    errorTitle = `Erreur ${errorStatus}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const tailwindHref = tailwindStyles || "/tailwind.css";
  const globalHref = globalStylesUrl || "/styles/global.css";

  return (
    <html lang="fr">
      <head>
        <title>{errorTitle}</title>
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href={tailwindHref} />
        <link rel="stylesheet" href={globalHref} />
        <link rel="stylesheet" href={leafletStyles || "/leaflet.css"} />
      </head>
      <body className="min-h-screen bg-jdc-black text-jdc-gray-300 font-sans flex items-center justify-center p-4">
        <div className="text-center p-8 bg-jdc-card rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-4xl font-bold text-jdc-yellow mb-4">{errorTitle}</h1>
          <p className="text-xl text-jdc-gray-300 mb-6">{errorMessage}</p>
          <a href="/" className="inline-block bg-jdc-yellow text-jdc-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
            Retour à l'accueil
          </a>
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <pre className="mt-6 p-4 bg-gray-800 text-left text-sm text-red-400 rounded overflow-auto">
              {error.stack}
            </pre>
          )}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
