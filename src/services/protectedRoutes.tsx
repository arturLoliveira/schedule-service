import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [fetchingRole, setFetchingRole] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserRole(userDoc.data()?.role || null); // Assumindo que "role" está salvo no Firestore
          }
        }
      } catch (err) {
        console.error("Erro ao buscar papel do usuário:", err);
        setError("Erro ao verificar papel do usuário.");
      } finally {
        setFetchingRole(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading || fetchingRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">Acesso negado. Contate o administrador.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
